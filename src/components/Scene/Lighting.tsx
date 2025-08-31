import * as THREE from 'three';

export interface LightingConfig {
  ambient?: {
    color?: number;
    intensity?: number;
  };
  directional?: {
    color?: number;
    intensity?: number;
    position?: THREE.Vector3;
    castShadow?: boolean;
    shadowMapSize?: number;
    shadowCameraNear?: number;
    shadowCameraFar?: number;
    shadowCameraSize?: number;
  };
}

export class OutdoorLighting {
  public ambientLight: THREE.AmbientLight;
  public directionalLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene, config: LightingConfig = {}) {
    const ambientConfig = config.ambient || {};
    const directionalConfig = config.directional || {};

    // Ambient light
    this.ambientLight = new THREE.AmbientLight(
      ambientConfig.color || 0x404040,
      ambientConfig.intensity || 0.4
    );
    scene.add(this.ambientLight);

    // Directional light (sun)
    this.directionalLight = new THREE.DirectionalLight(
      directionalConfig.color || 0xffffff,
      directionalConfig.intensity || 1.2
    );
    
    this.directionalLight.position.copy(
      directionalConfig.position || new THREE.Vector3(30, 40, 20)
    );
    
    if (directionalConfig.castShadow !== false) {
      this.directionalLight.castShadow = true;
      
      const shadowMapSize = directionalConfig.shadowMapSize || 2048;
      this.directionalLight.shadow.mapSize.width = shadowMapSize;
      this.directionalLight.shadow.mapSize.height = shadowMapSize;
      
      this.directionalLight.shadow.camera.near = directionalConfig.shadowCameraNear || 0.5;
      this.directionalLight.shadow.camera.far = directionalConfig.shadowCameraFar || 100;
      
      const shadowSize = directionalConfig.shadowCameraSize || 50;
      this.directionalLight.shadow.camera.left = -shadowSize;
      this.directionalLight.shadow.camera.right = shadowSize;
      this.directionalLight.shadow.camera.top = shadowSize;
      this.directionalLight.shadow.camera.bottom = -shadowSize;
    }
    
    scene.add(this.directionalLight);
  }
}

export class IndoorLighting {
  public ambientLight: THREE.AmbientLight;
  public mainLight: THREE.DirectionalLight;
  public pointLights: THREE.PointLight[] = [];
  public lightFixtures: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene, wallHeight: number = 6) {
    // Ambient light - lower for contrast
    this.ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(this.ambientLight);

    // Main overhead lighting
    this.mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
    this.mainLight.position.set(0, wallHeight - 1, 0);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 1024;
    this.mainLight.shadow.mapSize.height = 1024;
    this.mainLight.shadow.camera.near = 0.5;
    this.mainLight.shadow.camera.far = 50;
    this.mainLight.shadow.camera.left = -20;
    this.mainLight.shadow.camera.right = 20;
    this.mainLight.shadow.camera.top = 20;
    this.mainLight.shadow.camera.bottom = -20;
    this.mainLight.shadow.bias = -0.0001;
    scene.add(this.mainLight);

    this.createCeilingLights(scene, wallHeight);
  }

  private createCeilingLights(scene: THREE.Scene, wallHeight: number): void {
    const lightFixtureMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xffffaa, 
      emissive: 0x444422 
    });
    const lightGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8);
    
    // Create light fixtures in grid pattern
    for (let x = -4; x <= 4; x += 4) {
      for (let z = -3; z <= 3; z += 3) {
        // Light fixture
        const lightFixture = new THREE.Mesh(lightGeometry, lightFixtureMaterial);
        lightFixture.position.set(x, wallHeight - 0.3, z);
        this.lightFixtures.push(lightFixture);
        scene.add(lightFixture);
        
        // Point light for each fixture
        const pointLight = new THREE.PointLight(0xffffcc, 0.3, 8);
        pointLight.position.set(x, wallHeight - 0.5, z);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;
        pointLight.shadow.bias = -0.0001;
        this.pointLights.push(pointLight);
        scene.add(pointLight);
      }
    }
  }
}