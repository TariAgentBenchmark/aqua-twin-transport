import * as THREE from 'three';
import { ModelLoader } from './ModelLoader';
import { OutdoorLighting } from './Lighting';

export interface OutdoorSceneConfig {
  farmGridSize?: number;
  farmSpacing?: number;
  farmScale?: number;
  treeRings?: number;
  treeSpacing?: number;
  enableModelLoader?: boolean;
}

export class OutdoorScene {
  private modelLoader: ModelLoader;
  public farmBuildings: THREE.Group[] = [];

  constructor(
    private scene: THREE.Scene,
    config: OutdoorSceneConfig = {}
  ) {
    this.modelLoader = new ModelLoader();
    new OutdoorLighting(scene);
    this.init(config);
  }

  private async init(config: OutdoorSceneConfig): Promise<void> {
    this.createGround();
    await this.createFarmBuildings(config);
    await this.createTrees(config);
  }

  private createGround(): void {
    const groundGeometry = new THREE.PlaneGeometry(100, 80);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x2a4d3a,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private async createFarmBuildings(config: OutdoorSceneConfig): Promise<void> {
    const {
      farmGridSize = 3,
      farmSpacing = 2.5,
      farmScale = 2.0,
      enableModelLoader = true
    } = config;

    if (enableModelLoader) {
      try {
        const farmModel = await this.modelLoader.loadModel('/models/farm.glb');
        this.createFarmGrid(farmModel, farmGridSize, farmSpacing, farmScale);
      } catch (error) {
        console.error('Failed to load farm model, using fallback:', error);
        this.createFallbackFarms(farmGridSize, farmSpacing);
      }
    } else {
      this.createFallbackFarms(farmGridSize, farmSpacing);
    }
  }

  private createFarmGrid(
    farmModel: THREE.Group,
    gridSize: number,
    spacing: number,
    scale: number
  ): void {
    const startX = -(gridSize - 1) * spacing / 2;
    const startZ = -(gridSize - 1) * spacing / 2;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const farm = farmModel.clone();
        farm.scale.setScalar(scale);
        
        // Position after scaling
        const box = new THREE.Box3().setFromObject(farm);
        farm.position.set(
          startX + col * spacing,
          -box.min.y,
          startZ + row * spacing
        );
        
        farm.castShadow = true;
        farm.receiveShadow = true;
        farm.rotation.y = (Math.random() - 0.5) * 0.2;
        
        this.farmBuildings.push(farm);
        this.scene.add(farm);
      }
    }
  }

  private createFallbackFarms(gridSize: number, spacing: number): void {
    const geometry = new THREE.BoxGeometry(6, 4, 6);
    const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    const startX = -(gridSize - 1) * spacing / 2;
    const startZ = -(gridSize - 1) * spacing / 2;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const building = new THREE.Mesh(geometry, material);
        building.position.set(
          startX + col * spacing,
          2,
          startZ + row * spacing
        );
        building.castShadow = true;
        building.receiveShadow = true;
        
        const group = new THREE.Group();
        group.add(building);
        this.farmBuildings.push(group);
        this.scene.add(group);
      }
    }
  }

  private async createTrees(config: OutdoorSceneConfig): Promise<void> {
    const {
      treeRings = 4,
      treeSpacing = 1.8,
      enableModelLoader = true
    } = config;

    if (enableModelLoader) {
      try {
        const [treeModel, pineModel] = await this.modelLoader.loadMultipleModels([
          '/models/tree.glb',
          '/models/pine.glb'
        ]);
        this.createTreeRings(treeModel, pineModel, treeRings, treeSpacing);
      } catch (error) {
        console.error('Failed to load tree models, using fallback:', error);
        this.createFallbackTrees(treeRings, treeSpacing);
      }
    } else {
      this.createFallbackTrees(treeRings, treeSpacing);
    }
  }

  private createTreeRings(
    treeModel: THREE.Group,
    pineModel: THREE.Group,
    rings: number,
    spacing: number
  ): void {
    const farmAreaSize = 8;
    const ringGap = 2.2;

    for (let ring = 0; ring < rings; ring++) {
      const ringSize = farmAreaSize + (ring + 1) * ringGap;
      const halfSize = ringSize / 2;

      // Top and bottom rows
      for (let x = -halfSize; x <= halfSize; x += spacing) {
        this.createTree(treeModel, pineModel, x, halfSize);
        this.createTree(treeModel, pineModel, x, -halfSize);
      }

      // Left and right columns (excluding corners)
      for (let z = -halfSize + spacing; z < halfSize; z += spacing) {
        this.createTree(treeModel, pineModel, -halfSize, z);
        this.createTree(treeModel, pineModel, halfSize, z);
      }
    }
  }

  private createTree(
    treeModel: THREE.Group,
    pineModel: THREE.Group,
    x: number,
    z: number
  ): void {
    const tree = Math.random() > 0.5 ? treeModel.clone() : pineModel.clone();
    tree.scale.setScalar(0.3 + Math.random() * 0.2);
    tree.rotation.y = Math.random() * Math.PI * 2;
    
    const box = new THREE.Box3().setFromObject(tree);
    tree.position.set(x, -box.min.y, z);
    tree.castShadow = true;
    tree.receiveShadow = true;
    
    this.scene.add(tree);
  }

  private createFallbackTrees(rings: number, spacing: number): void {
    const geometry = new THREE.ConeGeometry(0.3, 1.5, 6);
    const material = new THREE.MeshLambertMaterial({ color: 0x2d5d2d });
    
    const farmAreaSize = 8;
    const ringGap = 2.2;

    for (let ring = 0; ring < rings; ring++) {
      const ringSize = farmAreaSize + (ring + 1) * ringGap;
      const halfSize = ringSize / 2;

      // Create tree positions
      const positions = [];
      
      // Top and bottom rows
      for (let x = -halfSize; x <= halfSize; x += spacing) {
        positions.push([x, halfSize], [x, -halfSize]);
      }
      
      // Left and right columns
      for (let z = -halfSize + spacing; z < halfSize; z += spacing) {
        positions.push([-halfSize, z], [halfSize, z]);
      }

      positions.forEach(([x, z]) => {
        const tree = new THREE.Mesh(geometry, material);
        tree.position.set(x, 0.75, z);
        this.scene.add(tree);
      });
    }
  }

  public getFarmBuildings(): THREE.Group[] {
    return this.farmBuildings;
  }

  public dispose(): void {
    this.modelLoader.clearCache();
  }
}