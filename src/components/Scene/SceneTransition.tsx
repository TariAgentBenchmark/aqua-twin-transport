import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface TransitionConfig {
  duration?: number;
  endPosition?: THREE.Vector3;
  endTarget?: THREE.Vector3;
}

export class SceneTransition {
  private isTransitioning = false;
  private startTime = 0;
  private duration = 2000;
  private startPosition = new THREE.Vector3();
  private startTarget = new THREE.Vector3();
  private endPosition = new THREE.Vector3(0, 2, 3);
  private endTarget = new THREE.Vector3(0, 0, 0);
  private clickedFarmPosition = new THREE.Vector3();

  constructor(private config: TransitionConfig = {}) {
    this.duration = config.duration || 2000;
    if (config.endPosition) {
      this.endPosition.copy(config.endPosition);
    }
    if (config.endTarget) {
      this.endTarget.copy(config.endTarget);
    }
  }

  public startTransition(
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    farmPosition: THREE.Vector3,
    onSceneChange: (scene: 'exterior' | 'interior' | 'transitioning') => void
  ): void {
    // Store starting positions
    this.startPosition.copy(camera.position);
    this.startTarget.copy(controls.target);
    this.clickedFarmPosition.copy(farmPosition);
    
    // Disable controls during transition
    controls.enabled = false;
    
    // Start transition
    this.isTransitioning = true;
    this.startTime = Date.now();
    onSceneChange('transitioning');
  }

  public updateTransition(
    camera: THREE.PerspectiveCamera,
    onSceneChange: (scene: 'exterior' | 'interior' | 'transitioning') => void
  ): boolean {
    if (!this.isTransitioning) return false;

    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    // Smooth easing function (ease-in-out)
    const easedProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const farmPos = this.clickedFarmPosition;
    
    if (progress < 0.5) {
      // First half: zoom into farm building and lower view angle
      this.handleFirstHalf(camera, easedProgress * 2, farmPos);
    } else {
      // Second half: "walk into" the farm building
      this.handleSecondHalf(camera, (easedProgress - 0.5) * 2, farmPos, onSceneChange);
    }
    
    // End transition
    if (progress >= 1) {
      this.isTransitioning = false;
      return true; // Transition complete
    }
    
    return false; // Still transitioning
  }

  private handleFirstHalf(
    camera: THREE.PerspectiveCamera,
    progress: number,
    farmPos: THREE.Vector3
  ): void {
    // Target position: close to farm, gradually lowering to horizontal level
    const targetPos = new THREE.Vector3(
      farmPos.x + 1.5,
      farmPos.y + 0.2,
      farmPos.z + 1.5
    );
    const targetLook = new THREE.Vector3(farmPos.x, farmPos.y + 0.1, farmPos.z);
    
    // Interpolate camera position
    camera.position.lerpVectors(this.startPosition, targetPos, progress);
    
    // Interpolate look-at target
    const currentTarget = new THREE.Vector3().lerpVectors(
      this.startTarget,
      targetLook,
      progress
    );
    camera.lookAt(currentTarget);
  }

  private handleSecondHalf(
    camera: THREE.PerspectiveCamera,
    progress: number,
    farmPos: THREE.Vector3,
    onSceneChange: (scene: 'exterior' | 'interior' | 'transitioning') => void
  ): void {
    // From horizontal farm view to interior view
    const farmClosePos = new THREE.Vector3(
      farmPos.x + 1.5,
      farmPos.y + 0.2,
      farmPos.z + 1.5
    );
    const farmCloseTarget = new THREE.Vector3(farmPos.x, farmPos.y + 0.1, farmPos.z);
    
    // "Walk through" the farm entrance
    const enteringPos = new THREE.Vector3(
      farmPos.x,
      farmPos.y + 0.5,
      farmPos.z
    );
    
    if (progress < 0.3) {
      // Move from outside to farm entrance
      const enterProgress = progress / 0.3;
      camera.position.lerpVectors(farmClosePos, enteringPos, enterProgress);
      camera.lookAt(farmCloseTarget);
    } else {
      // Move from farm entrance to interior view
      const insideProgress = (progress - 0.3) / 0.7;
      camera.position.lerpVectors(
        enteringPos,
        this.endPosition,
        insideProgress
      );
      
      const currentTarget = new THREE.Vector3().lerpVectors(
        farmCloseTarget,
        this.endTarget,
        insideProgress
      );
      camera.lookAt(currentTarget);
      
      // Start loading interior scene when "entering" the building
      if (insideProgress > 0.1) {
        onSceneChange('interior');
      }
    }
  }

  public isActive(): boolean {
    return this.isTransitioning;
  }

  public stop(): void {
    this.isTransitioning = false;
  }
}