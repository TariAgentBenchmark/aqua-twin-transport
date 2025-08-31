import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelLoader {
  private loader: GLTFLoader;
  private modelCache: Map<string, THREE.Group> = new Map();

  constructor() {
    this.loader = new GLTFLoader();
  }

  public async loadModel(path: string, useCache: boolean = true): Promise<THREE.Group> {
    if (useCache && this.modelCache.has(path)) {
      return this.modelCache.get(path)!.clone();
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => {
          if (useCache) {
            this.modelCache.set(path, gltf.scene);
          }
          resolve(gltf.scene.clone());
        },
        undefined,
        (error) => {
          console.error(`Failed to load model: ${path}`, error);
          reject(error);
        }
      );
    });
  }

  public async loadMultipleModels(paths: string[]): Promise<THREE.Group[]> {
    const promises = paths.map(path => this.loadModel(path));
    return Promise.all(promises);
  }

  public clearCache(): void {
    this.modelCache.clear();
  }

  public getCachedModel(path: string): THREE.Group | null {
    return this.modelCache.get(path)?.clone() || null;
  }
}