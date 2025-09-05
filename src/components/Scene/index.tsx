import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface SceneProps {
  onSceneChange?: (scene: 'exterior' | 'interior' | 'transitioning') => void;
}

export interface SceneRef {
  triggerInteriorView: () => void;
  setAerialView: () => void;
  setNormalView: () => void;
}

const Scene = forwardRef<SceneRef, SceneProps>(({ onSceneChange }, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState<'exterior' | 'interior' | 'transitioning'>('exterior');
  
  // Store references for scene objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const farmBuildingsRef = useRef<THREE.Group[]>([]);
  const fishArrayRef = useRef<THREE.Object3D[]>([]);
  const cloudSpritesRef = useRef<THREE.Sprite[]>([]);
  const openableRef = useRef<THREE.Object3D[]>([]);
  const interiorClickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const raycastRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2 | null>(null);
  const currentSceneRef = useRef<'exterior' | 'interior' | 'transitioning'>('exterior');
  const controlsRef = useRef<any>(null);
  
  // Animation state for smooth transitions
  const transitionRef = useRef({
    isTransitioning: false,
    startTime: 0,
    duration: 2000, // 2 seconds transition
    startPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endPosition: new THREE.Vector3(0, 2, 3),
    endTarget: new THREE.Vector3(0, 0, 0),
    clickedFarmPosition: new THREE.Vector3()
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    triggerInteriorView: () => {
      console.log('Manual interior view triggered');
      // Simulate clicking the first farm building to trigger interior view
      if (currentSceneRef.current === 'exterior' && farmBuildingsRef.current.length > 0) {
        const farm = farmBuildingsRef.current[0];
        let farmPosition = new THREE.Vector3();
        farm.getWorldPosition(farmPosition);
        
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (camera && controls) {
          // Store starting position and target
          transitionRef.current.startPosition.copy(camera.position);
          transitionRef.current.startTarget.copy(controls.target);
          transitionRef.current.clickedFarmPosition.copy(farmPosition);
          
          // Disable controls during transition
          controls.enabled = false;
          
          // Start transition
          transitionRef.current.isTransitioning = true;
          transitionRef.current.startTime = Date.now();
          setCurrentScene('transitioning');
        }
      }
    },
    setAerialView: () => {
      console.log('Setting aerial view');
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (camera && controls && currentSceneRef.current === 'exterior') {
        // Temporarily adjust control limits to allow aerial view
        controls.minPolarAngle = 0; // Allow fully vertical view from above
        controls.maxPolarAngle = Math.PI / 2.1; // Allow aerial angles
        controls.minDistance = 15; // Minimum height for aerial view
        controls.maxDistance = 60; // Maximum height
        
        // Set aerial view position - high above looking down
        camera.position.set(0, 30, 0);
        camera.lookAt(0, 0, 0);
        
        // Update controls target and position
        controls.target.set(0, 0, 0);
        controls.update();
      }
    },
    setNormalView: () => {
      console.log('Setting normal view');
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (camera && controls && currentSceneRef.current === 'exterior') {
        // Restore original control limits
        controls.minDistance = 8; // Allow closer inspection
        controls.maxDistance = 60; // Reasonable maximum distance
        controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below ground
        controls.minPolarAngle = Math.PI / 6; // Prevent going too high above
        
        // Set normal view position
        camera.position.set(5, 1.75, 5);
        camera.lookAt(0, 0.5, 0);
        
        // Update controls target and position
        controls.target.set(0, 1, 0);
        controls.update();
      }
    }
  }));

  // Keep scene ref in sync with state
  useEffect(() => {
    currentSceneRef.current = currentScene;
    onSceneChange?.(currentScene);
  }, [currentScene, onSceneChange]);

  // Initialize Three.js setup
  useEffect(() => {
    if (!mountRef.current) return;
    
    const mountElement = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x001122, 0.3);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Ensure canvas receives mouse events
    renderer.domElement.style.pointerEvents = 'auto';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '0';
    
    mountElement.appendChild(renderer.domElement);
    
    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    
    // Initialize raycaster and mouse for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    raycastRef.current = raycaster;
    mouseRef.current = mouse;

    // --- Helpers: Exterior environment (sky, clouds, roads, steps) ---
    const addExteriorEnvironment = () => {
      // Subtle outdoor fog blending distant ground into sky
      scene.fog = new THREE.Fog(0x87ceeb, 30, 120);

      // Big gradient sky dome (backside)
      const createSkyDome = () => {
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
          side: THREE.BackSide,
          depthWrite: false,
          uniforms: {
            topColor: { value: new THREE.Color(0x8ec5ff) },
            bottomColor: { value: new THREE.Color(0xeef8ff) },
            offset: { value: 33.0 },
            exponent: { value: 0.6 }
          },
          vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPosition.xyz;
              gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
              float h = normalize(vWorldPosition).y;
              float t = max(pow(max(h + offset * 0.001, 0.0), exponent), 0.0);
              vec3 color = mix(bottomColor, topColor, t);
              gl_FragColor = vec4(color, 1.0);
            }
          `
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(sky);
      };

      // Generate a soft cloud texture via canvas
      const createCloudTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.7;

        // Draw several blurred circles to form a fluffy cloud
        const drawPuff = (x: number, y: number, r: number) => {
          const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
          grad.addColorStop(0, 'rgba(255,255,255,0.9)');
          grad.addColorStop(1, 'rgba(255,255,255,0.0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        };

        const baseX = 90 + Math.random() * 40;
        const baseY = 60 + Math.random() * 10;
        drawPuff(baseX, baseY, 50);
        drawPuff(baseX - 35, baseY + 5, 35);
        drawPuff(baseX + 35, baseY + 10, 40);
        drawPuff(baseX, baseY + 15, 30);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
      };

      const createClouds = () => {
        const cloudsToCreate = 14;
        for (let i = 0; i < cloudsToCreate; i++) {
          const tex = createCloudTexture();
          const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.85 });
          const sprite = new THREE.Sprite(mat);
          const scale = 6 + Math.random() * 6;
          sprite.scale.set(scale, scale * 0.5, 1);
          sprite.position.set(
            -60 + Math.random() * 120,
            9 + Math.random() * 6,
            -40 + Math.random() * 80
          );
          // Drift direction and speed
          const dir = Math.random() > 0.5 ? 1 : -1;
          sprite.userData = { speed: dir * (0.02 + Math.random() * 0.03), direction: dir };
          cloudSpritesRef.current.push(sprite);
          scene.add(sprite);
        }
      };

      const createFootpathNetwork = () => {
        // Create a realistic stone path texture
        const createStonePathTexture = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 256;
          const ctx = canvas.getContext('2d')!;

          // Base dirt/earth color
          ctx.fillStyle = '#8b7355';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Add dirt texture noise
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 25;
            data[i] = Math.max(50, Math.min(200, data[i] + noise));
            data[i + 1] = Math.max(40, Math.min(180, data[i + 1] + noise));
            data[i + 2] = Math.max(30, Math.min(160, data[i + 2] + noise));
          }
          ctx.putImageData(imageData, 0, 0);

          // Scatter flat stones
          const stoneColors = ['#a5967d', '#9a8b72', '#8f8067', '#b0a18e', '#95866d'];
          for (let i = 0; i < 80; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const w = 8 + Math.random() * 12;
            const h = 6 + Math.random() * 10;
            
            ctx.fillStyle = stoneColors[Math.floor(Math.random() * stoneColors.length)];
            ctx.save();
            ctx.translate(x + w/2, y + h/2);
            ctx.rotate(Math.random() * Math.PI * 2);
            ctx.fillRect(-w/2, -h/2, w, h);
            
            // Stone edge highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(-w/2, -h/2, w, 1);
            ctx.fillRect(-w/2, -h/2, 1, h);
            
            // Stone edge shadow  
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(-w/2, h/2-1, w, 1);
            ctx.fillRect(w/2-1, -h/2, 1, h);
            
            ctx.restore();
          }

          // Add some wear and moss
          for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            // Moss patches
            if (Math.random() > 0.6) {
              ctx.fillStyle = 'rgba(70, 90, 50, 0.25)';
              ctx.beginPath();
              ctx.arc(x, y, 4 + Math.random() * 6, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          const texture = new THREE.CanvasTexture(canvas);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(6, 6);
          return texture;
        };

        const pathTexture = createStonePathTexture();
        const pathMaterial = new THREE.MeshLambertMaterial({ 
          map: pathTexture,
          transparent: false 
        });

        // Create flat stone path segments between farm buildings
        const pathHeight = 0.01;
        const pathWidth = 0.8;
        
        // Farm building positions are at x,z = -2.5, 0, 2.5 with spacing 2.5
        // Create straight path segments between buildings
        
        // Horizontal paths between building rows
        const horizontalZ = [-1.25, 1.25]; // midway between building rows
        horizontalZ.forEach((z) => {
          // Left to right path segments with small gaps for natural look
          for (let x = -6; x <= 6; x += 1.5) {
            const segmentLength = 1.2 + Math.random() * 0.3;
            const pathGeometry = new THREE.PlaneGeometry(segmentLength, pathWidth);
            const path = new THREE.Mesh(pathGeometry, pathMaterial);
            path.rotation.x = -Math.PI / 2;
            path.position.set(x + Math.random() * 0.1 - 0.05, pathHeight, z + Math.random() * 0.05 - 0.025);
            path.receiveShadow = true;
            scene.add(path);
          }
        });

        // Vertical paths between building columns  
        const verticalX = [-1.25, 1.25]; // midway between building columns
        verticalX.forEach((x) => {
          // Top to bottom path segments
          for (let z = -5; z <= 5; z += 1.5) {
            const segmentLength = 1.2 + Math.random() * 0.3;
            const pathGeometry = new THREE.PlaneGeometry(pathWidth, segmentLength);
            const path = new THREE.Mesh(pathGeometry, pathMaterial);
            path.rotation.x = -Math.PI / 2;
            path.position.set(x + Math.random() * 0.05 - 0.025, pathHeight, z + Math.random() * 0.1 - 0.05);
            path.receiveShadow = true;
            scene.add(path);
          }
        });

        // Main access paths leading to center from outside
        const createAccessPath = (startX: number, startZ: number, endX: number, endZ: number) => {
          const segments = 8;
          for (let i = 0; i < segments; i++) {
            const progress = i / (segments - 1);
            const x = startX + (endX - startX) * progress;
            const z = startZ + (endZ - startZ) * progress;
            
            const angle = Math.atan2(endZ - startZ, endX - startX);
            const segmentLength = 1.0 + Math.random() * 0.4;
            
            const pathGeometry = new THREE.PlaneGeometry(segmentLength, pathWidth);
            const path = new THREE.Mesh(pathGeometry, pathMaterial);
            path.rotation.x = -Math.PI / 2;
            path.rotation.z = angle;
            path.position.set(x, pathHeight, z);
            path.receiveShadow = true;
            scene.add(path);
          }
        };

        // Create main access paths from cardinal directions
        createAccessPath(-8, 0, -3.5, 0);  // West entrance
        createAccessPath(8, 0, 3.5, 0);    // East entrance
        createAccessPath(0, -7, 0, -3.5);  // South entrance
        createAccessPath(0, 7, 0, 3.5);    // North entrance
        
        // Add some decorative stepping stones around the paths
        for (let i = 0; i < 12; i++) {
          const x = (Math.random() - 0.5) * 12;
          const z = (Math.random() - 0.5) * 10;
          
          // Skip if too close to building centers
          const tooClose = [-2.5, 0, 2.5].some(buildingX => 
            [-2.5, 0, 2.5].some(buildingZ => 
              Math.sqrt((x - buildingX) ** 2 + (z - buildingZ) ** 2) < 1.5
            )
          );
          
          if (!tooClose) {
            const stoneSize = 0.3 + Math.random() * 0.2;
            const stoneGeometry = new THREE.PlaneGeometry(stoneSize, stoneSize);
            const stone = new THREE.Mesh(stoneGeometry, pathMaterial);
            stone.rotation.x = -Math.PI / 2;
            stone.rotation.z = Math.random() * Math.PI * 2;
            stone.position.set(x, pathHeight + 0.002, z);
            stone.receiveShadow = true;
            scene.add(stone);
          }
        }
      };

      createSkyDome();
      createClouds();
      createFootpathNetwork();
    };

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 80);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x2a4d3a,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(30, 40, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    // Add exterior environment elements
    addExteriorEnvironment();

    // Position camera for optimal initial view of farm buildings - very close horizontal view (~20 degrees)
    camera.position.set(5, 1.75, 5); // Half the distance, maintaining 20 degree angle
    camera.lookAt(0, 0.5, 0); // Look at close to ground level

    // Add OrbitControls for camera interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth camera movement
    controls.dampingFactor = 0.08; // Slightly more responsive
    controls.screenSpacePanning = false;
    
    // Set control limits for better user experience
    controls.minDistance = 8; // Allow closer inspection
    controls.maxDistance = 60; // Reasonable maximum distance
    controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below ground (about 82 degrees)
    controls.minPolarAngle = Math.PI / 6; // Prevent going too high above (30 degrees)
    
    // Set target to center of farm area (slightly above ground)
    controls.target.set(0, 1, 0);
    controls.update();
    
    // Store controls reference
    controlsRef.current = controls;

    // GLTF Loader
    const loader = new GLTFLoader();

    // Click event handler
    const handleCanvasClick = (event: MouseEvent) => {
      console.log('Canvas clicked, current scene:', currentSceneRef.current);
      if (currentSceneRef.current !== 'exterior') return;
      if (!raycastRef.current || !mouseRef.current || !cameraRef.current || !sceneRef.current) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycastRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycastRef.current.intersectObjects(farmBuildingsRef.current, true);
      console.log('Farm buildings for click detection:', farmBuildingsRef.current.length);
      console.log('Ray intersects:', intersects.length);

      if (intersects.length > 0) {
        console.log('Farm building clicked, starting transition...');
        
        // Get clicked farm position
        const clickedFarm = intersects[0].object;
        let farmPosition = new THREE.Vector3();
        
        // Get world position of the clicked farm
        if (clickedFarm.parent) {
          clickedFarm.parent.getWorldPosition(farmPosition);
        } else {
          clickedFarm.getWorldPosition(farmPosition);
        }
        
        // Start transition animation
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (camera && controls) {
          // Store starting position and target
          transitionRef.current.startPosition.copy(camera.position);
          transitionRef.current.startTarget.copy(controls.target);
          transitionRef.current.clickedFarmPosition.copy(farmPosition);
          
          // Disable controls during transition
          controls.enabled = false;
          
          // Start transition
          transitionRef.current.isTransitioning = true;
          transitionRef.current.startTime = Date.now();
          setCurrentScene('transitioning');
        }
      }
    };

    // Add click event listener
    renderer.domElement.addEventListener('click', handleCanvasClick);
    
    // Load and position trees to form rectangular boundary
    const loadTrees = async () => {
      if (!scene) return;
      
      const fallbackTree = () => {
        // Add fallback simple tree shapes - 4 concentric rings
        const fallbackTreeGeometry = new THREE.ConeGeometry(0.3, 1.5, 6);
        const fallbackTreeMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5d2d });
        
                 const farmAreaSize = 6; // Closer to contain the 3x3 farm buildings
         const treeSpacing = 0.8; // Ultra dense spacing between trees
         const ringGap = 1.6; // Smaller distance between each tree ring
        
        // Create 4 concentric rectangular rings as fallback
        for (let ring = 0; ring < 4; ring++) {
          const ringSize = farmAreaSize + (ring + 1) * ringGap;
          const halfSize = ringSize / 2;

                     // Top and bottom rows for this ring
           for (let x = -halfSize; x <= halfSize; x += treeSpacing) {
             // Top row
             const topTree = new THREE.Mesh(fallbackTreeGeometry, fallbackTreeMaterial);
             const offsetX = x + (Math.random() - 0.5) * 0.4;
             const offsetZ = halfSize + (Math.random() - 0.5) * 0.3;
             topTree.position.set(offsetX, 0.75, offsetZ);
             scene.add(topTree);

             // Bottom row
             const bottomTree = new THREE.Mesh(fallbackTreeGeometry, fallbackTreeMaterial);
             const offsetX2 = x + (Math.random() - 0.5) * 0.4;
             const offsetZ2 = -halfSize + (Math.random() - 0.5) * 0.3;
             bottomTree.position.set(offsetX2, 0.75, offsetZ2);
             scene.add(bottomTree);
           }

           // Left and right columns for this ring (excluding corners already filled)
           for (let z = -halfSize + treeSpacing; z < halfSize; z += treeSpacing) {
             // Left column
             const leftTree = new THREE.Mesh(fallbackTreeGeometry, fallbackTreeMaterial);
             const offsetX3 = -halfSize + (Math.random() - 0.5) * 0.3;
             const offsetZ3 = z + (Math.random() - 0.5) * 0.4;
             leftTree.position.set(offsetX3, 0.75, offsetZ3);
             scene.add(leftTree);

             // Right column
             const rightTree = new THREE.Mesh(fallbackTreeGeometry, fallbackTreeMaterial);
             const offsetX4 = halfSize + (Math.random() - 0.5) * 0.3;
             const offsetZ4 = z + (Math.random() - 0.5) * 0.4;
             rightTree.position.set(offsetX4, 0.75, offsetZ4);
             scene.add(rightTree);
           }
        }
        
        console.log('Fallback trees created');
      };

      const loadTreeModels = async () => {
        // Load tree models
        const treeModel = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load('/models/tree.glb', (gltf) => {
            resolve(gltf.scene);
          }, undefined, reject);
        });

        const pineModel = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load('/models/pine.glb', (gltf) => {
            resolve(gltf.scene);
          }, undefined, reject);
        });

                 // Create 4 concentric rings of trees around the farm area
         const farmAreaSize = 6; // Closer to contain the 3x3 farm buildings
         const treeSpacing = 0.8; // Ultra dense spacing between trees
         const ringGap = 1.6; // Smaller distance between each tree ring

        // Helper function to position tree on ground
        const positionTreeOnGround = (tree: THREE.Group, x: number, z: number) => {
          // Calculate bounding box to get the bottom of the tree - cache result for performance
          if (!tree.userData.boundingBox) {
            tree.userData.boundingBox = new THREE.Box3().setFromObject(tree);
          }
          tree.position.set(x, -tree.userData.boundingBox.min.y, z); // Position so bottom touches ground
        };

        // Create 4 concentric rectangular rings
        for (let ring = 0; ring < 4; ring++) {
          const ringSize = farmAreaSize + (ring + 1) * ringGap;
          const halfSize = ringSize / 2;

                     // Top and bottom rows for this ring
           for (let x = -halfSize; x <= halfSize; x += treeSpacing) {
             // Top row
             const topTree = Math.random() > 0.5 ? treeModel.clone() : pineModel.clone();
             topTree.scale.setScalar(0.3 + Math.random() * 0.2); // Smaller trees (0.3-0.5)
             topTree.rotation.y = Math.random() * Math.PI * 2;
             const offsetX = x + (Math.random() - 0.5) * 0.4;
             const offsetZ = halfSize + (Math.random() - 0.5) * 0.3;
             positionTreeOnGround(topTree, offsetX, offsetZ);
             // Reduce shadow casting for distant trees to improve performance
             if (ring < 2) { // Only inner 2 rings cast shadows
               topTree.castShadow = true;
               topTree.receiveShadow = true;
             }
             scene.add(topTree);

             // Bottom row
             const bottomTree = Math.random() > 0.5 ? treeModel.clone() : pineModel.clone();
             bottomTree.scale.setScalar(0.3 + Math.random() * 0.2); // Smaller trees (0.3-0.5)
             bottomTree.rotation.y = Math.random() * Math.PI * 2;
             const offsetX2 = x + (Math.random() - 0.5) * 0.4;
             const offsetZ2 = -halfSize + (Math.random() - 0.5) * 0.3;
             positionTreeOnGround(bottomTree, offsetX2, offsetZ2);
             // Reduce shadow casting for distant trees to improve performance
             if (ring < 2) { // Only inner 2 rings cast shadows
               bottomTree.castShadow = true;
               bottomTree.receiveShadow = true;
             }
             scene.add(bottomTree);
           }

           // Left and right columns for this ring (excluding corners already filled)
           for (let z = -halfSize + treeSpacing; z < halfSize; z += treeSpacing) {
             // Left column
             const leftTree = Math.random() > 0.5 ? treeModel.clone() : pineModel.clone();
             leftTree.scale.setScalar(0.3 + Math.random() * 0.2); // Smaller trees (0.3-0.5)
             leftTree.rotation.y = Math.random() * Math.PI * 2;
             const offsetX3 = -halfSize + (Math.random() - 0.5) * 0.3;
             const offsetZ3 = z + (Math.random() - 0.5) * 0.4;
             positionTreeOnGround(leftTree, offsetX3, offsetZ3);
             // Reduce shadow casting for distant trees to improve performance
             if (ring < 2) { // Only inner 2 rings cast shadows
               leftTree.castShadow = true;
               leftTree.receiveShadow = true;
             }
             scene.add(leftTree);

             // Right column
             const rightTree = Math.random() > 0.5 ? treeModel.clone() : pineModel.clone();
             rightTree.scale.setScalar(0.3 + Math.random() * 0.2); // Smaller trees (0.3-0.5)
             rightTree.rotation.y = Math.random() * Math.PI * 2;
             const offsetX4 = halfSize + (Math.random() - 0.5) * 0.3;
             const offsetZ4 = z + (Math.random() - 0.5) * 0.4;
             positionTreeOnGround(rightTree, offsetX4, offsetZ4);
             // Reduce shadow casting for distant trees to improve performance
             if (ring < 2) { // Only inner 2 rings cast shadows
               rightTree.castShadow = true;
               rightTree.receiveShadow = true;
             }
             scene.add(rightTree);
           }
        }

        console.log('Trees loaded and positioned successfully');
      };

      loadTreeModels().catch((error) => {
        console.error('Error loading tree models:', error);
        fallbackTree();
      });
    };

    // Load and arrange farm buildings in 3x3 grid
    const loadFarmBuildings = async () => {
      if (!scene) return;

      const fallbackBuildings = () => {
        // Add fallback simple building shapes - larger and more densely packed
        const fallbackBuildingGeometry = new THREE.BoxGeometry(6, 4, 6); // Larger buildings
        const fallbackBuildingMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        // 3x3 grid of fallback buildings
        const gridSize = 3;
        const buildingSpacing = 2.5; // Very tight spacing - less than building width
        const startX = -(gridSize - 1) * buildingSpacing / 2;
        const startZ = -(gridSize - 1) * buildingSpacing / 2;

        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const building = new THREE.Mesh(fallbackBuildingGeometry, fallbackBuildingMaterial);
            building.position.set(
              startX + col * buildingSpacing,
              2, // Position on ground (half of height)
              startZ + row * buildingSpacing
            );
            // Only enable shadows for closer buildings to improve performance
            if (row === 1 && col === 1) { // Center building only
              building.castShadow = true;
              building.receiveShadow = true;
            }
            scene.add(building);
          }
        }
        
        console.log('Fallback farm buildings created');
      };

      const loadFarmModels = async () => {
        const farmModel = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load('/models/farm.glb', (gltf) => {
            resolve(gltf.scene);
          }, undefined, reject);
        });

        // 3x3 grid of farm buildings - larger and more densely packed
        const gridSize = 3;
        const buildingSpacing = 2.5; // Very tight spacing - less than building width
        const startX = -(gridSize - 1) * buildingSpacing / 2;
        const startZ = -(gridSize - 1) * buildingSpacing / 2;

        // Helper function to position building on ground
        const positionBuildingOnGround = (building: THREE.Group, x: number, z: number) => {
          // Calculate bounding box to get the bottom of the building - cache result for performance
          if (!building.userData.boundingBox) {
            building.userData.boundingBox = new THREE.Box3().setFromObject(building);
          }
          building.position.set(x, -building.userData.boundingBox.min.y, z); // Position so bottom touches ground
        };

        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const farm = farmModel.clone();
            farm.scale.setScalar(2.0); // Increased from 1.2 to 2.0 for larger buildings
            
            // Position after scaling to ensure proper ground contact
            positionBuildingOnGround(farm, 
              startX + col * buildingSpacing,
              startZ + row * buildingSpacing
            );
            
            // Only enable shadows for closer buildings to improve performance
            if (row === 1 && col === 1) { // Center building only
              farm.castShadow = true;
              farm.receiveShadow = true;
            }
            
            // Add slight rotation variation for realism
            farm.rotation.y = (Math.random() - 0.5) * 0.2;
            
            // Add to farmBuildings array for click detection
            farmBuildingsRef.current.push(farm);
            
            scene.add(farm);
          }
        }

        console.log('Farm buildings loaded and positioned successfully');
      };

      loadFarmModels().catch((error) => {
        console.error('Error loading farm model:', error);
        fallbackBuildings();
      });
    };

    // Load all models for exterior scene
    loadTrees();
    loadFarmBuildings();

    // Animation loop with controls update and fish swimming
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Drift cloud sprites in exterior scene
      if (currentSceneRef.current === 'exterior') {
        for (const sprite of cloudSpritesRef.current) {
          const speed = (sprite.userData?.speed as number) || 0.02;
          sprite.position.x += speed;
          // Gentle vertical sway
          sprite.position.y += Math.sin(time * 0.2 + sprite.position.x * 0.05) * 0.002;
          // Wrap around
          if (sprite.position.x > 80) sprite.position.x = -80;
          if (sprite.position.x < -80) sprite.position.x = 80;
        }
      }

      // Handle camera transition animation
      if (transitionRef.current.isTransitioning) {
        const elapsed = Date.now() - transitionRef.current.startTime;
        const progress = Math.min(elapsed / transitionRef.current.duration, 1);
        
        // Smooth easing function (ease-in-out)
        const easedProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const camera = cameraRef.current!;
        const farmPos = transitionRef.current.clickedFarmPosition;
        
        if (progress < 0.5) {
          // First half: zoom into farm building and lower view angle
          const zoomProgress = easedProgress * 2; // 0 to 1 for first half
          
          // Target position: close to farm, gradually lowering to horizontal level
          const targetPos = new THREE.Vector3(
            farmPos.x + 1.5,
            farmPos.y + 0.2, // Very low, almost at ground level
            farmPos.z + 1.5
          );
          const targetLook = new THREE.Vector3(farmPos.x, farmPos.y + 0.1, farmPos.z); // Look into the farm
          
          // Interpolate camera position
          camera.position.lerpVectors(
            transitionRef.current.startPosition,
            targetPos,
            zoomProgress
          );
          
          // Interpolate look-at target
          const currentTarget = new THREE.Vector3().lerpVectors(
            transitionRef.current.startTarget,
            targetLook,
            zoomProgress
          );
          camera.lookAt(currentTarget);
          
        } else {
          // Second half: "walk into" the farm building
          const interiorProgress = (easedProgress - 0.5) * 2; // 0 to 1 for second half
          
          // From horizontal farm view to interior view
          const farmClosePos = new THREE.Vector3(
            farmPos.x + 1.5,
            farmPos.y + 0.2,
            farmPos.z + 1.5
          );
          const farmCloseTarget = new THREE.Vector3(farmPos.x, farmPos.y + 0.1, farmPos.z);
          
          // "Walk through" the farm entrance - move camera forward into the building
          const enteringPos = new THREE.Vector3(
            farmPos.x,
            farmPos.y + 0.5, // Slightly higher when "inside"
            farmPos.z
          );
          
          if (interiorProgress < 0.3) {
            // Move from outside to farm entrance
            const enterProgress = interiorProgress / 0.3;
            camera.position.lerpVectors(farmClosePos, enteringPos, enterProgress);
            camera.lookAt(farmCloseTarget);
          } else {
            // Move from farm entrance to interior view
            const insideProgress = (interiorProgress - 0.3) / 0.7;
            camera.position.lerpVectors(
              enteringPos,
              transitionRef.current.endPosition,
              insideProgress
            );
            
            const currentTarget = new THREE.Vector3().lerpVectors(
              farmCloseTarget,
              transitionRef.current.endTarget,
              insideProgress
            );
            camera.lookAt(currentTarget);
            
            // Start loading interior scene when "entering" the building
            if (insideProgress > 0.1 && currentSceneRef.current === 'transitioning') {
              setCurrentScene('interior');
            }
          }
        }
        
        // End transition
        if (progress >= 1) {
          transitionRef.current.isTransitioning = false;
          // Don't re-enable controls here, they'll be handled in interior scene
        }
      } else {
        // Update controls for smooth damping (only when not transitioning)
        if (currentSceneRef.current === 'exterior' || currentSceneRef.current === 'interior') {
          controls.update();
        }
      }
      
      // Animate fish swimming in interior scene
      if (currentSceneRef.current === 'interior') {
        fishArrayRef.current.forEach((fish, index) => {
          // Circular swimming pattern within pool bounds
          const swimRadius = fish.userData.swimRadius || 0.5;
          const swimmingRadius = Math.min(swimRadius * 0.4, 0.3); // Small circular swimming path
          const speed = 0.5 + index * 0.1;
          const centerX = fish.userData.centerX || fish.position.x;
          const centerZ = fish.userData.centerZ || fish.position.z;
          
          // Store initial position as center if not set
          if (!fish.userData.centerX) {
            fish.userData.centerX = fish.position.x;
            fish.userData.centerZ = fish.position.z;
          }
          
          fish.position.x = centerX + Math.cos(time * speed + index) * swimmingRadius;
          fish.position.z = centerZ + Math.sin(time * speed + index) * swimmingRadius;
          
          // Make fish face the direction of movement
          fish.rotation.y = Math.atan2(
            Math.cos(time * speed + index),
            Math.sin(time * speed + index)
          );
          
          // Add slight vertical bobbing
          fish.position.y = 0.1 + Math.sin(time * 2 + index) * 0.05;
        });

        // Smoothly animate doors/windows toward target angles
        for (const obj of openableRef.current) {
          const pivot = (obj as any).userData?.pivotGroup as THREE.Group | undefined;
          if (!pivot) continue;
          const ud = (pivot as any).userData as { targetAngle: number; openAngle: number };
          const current = pivot.rotation.y;
          const target = ud.targetAngle;
          const delta = target - current;
          if (Math.abs(delta) > 0.001) {
            pivot.rotation.y = current + delta * 0.12; // easing
          } else {
            pivot.rotation.y = target;
          }
        }
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      if (interiorClickHandlerRef.current && rendererRef.current) {
        rendererRef.current.domElement.removeEventListener('click', interiorClickHandlerRef.current);
        interiorClickHandlerRef.current = null;
      }
      controls.dispose(); // Dispose of controls
      if (mountElement && renderer.domElement && mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle back button for interior scene
  useEffect(() => {
    let backButton: HTMLButtonElement | null = null;
    
    if (currentScene === 'interior') {
      backButton = document.createElement('button');
      backButton.innerHTML = '← 返回外部视角';
      backButton.style.position = 'absolute';
      backButton.style.bottom = '20px';
      backButton.style.left = '50%';
      backButton.style.transform = 'translateX(-50%)';
      backButton.style.zIndex = '200';
      backButton.style.padding = '10px 20px';
      backButton.style.backgroundColor = 'rgba(0, 50, 100, 0.8)';
      backButton.style.color = '#00d4ff';
      backButton.style.border = '1px solid #00d4ff';
      backButton.style.borderRadius = '5px';
      backButton.style.cursor = 'pointer';
      backButton.style.backdropFilter = 'blur(10px)';
      
      backButton.onclick = () => {
        window.location.reload();
      };
      
      document.body.appendChild(backButton);
    }
    
    return () => {
      if (backButton && document.body.contains(backButton)) {
        document.body.removeChild(backButton);
      }
    };
  }, [currentScene]);

  // Handle scene switching to interior
  useEffect(() => {
    if (currentScene === 'interior' && sceneRef.current && cameraRef.current && rendererRef.current) {
      const createInteriorScene = async () => {
        const scene = sceneRef.current!;
        const camera = cameraRef.current!;
        const loader = new GLTFLoader();

        console.log('Creating interior scene...');

        // Clear current scene
        while(scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }

        // Disable exterior fog when entering interior
        scene.fog = null;

        // Add interior lighting with ceiling lights and subtle shadows
        const wallHeight = 6; // Define wall height first
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // Lower ambient for contrast
        scene.add(ambientLight);
        
        // Main overhead lighting
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
        mainLight.position.set(0, wallHeight - 1, 0);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 512;
        mainLight.shadow.mapSize.height = 512;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -20;
        mainLight.shadow.camera.right = 20;
        mainLight.shadow.camera.top = 20;
        mainLight.shadow.camera.bottom = -20;
        mainLight.shadow.bias = -0.0001;
        scene.add(mainLight);
        
        // Add ceiling light fixtures
        const lightFixtureMaterial = new THREE.MeshLambertMaterial({ 
          color: 0xffffaa, 
          emissive: 0x444422 
        });
        const lightGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8);
        
        // Create light fixtures in grid pattern
        for (let x = -4; x <= 4; x += 4) {
          for (let z = -3; z <= 3; z += 3) {
            const lightFixture = new THREE.Mesh(lightGeometry, lightFixtureMaterial);
            lightFixture.position.set(x, wallHeight - 0.3, z);
            scene.add(lightFixture);
            
            // Add point lights for each fixture
            const pointLight = new THREE.PointLight(0xffffcc, 0.3, 8);
            pointLight.position.set(x, wallHeight - 0.5, z);
            pointLight.castShadow = true;
            pointLight.shadow.mapSize.width = 256;
            pointLight.shadow.mapSize.height = 256;
            pointLight.shadow.bias = -0.0001;
            scene.add(pointLight);
          }
        }

        // Create interior ground with concrete texture - smaller to fit pool area
        const floorGeometry = new THREE.PlaneGeometry(16, 12);
        
        // Create concrete texture using canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        
        // Base concrete color
        ctx.fillStyle = '#8a8a8a';
        ctx.fillRect(0, 0, 512, 512);
        
        // Add noise for concrete texture
        const imageData = ctx.getImageData(0, 0, 512, 512);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 60;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
        }
        ctx.putImageData(imageData, 0, 0);
        
        // Add cracks
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        // Diagonal cracks
        ctx.beginPath();
        ctx.moveTo(50, 100);
        ctx.quadraticCurveTo(150, 120, 300, 140);
        ctx.quadraticCurveTo(400, 160, 480, 180);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(100, 300);
        ctx.quadraticCurveTo(200, 320, 350, 340);
        ctx.quadraticCurveTo(450, 360, 500, 380);
        ctx.stroke();
        
        // Tire tracks
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 8;
        ctx.globalAlpha = 0.4;
        
        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.lineTo(512, 220);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 230);
        ctx.lineTo(512, 250);
        ctx.stroke();
        
        // Add some stains
        ctx.fillStyle = '#666666';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(150, 150, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(350, 300, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 1.5); // Repeat texture for more detail
        
        const floorMaterial = new THREE.MeshLambertMaterial({ 
          map: texture,
          color: 0xaaaaaa
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true; // Floor receives shadows
        scene.add(floor);

        // Create warehouse walls with texture and roof structure
        
        // Create wall texture using canvas
        const wallCanvas = document.createElement('canvas');
        wallCanvas.width = 256;
        wallCanvas.height = 256;
        const wallCtx = wallCanvas.getContext('2d')!;
        
        // Base wall color - concrete
        wallCtx.fillStyle = '#a0a0a0';
        wallCtx.fillRect(0, 0, 256, 256);
        
        // Add horizontal lines (concrete blocks)
        wallCtx.strokeStyle = '#888888';
        wallCtx.lineWidth = 2;
        for (let y = 0; y < 256; y += 32) {
          wallCtx.beginPath();
          wallCtx.moveTo(0, y);
          wallCtx.lineTo(256, y);
          wallCtx.stroke();
        }
        
        // Add vertical lines
        wallCtx.lineWidth = 1;
        for (let x = 0; x < 256; x += 64) {
          wallCtx.beginPath();
          wallCtx.moveTo(x, 0);
          wallCtx.lineTo(x, 256);
          wallCtx.stroke();
        }
        
        // Add some weathering stains
        wallCtx.fillStyle = '#909090';
        wallCtx.globalAlpha = 0.3;
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * 256;
          const y = Math.random() * 256;
          wallCtx.beginPath();
          wallCtx.arc(x, y, Math.random() * 15 + 5, 0, Math.PI * 2);
          wallCtx.fill();
        }
        wallCtx.globalAlpha = 1;
        
        const wallTexture = new THREE.CanvasTexture(wallCanvas);
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        
        const wallMaterial = new THREE.MeshLambertMaterial({ 
          map: wallTexture,
          color: 0xaaaaaa
        });
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x777777 });
        
        // Walls (16x12 floor, so walls should be positioned at edges)
        
        // Helper: create alphaMap with rectangular holes (doors/windows) so we can see outside
        const createWallMaterialWithHoles = (wallW: number, wallH: number, holes: Array<{ x: number; y: number; w: number; h: number }>) => {
          const alphaCanvas = document.createElement('canvas');
          alphaCanvas.width = 1024;
          alphaCanvas.height = 512;
          const actx = alphaCanvas.getContext('2d')!;
          // Opaque base
          actx.fillStyle = '#ffffff';
          actx.fillRect(0, 0, alphaCanvas.width, alphaCanvas.height);
          // Cut holes: x in [-wallW/2, wallW/2], y in [0, wallH]
          actx.fillStyle = '#000000';
          for (const hole of holes) {
            const u = (hole.x + wallW / 2) / wallW; // 0..1
            const v = 1 - (hole.y / wallH); // invert y for canvas
            const du = hole.w / wallW;
            const dv = hole.h / wallH;
            const px = Math.floor((u - du / 2) * alphaCanvas.width);
            const py = Math.floor((v - dv / 2) * alphaCanvas.height);
            const pw = Math.ceil(du * alphaCanvas.width);
            const ph = Math.ceil(dv * alphaCanvas.height);
            actx.fillRect(px, py, pw, ph);
          }
          const alphaTex = new THREE.CanvasTexture(alphaCanvas);
          alphaTex.wrapS = THREE.ClampToEdgeWrapping;
          alphaTex.wrapT = THREE.ClampToEdgeWrapping;

          const mapTex = wallTexture.clone();
          mapTex.needsUpdate = true;
          const mat = new THREE.MeshLambertMaterial({ map: mapTex, color: 0xaaaaaa, alphaMap: alphaTex, transparent: true });
          return mat;
        };

        // Add outdoor backdrop so openings can see outside
        const addInteriorBackdrop = () => {
          // Sky dome (backside)
          const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
          const skyMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            uniforms: {
              topColor: { value: new THREE.Color(0x8ec5ff) },
              bottomColor: { value: new THREE.Color(0xeef8ff) },
              offset: { value: 33.0 },
              exponent: { value: 0.6 }
            },
            vertexShader: `
              varying vec3 vWorldPosition;
              void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
              }
            `,
            fragmentShader: `
              uniform vec3 topColor;
              uniform vec3 bottomColor;
              uniform float offset;
              uniform float exponent;
              varying vec3 vWorldPosition;
              void main() {
                float h = normalize(vWorldPosition).y;
                float t = max(pow(max(h + offset * 0.001, 0.0), exponent), 0.0);
                vec3 color = mix(bottomColor, topColor, t);
                gl_FragColor = vec4(color, 1.0);
              }
            `
          });
          const sky = new THREE.Mesh(skyGeometry, skyMaterial);
          scene.add(sky);

          // Ground outside
          const outerGround = new THREE.Mesh(new THREE.PlaneGeometry(300, 240), new THREE.MeshLambertMaterial({ color: 0x2a4d3a }));
          outerGround.rotation.x = -Math.PI / 2;
          outerGround.position.y = -0.002; // Slightly below interior floor to avoid z-fighting
          outerGround.receiveShadow = true;
          scene.add(outerGround);
        };
        addInteriorBackdrop();

        // Define openings
        const doorWidth = 2.2;
        const doorHeight = 3.2;
        const winWidth = 2.0;
        const winHeight = 1.2;
        const winY = 3.0;
        const frontDoorXs = [-5, 0, 5]; // three doors on front
        const backDoorXs = [0]; // one door on back
        const backWinXs = [-4.5, 4.5];
        const sideWinZs = [-3.5, 3.5];
        const zOffset = 0.015;

        // Front wall with holes
        const frontHoles = [
          ...frontDoorXs.map(x => ({ x, y: doorHeight / 2, w: doorWidth, h: doorHeight }))
        ];
        const frontWallMat = createWallMaterialWithHoles(16, wallHeight, frontHoles);
        const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(16, wallHeight), frontWallMat);
        (frontWall.material as THREE.MeshLambertMaterial).map!.repeat.set(4, 2);
        frontWall.position.set(0, wallHeight / 2, -6);
        frontWall.receiveShadow = true;
        scene.add(frontWall);
        
        // Back wall with door + windows
        const backHoles = [
          ...backDoorXs.map(x => ({ x, y: doorHeight / 2, w: doorWidth, h: doorHeight })),
          ...backWinXs.map(x => ({ x, y: winY, w: winWidth, h: winHeight }))
        ];
        const backWallMat = createWallMaterialWithHoles(16, wallHeight, backHoles);
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, wallHeight), backWallMat);
        (backWall.material as THREE.MeshLambertMaterial).map!.repeat.set(4, 2);
        backWall.position.set(0, wallHeight / 2, 6);
        backWall.rotation.y = Math.PI;
        backWall.receiveShadow = true;
        scene.add(backWall);
        
        // Left wall with windows
        // For side walls, local X corresponds to world Z. Place holes at given Z positions.
        const leftHoles = [
          ...sideWinZs.map(z => ({ x: z, y: winY, w: winWidth, h: winHeight }))
        ];
        const leftWallMat = createWallMaterialWithHoles(12, wallHeight, leftHoles);
        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(12, wallHeight), leftWallMat);
        (leftWall.material as THREE.MeshLambertMaterial).map!.repeat.set(3, 2);
        leftWall.position.set(-8, wallHeight / 2, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        scene.add(leftWall);
        
        // Right wall with windows
        const rightHoles = [
          ...sideWinZs.map(z => ({ x: z, y: winY, w: winWidth, h: winHeight }))
        ];
        const rightWallMat = createWallMaterialWithHoles(12, wallHeight, rightHoles);
        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(12, wallHeight), rightWallMat);
        (rightWall.material as THREE.MeshLambertMaterial).map!.repeat.set(3, 2);
        rightWall.position.set(8, wallHeight / 2, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        scene.add(rightWall);

        // Helper to add a hinged panel (door or window)
        const addHingedPanel = (options: {
          width: number;
          height: number;
          position: THREE.Vector3;
          rotationY: number;
          hinge: 'left' | 'right';
          openAngle: number;
          material: THREE.Material;
          type: 'door' | 'window';
          offsetAxis?: 'x' | 'z';
        }) => {
          const pivot = new THREE.Group();
          pivot.position.copy(options.position);
          scene.add(pivot);

          const panel = new THREE.Mesh(new THREE.PlaneGeometry(options.width, options.height), options.material);
          panel.rotation.y = options.rotationY;
          // Place panel so that its left edge is at pivot, then hinge decides sign
          const edgeSign = options.hinge === 'left' ? 1 : -1;
          const axis = options.offsetAxis || 'x';
          if (axis === 'x') {
            panel.position.x = (options.width / 2) * edgeSign;
          } else {
            panel.position.z = (options.width / 2) * edgeSign;
          }
          pivot.add(panel);

          // Store animation state on pivot and reference from panel for raycast
          (pivot as any).userData = { targetAngle: 0, openAngle: options.openAngle * edgeSign };
          (panel as any).userData = { pivotGroup: pivot, type: options.type };
          openableRef.current.push(panel);

          return { pivot, panel };
        };

        // Materials
        const doorPanelMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const windowPaneMat = new THREE.MeshLambertMaterial({ color: 0x88ccff, transparent: true, opacity: 0.45 });

        // Add multiple front doors (hinge on left)
        for (const x of frontDoorXs) {
          addHingedPanel({
            width: doorWidth,
            height: doorHeight,
            position: new THREE.Vector3(x - doorWidth / 2, doorHeight / 2, -6 + zOffset),
            rotationY: 0,
            hinge: 'left',
            openAngle: Math.PI * 0.6,
            material: doorPanelMat,
            type: 'door',
            offsetAxis: 'x'
          });
        }

        // Back door at center (hinge on right)
        for (const x of backDoorXs) {
          addHingedPanel({
            width: doorWidth,
            height: doorHeight,
            position: new THREE.Vector3(x + doorWidth / 2, doorHeight / 2, 6 - zOffset),
            rotationY: Math.PI,
            hinge: 'right',
            openAngle: Math.PI * 0.6,
            material: doorPanelMat,
            type: 'door',
            offsetAxis: 'x'
          });
        }

        // Back windows (hinge left)
        for (const x of backWinXs) {
          addHingedPanel({
            width: winWidth,
            height: winHeight,
            position: new THREE.Vector3(x - winWidth / 2, winY, 6 - zOffset),
            rotationY: Math.PI,
            hinge: 'left',
            openAngle: Math.PI * 0.5,
            material: windowPaneMat,
            type: 'window',
            offsetAxis: 'x'
          });
        }

        // Left wall windows (facing +x). Panel width extends along +z after rotation, so hinge at lower z
        for (const z of sideWinZs) {
          const pivotPos = new THREE.Vector3(-8 + zOffset, winY, z - winWidth / 2);
          const { panel } = addHingedPanel({
            width: winWidth,
            height: winHeight,
            position: pivotPos,
            rotationY: Math.PI / 2,
            hinge: 'left',
            openAngle: Math.PI * 0.5,
            material: windowPaneMat,
            type: 'window',
            offsetAxis: 'z'
          });
          // Adjust local placement for side wall: move along local X (which is world Z after rotation)
        }

        // Right wall windows (facing -x). Hinge at higher z edge
        for (const z of sideWinZs) {
          const pivotPos = new THREE.Vector3(8 - zOffset, winY, z + winWidth / 2);
          addHingedPanel({
            width: winWidth,
            height: winHeight,
            position: pivotPos,
            rotationY: -Math.PI / 2,
            hinge: 'right',
            openAngle: Math.PI * 0.5,
            material: windowPaneMat,
            type: 'window',
            offsetAxis: 'z'
          });
        }

        // Interior click handler to toggle doors/windows
        const handleInteriorClick = (event: MouseEvent) => {
          if (currentSceneRef.current !== 'interior') return;
          if (!raycastRef.current || !mouseRef.current || !cameraRef.current || !sceneRef.current || !rendererRef.current) return;
          const rect = rendererRef.current.domElement.getBoundingClientRect();
          mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          raycastRef.current.setFromCamera(mouseRef.current, cameraRef.current);
          const intersects = raycastRef.current.intersectObjects(openableRef.current, true);
          if (intersects.length > 0) {
            const obj = intersects[0].object as THREE.Mesh;
            const pivot = (obj as any).userData?.pivotGroup as THREE.Group | undefined;
            if (pivot) {
              const ud = (pivot as any).userData || { targetAngle: 0, openAngle: Math.PI * 0.6 };
              const isClosed = Math.abs(ud.targetAngle) < 1e-3;
              (pivot as any).userData.targetAngle = isClosed ? ud.openAngle : 0;
            }
          }
        };
        if (rendererRef.current) {
          rendererRef.current.domElement.addEventListener('click', handleInteriorClick);
          interiorClickHandlerRef.current = handleInteriorClick;
        }
        
        // Roof structure - industrial style with trusses
        const roofGeometry = new THREE.PlaneGeometry(16, 12);
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, wallHeight, 0);
        roof.rotation.x = Math.PI / 2;
        scene.add(roof);
        
        // Add roof trusses for industrial look
        const trussMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const trussGeometry = new THREE.BoxGeometry(0.2, 0.4, 12);
        
        // Main trusses running along the length
        for (let i = -3; i <= 3; i++) {
          const truss = new THREE.Mesh(trussGeometry, trussMaterial);
          truss.position.set(i * 2.5, wallHeight - 0.2, 0);
          scene.add(truss);
        }
        
        // Cross beams
        const crossBeamGeometry = new THREE.BoxGeometry(16, 0.2, 0.2);
        for (let i = -2; i <= 2; i++) {
          const beam = new THREE.Mesh(crossBeamGeometry, trussMaterial);
          beam.position.set(0, wallHeight - 0.1, i * 2.5);
          scene.add(beam);
        }
        
        // Add some industrial elements - ventilation ducts
        const ductMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const ductGeometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 8);
        
        const duct1 = new THREE.Mesh(ductGeometry, ductMaterial);
        duct1.position.set(-6, wallHeight - 1, 0);
        duct1.rotation.z = Math.PI / 2;
        scene.add(duct1);
        
        const duct2 = new THREE.Mesh(ductGeometry, ductMaterial);
        duct2.position.set(6, wallHeight - 1, 0);
        duct2.rotation.z = Math.PI / 2;
        scene.add(duct2);

        const createInteriorWithFallback = () => {
          // Create fallback pools and fish
          const poolRows = 3;
          const poolCols = 4;
          const poolSpacing = 3;
          
          for (let row = 0; row < poolRows; row++) {
            for (let col = 0; col < poolCols; col++) {
              // Fallback pool (simple cylinder)
              const poolGeometry = new THREE.CylinderGeometry(3, 3, 1, 8);
              const poolMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
              const pool = new THREE.Mesh(poolGeometry, poolMaterial);
              const poolX = (col - 1.5) * poolSpacing;
              const poolZ = (row - 1) * poolSpacing;
              pool.position.set(poolX, 0.5, poolZ);
              scene.add(pool);

              // Circular water surface to match circular pool  
              const waterGeometry = new THREE.CircleGeometry(2.75, 32); // Increased by 10%
              const waterMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x4488ff, 
                transparent: true, 
                opacity: 0.7
              });
              const water = new THREE.Mesh(waterGeometry, waterMaterial);
              water.rotation.x = -Math.PI / 2;
              water.position.set(poolX, 1, poolZ);
              scene.add(water);

              // Fallback fish (simple boxes) - stay within water bounds
              for (let i = 0; i < 4; i++) {
                const fishGeometry = new THREE.BoxGeometry(0.9, 0.3, 0.3); // 3x bigger fallback fish
                const fishMaterial = new THREE.MeshLambertMaterial({ color: 0xff6600 });
                const fish = new THREE.Mesh(fishGeometry, fishMaterial);
                
                // Keep fallback fish within circular area (water radius is 2.5)
                const swimRadius = 2.0; // Smaller than water surface radius
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * swimRadius;
                const fishX = poolX + Math.cos(angle) * distance;
                const fishZ = poolZ + Math.sin(angle) * distance;
                fish.position.set(fishX, 0.8, fishZ);
                
                fish.userData = { 
                  centerX: fishX, 
                  centerZ: fishZ,
                  swimRadius: swimRadius
                };
                fishArrayRef.current.push(fish);
                scene.add(fish);
              }
            }
          }

          camera.position.set(0, 2, 3);
          camera.lookAt(0, 0, 0);
          
          // Re-enable controls for fallback interior scene
          if (controlsRef.current) {
            controlsRef.current.enabled = true;
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
          
          console.log('Fallback interior scene created');
        };

        const loadInteriorModels = async () => {
          // Load pool and fish models
          const poolModel = await new Promise<THREE.Group>((resolve, reject) => {
            loader.load('/models/pool.glb', (gltf) => {
              console.log('Pool model loaded');
              resolve(gltf.scene);
            }, undefined, (error) => {
              console.error('Pool model failed to load:', error);
              reject(error);
            });
          });

          const fishModel = await new Promise<THREE.Group>((resolve, reject) => {
            loader.load('/models/fish.glb', (gltf) => {
              console.log('Fish model loaded');
              resolve(gltf.scene);
            }, undefined, (error) => {
              console.error('Fish model failed to load:', error);
              reject(error);
            });
          });

          // Clear existing fish array
          fishArrayRef.current = [];

          // Create 3x4 grid of pools with tighter spacing
          const poolRows = 3;
          const poolCols = 4;
          const poolSpacing = 3;

          // Walkways between pools (grated texture)
          const createGratingTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            // Base
            ctx.fillStyle = '#5a5f63';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Slot pattern
            ctx.fillStyle = '#3c4043';
            const slotW = 14; // slot width
            const slotH = 4;  // slot height
            for (let y = 12; y < canvas.height; y += 20) {
              for (let x = 8; x < canvas.width; x += 24) {
                ctx.fillRect(x, y, slotW, slotH);
              }
            }
            // Edge highlights
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            for (let y = 0; y <= canvas.height; y += 20) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(canvas.width, y);
              ctx.stroke();
            }
            // Dirt/wear
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            for (let i = 0; i < 30; i++) {
              const x = Math.random() * canvas.width;
              const y = Math.random() * canvas.height;
              const r = 1 + Math.random() * 2;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fill();
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(2, 2);
            return tex;
          };

          const walkwayMaterial = new THREE.MeshLambertMaterial({ map: createGratingTexture(), color: 0x6a7075 });
          const walkwayHeight = 0.021; // slightly above floor
          const walkwayWidth = 0.9;

          const addWalkways = (rows: number, cols: number, spacing: number) => {
            // Vertical walkways between columns: x positions at midpoints
            for (let c = 0; c < cols - 1; c++) {
              const x = ((c + 0.5) - (cols - 1) / 2) * spacing;
              const length = (rows - 1) * spacing + 4.0; // span rows + margins
              const geo = new THREE.PlaneGeometry(walkwayWidth, length);
              const mesh = new THREE.Mesh(geo, walkwayMaterial);
              mesh.rotation.x = -Math.PI / 2;
              mesh.position.set(x, walkwayHeight, 0);
              mesh.receiveShadow = true;
              scene.add(mesh);
            }
            // Horizontal walkways between rows: z positions at midpoints
            for (let r = 0; r < rows - 1; r++) {
              const z = ((r + 0.5) - (rows - 1) / 2) * spacing;
              const length = (cols - 1) * spacing + 6.0; // span cols + margins
              const geo = new THREE.PlaneGeometry(length, walkwayWidth);
              const mesh = new THREE.Mesh(geo, walkwayMaterial);
              mesh.rotation.x = -Math.PI / 2;
              mesh.position.set(0, walkwayHeight, z);
              mesh.receiveShadow = true;
              scene.add(mesh);
            }
            // Perimeter short pads near door paths (optional): small pieces at ends
          };

          addWalkways(poolRows, poolCols, poolSpacing);
          
          for (let row = 0; row < poolRows; row++) {
            for (let col = 0; col < poolCols; col++) {
              // Create pool
              const pool = poolModel.clone();
              pool.scale.setScalar(1.5);
              const poolX = (col - 1.5) * poolSpacing;
              const poolZ = (row - 1) * poolSpacing;
              
              // Position pool on ground - cache bounding box for performance
              if (!pool.userData.boundingBox) {
                pool.userData.boundingBox = new THREE.Box3().setFromObject(pool);
              }
              pool.position.set(poolX, -pool.userData.boundingBox.min.y, poolZ);
              scene.add(pool);

              // Calculate water surface based on pool dimensions - circular water for round pools
              const poolSize = pool.userData.boundingBox.getSize(new THREE.Vector3());
              const waterRadius = Math.min(Math.min(poolSize.x, poolSize.z) * 0.44, 1.65); // Increased by 10%
              
              const waterGeometry = new THREE.CircleGeometry(waterRadius, 32);
              const waterMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x4488ff, 
                transparent: true, 
                opacity: 0.7,
                side: THREE.DoubleSide
              });
              const water = new THREE.Mesh(waterGeometry, waterMaterial);
              water.rotation.x = -Math.PI / 2;
              water.position.set(poolX, 0.2, poolZ);
              scene.add(water);

              // Add fish to each pool (3-5 fish per pool)
              const fishCount = 3 + Math.floor(Math.random() * 3);
              for (let i = 0; i < fishCount; i++) {
                const fish = fishModel.clone();
                fish.scale.setScalar(0.3); // Larger fish - 3x bigger
                
                // Position fish within circular water bounds
                const swimRadius = waterRadius * 0.7; // 70% of water radius
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * swimRadius;
                const fishX = poolX + Math.cos(angle) * distance;
                const fishZ = poolZ + Math.sin(angle) * distance;
                fish.position.set(fishX, 0.1, fishZ);
                
                // Store initial center position and swim area for animation
                fish.userData = { 
                  centerX: fishX, 
                  centerZ: fishZ,
                  swimRadius: swimRadius
                };
                
                // Random rotation
                fish.rotation.y = Math.random() * Math.PI * 2;
                
                // Store fish for animation
                fishArrayRef.current.push(fish);
                scene.add(fish);
                console.log(`Added fish ${i + 1} to pool ${row},${col}`);
              }
            }
          }

          // Set up interior camera position - much closer and more horizontal
          camera.position.set(0, 2, 3);
          camera.lookAt(0, 0, 0);
          
          // Re-enable controls for interior scene
          if (controlsRef.current) {
            controlsRef.current.enabled = true;
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
          
          console.log('Interior scene created successfully with', fishArrayRef.current.length, 'fish');
        };

        loadInteriorModels().catch((error) => {
          console.error('Error creating interior scene:', error);
          createInteriorWithFallback();
        });
      };

      createInteriorScene();
    }
  }, [currentScene]);

  return (
    <div className="scene">
      <div ref={mountRef} className="three-scene" />
    </div>
  );
});

Scene.displayName = 'Scene';

export default Scene;
