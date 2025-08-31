import * as THREE from 'three';
import { ModelLoader } from './ModelLoader';
import { IndoorLighting } from './Lighting';

export interface IndoorSceneConfig {
  poolRows?: number;
  poolCols?: number;
  poolSpacing?: number;
  poolScale?: number;
  fishPerPool?: number;
  fishScale?: number;
  wallHeight?: number;
  enableModelLoader?: boolean;
}

export class IndoorScene {
  private modelLoader: ModelLoader;
  private lighting: IndoorLighting;
  public fish: THREE.Object3D[] = [];
  
  constructor(
    private scene: THREE.Scene,
    config: IndoorSceneConfig = {}
  ) {
    this.modelLoader = new ModelLoader();
    const wallHeight = config.wallHeight || 6;
    this.lighting = new IndoorLighting(scene, wallHeight);
    this.init(config);
  }

  private async init(config: IndoorSceneConfig): Promise<void> {
    this.createFloor();
    this.createWalls(config.wallHeight || 6);
    this.createRoof(config.wallHeight || 6);
    this.createIndustrialElements(config.wallHeight || 6);
    await this.createPoolsAndFish(config);
  }

  private createFloor(): void {
    const floorGeometry = new THREE.PlaneGeometry(16, 12);
    const canvas = this.createConcreteTexture();
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1.5);
    
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      map: texture,
      color: 0xaaaaaa
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  private createConcreteTexture(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base concrete color
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add noise
    const imageData = ctx.getImageData(0, 0, 512, 512);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 60;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
    
    // Add cracks and details
    this.addConcreteDetails(ctx);
    
    return canvas;
  }

  private addConcreteDetails(ctx: CanvasRenderingContext2D): void {
    // Cracks
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.quadraticCurveTo(150, 120, 300, 140);
    ctx.quadraticCurveTo(400, 160, 480, 180);
    ctx.stroke();
    
    // Tire tracks
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.4;
    
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(512, 220);
    ctx.stroke();
    
    // Stains
    ctx.fillStyle = '#666666';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(150, 150, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = 1;
  }

  private createWalls(wallHeight: number): void {
    const wallTexture = this.createWallTexture();
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      map: wallTexture,
      color: 0xaaaaaa
    });
    
    // Front and back walls
    const frontWallGeometry = new THREE.PlaneGeometry(16, wallHeight);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(0, wallHeight/2, -6);
    frontWall.receiveShadow = true;
    this.scene.add(frontWall);
    
    const backWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    backWall.position.set(0, wallHeight/2, 6);
    backWall.rotation.y = Math.PI;
    backWall.receiveShadow = true;
    this.scene.add(backWall);
    
    // Side walls
    const sideWallGeometry = new THREE.PlaneGeometry(12, wallHeight);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-8, wallHeight/2, 0);
    leftWall.rotation.y = Math.PI/2;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(8, wallHeight/2, 0);
    rightWall.rotation.y = -Math.PI/2;
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);
  }

  private createWallTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Base wall color
    ctx.fillStyle = '#a0a0a0';
    ctx.fillRect(0, 0, 256, 256);
    
    // Block lines
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
    
    // Vertical lines
    ctx.lineWidth = 1;
    for (let x = 0; x < 256; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    
    // Weathering stains
    ctx.fillStyle = '#909090';
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 15 + 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 2);
    
    return texture;
  }

  private createRoof(wallHeight: number): void {
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x777777 });
    
    // Main roof
    const roofGeometry = new THREE.PlaneGeometry(16, 12);
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, wallHeight, 0);
    roof.rotation.x = Math.PI / 2;
    this.scene.add(roof);
  }

  private createIndustrialElements(wallHeight: number): void {
    const trussMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
    
    // Roof trusses
    const trussGeometry = new THREE.BoxGeometry(0.2, 0.4, 12);
    for (let i = -3; i <= 3; i++) {
      const truss = new THREE.Mesh(trussGeometry, trussMaterial);
      truss.position.set(i * 2.5, wallHeight - 0.2, 0);
      this.scene.add(truss);
    }
    
    // Cross beams
    const crossBeamGeometry = new THREE.BoxGeometry(16, 0.2, 0.2);
    for (let i = -2; i <= 2; i++) {
      const beam = new THREE.Mesh(crossBeamGeometry, trussMaterial);
      beam.position.set(0, wallHeight - 0.1, i * 2.5);
      this.scene.add(beam);
    }
    
    // Ventilation ducts
    const ductMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const ductGeometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 8);
    
    const duct1 = new THREE.Mesh(ductGeometry, ductMaterial);
    duct1.position.set(-6, wallHeight - 1, 0);
    duct1.rotation.z = Math.PI / 2;
    this.scene.add(duct1);
    
    const duct2 = new THREE.Mesh(ductGeometry, ductMaterial);
    duct2.position.set(6, wallHeight - 1, 0);
    duct2.rotation.z = Math.PI / 2;
    this.scene.add(duct2);
  }

  private async createPoolsAndFish(config: IndoorSceneConfig): Promise<void> {
    const {
      poolRows = 3,
      poolCols = 4,
      poolSpacing = 3,
      poolScale = 1.5,
      fishPerPool = 4,
      fishScale = 0.3,
      enableModelLoader = true
    } = config;

    if (enableModelLoader) {
      try {
        const [poolModel, fishModel] = await this.modelLoader.loadMultipleModels([
          '/models/pool.glb',
          '/models/fish.glb'
        ]);
        this.createPoolGrid(poolModel, fishModel, poolRows, poolCols, poolSpacing, poolScale, fishPerPool, fishScale);
      } catch (error) {
        console.error('Failed to load pool/fish models, using fallback:', error);
        this.createFallbackPoolsAndFish(poolRows, poolCols, poolSpacing, fishPerPool);
      }
    } else {
      this.createFallbackPoolsAndFish(poolRows, poolCols, poolSpacing, fishPerPool);
    }
  }

  private createPoolGrid(
    poolModel: THREE.Group,
    fishModel: THREE.Group,
    rows: number,
    cols: number,
    spacing: number,
    poolScale: number,
    fishPerPool: number,
    fishScale: number
  ): void {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const poolX = (col - 1.5) * spacing;
        const poolZ = (row - 1) * spacing;
        
        // Create pool
        const pool = poolModel.clone();
        pool.scale.setScalar(poolScale);
        const box = new THREE.Box3().setFromObject(pool);
        pool.position.set(poolX, -box.min.y, poolZ);
        this.scene.add(pool);

        // Create water surface
        const poolSize = box.getSize(new THREE.Vector3());
        const waterRadius = Math.min(Math.min(poolSize.x, poolSize.z) * 0.44, 1.65);
        this.createWater(poolX, poolZ, waterRadius);

        // Add fish
        this.createFishInPool(fishModel, poolX, poolZ, waterRadius, fishPerPool, fishScale);
      }
    }
  }

  private createWater(x: number, z: number, radius: number): void {
    const waterGeometry = new THREE.CircleGeometry(radius, 32);
    const waterMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4488ff, 
      transparent: true, 
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(x, 0.2, z);
    this.scene.add(water);
  }

  private createFishInPool(
    fishModel: THREE.Group,
    poolX: number,
    poolZ: number,
    waterRadius: number,
    fishCount: number,
    fishScale: number
  ): void {
    for (let i = 0; i < fishCount; i++) {
      const fish = fishModel.clone();
      fish.scale.setScalar(fishScale);
      
      const swimRadius = waterRadius * 0.7;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * swimRadius;
      const fishX = poolX + Math.cos(angle) * distance;
      const fishZ = poolZ + Math.sin(angle) * distance;
      fish.position.set(fishX, 0.1, fishZ);
      
      fish.userData = { 
        centerX: fishX, 
        centerZ: fishZ,
        swimRadius: swimRadius
      };
      
      fish.rotation.y = Math.random() * Math.PI * 2;
      this.fish.push(fish);
      this.scene.add(fish);
    }
  }

  private createFallbackPoolsAndFish(
    rows: number,
    cols: number,
    spacing: number,
    fishPerPool: number
  ): void {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const poolX = (col - 1.5) * spacing;
        const poolZ = (row - 1) * spacing;
        
        // Fallback pool
        const poolGeometry = new THREE.CylinderGeometry(3, 3, 1, 8);
        const poolMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const pool = new THREE.Mesh(poolGeometry, poolMaterial);
        pool.position.set(poolX, 0.5, poolZ);
        this.scene.add(pool);

        // Water surface
        this.createWater(poolX, poolZ, 2.75);

        // Fallback fish
        for (let i = 0; i < fishPerPool; i++) {
          const fishGeometry = new THREE.BoxGeometry(0.9, 0.3, 0.3);
          const fishMaterial = new THREE.MeshLambertMaterial({ color: 0xff6600 });
          const fish = new THREE.Mesh(fishGeometry, fishMaterial);
          
          const swimRadius = 2.0;
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
          
          this.fish.push(fish);
          this.scene.add(fish);
        }
      }
    }
  }

  public animateFish(time: number): void {
    this.fish.forEach((fish, index) => {
      const swimRadius = fish.userData.swimRadius || 0.5;
      const swimmingRadius = Math.min(swimRadius * 0.4, 0.3);
      const speed = 0.5 + index * 0.1;
      const centerX = fish.userData.centerX || fish.position.x;
      const centerZ = fish.userData.centerZ || fish.position.z;
      
      if (!fish.userData.centerX) {
        fish.userData.centerX = fish.position.x;
        fish.userData.centerZ = fish.position.z;
      }
      
      fish.position.x = centerX + Math.cos(time * speed + index) * swimmingRadius;
      fish.position.z = centerZ + Math.sin(time * speed + index) * swimmingRadius;
      
      fish.rotation.y = Math.atan2(
        Math.cos(time * speed + index),
        Math.sin(time * speed + index)
      );
      
      fish.position.y = 0.1 + Math.sin(time * 2 + index) * 0.05;
    });
  }

  public getFish(): THREE.Object3D[] {
    return this.fish;
  }

  public dispose(): void {
    this.modelLoader.clearCache();
  }
}