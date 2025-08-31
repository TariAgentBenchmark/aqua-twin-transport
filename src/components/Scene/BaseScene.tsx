import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface BaseSceneConfig {
  antialias?: boolean;
  alpha?: boolean;
  clearColor?: number;
  clearAlpha?: number;
  enableShadows?: boolean;
  shadowMapType?: THREE.ShadowMapType;
}

export class BaseScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls | null = null;
  private animationId: number | null = null;

  constructor(
    private mountElement: HTMLElement,
    config: BaseSceneConfig = {}
  ) {
    const {
      antialias = true,
      alpha = true,
      clearColor = 0x001122,
      clearAlpha = 0.3,
      enableShadows = true,
      shadowMapType = THREE.PCFSoftShadowMap
    } = config;

    // Initialize scene
    this.scene = new THREE.Scene();
    
    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ antialias, alpha });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(clearColor, clearAlpha);
    
    if (enableShadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = shadowMapType;
    }
    
    this.setupCanvas();
    this.setupEventListeners();
    this.mountElement.appendChild(this.renderer.domElement);
  }

  private setupCanvas(): void {
    this.renderer.domElement.style.pointerEvents = 'auto';
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.zIndex = '0';
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public setupControls(options: {
    enableDamping?: boolean;
    dampingFactor?: number;
    screenSpacePanning?: boolean;
    minDistance?: number;
    maxDistance?: number;
    maxPolarAngle?: number;
    minPolarAngle?: number;
    target?: THREE.Vector3;
  } = {}): OrbitControls {
    const {
      enableDamping = true,
      dampingFactor = 0.08,
      screenSpacePanning = false,
      minDistance = 8,
      maxDistance = 60,
      maxPolarAngle = Math.PI / 2.2,
      minPolarAngle = Math.PI / 6,
      target = new THREE.Vector3(0, 1, 0)
    } = options;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = enableDamping;
    this.controls.dampingFactor = dampingFactor;
    this.controls.screenSpacePanning = screenSpacePanning;
    this.controls.minDistance = minDistance;
    this.controls.maxDistance = maxDistance;
    this.controls.maxPolarAngle = maxPolarAngle;
    this.controls.minPolarAngle = minPolarAngle;
    this.controls.target.copy(target);
    this.controls.update();

    return this.controls;
  }

  public startAnimation(animationCallback?: () => void): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      
      if (this.controls?.enabled) {
        this.controls.update();
      }
      
      animationCallback?.();
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
  }

  public stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public setCameraPosition(position: THREE.Vector3, lookAt?: THREE.Vector3): void {
    this.camera.position.copy(position);
    if (lookAt) {
      this.camera.lookAt(lookAt);
    }
  }

  public clear(): void {
    while (this.scene.children.length > 0) {
      const child = this.scene.children[0];
      this.scene.remove(child);
      
      // Dispose of geometries and materials
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(material => material.dispose());
        } else {
          child.material?.dispose();
        }
      }
    }
  }

  public dispose(): void {
    this.stopAnimation();
    this.clear();
    
    if (this.controls) {
      this.controls.dispose();
    }
    
    if (this.mountElement.contains(this.renderer.domElement)) {
      this.mountElement.removeChild(this.renderer.domElement);
    }
    
    this.renderer.dispose();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}