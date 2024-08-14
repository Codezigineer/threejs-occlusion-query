import { Camera, Mesh, Object3D, Scene, SkinnedMesh, WebGLRenderer, WebGLRendererParameters } from "three";
import { OcclusionRaytracer } from "./occlusionRaytracer";
import { meshesOfScene } from './utils';
import { BVHStorage } from "./bvhStorage";

export class WebGLOcclusionRenderer extends WebGLRenderer
{
    occlusionRaytracer: OcclusionRaytracer
    scene: Scene
    
    /**
     * @description Update Delay in frames.
    */
    updateDelay: number = 30;
    
    /**
     * @description Current amount of frames rendered. Is reset when above the update delay.
     */
    updateDelayCurrentFrames: number = 0;
    currentUnoccludedMeshes: Object3D[] = [];

    camera: Camera;

    constructor(args: WebGLRendererParameters = {}, scene: Scene, camera: Camera)
    {
        super(args);
        this.scene = scene;
        this.occlusionRaytracer = new OcclusionRaytracer(new BVHStorage([]), 240, 240, camera);
        const sceneMeshes: Object3D [] = meshesOfScene(this.scene);
        this.occlusionRaytracer.bvhStorage = new BVHStorage(sceneMeshes as (SkinnedMesh | Mesh) []);
        this.camera = camera;
    };

    render(): void
    {
        if(this.updateDelayCurrentFrames >= this.updateDelay)
        {
            this.updateDelayCurrentFrames = 0;
            const sceneMeshes: Object3D [] = meshesOfScene(this.scene);
            this.occlusionRaytracer.bvhStorage = new BVHStorage(sceneMeshes as (SkinnedMesh | Mesh) []);
            this.currentUnoccludedMeshes = this.occlusionRaytracer.runOcclusionQuery();
        };

        const placeboScene = new Scene();
        placeboScene.add(...this.currentUnoccludedMeshes);
        WebGLRenderer.prototype.render.apply(this, [placeboScene, this.camera]);
    };
};