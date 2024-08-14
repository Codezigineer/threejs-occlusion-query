import { Camera, Mesh, SkinnedMesh, Vector2 } from "three";
import { BVHStorage } from "./bvhStorage";

export class OcclusionRaytracer
{
    raysWidth: number
    raysHeight: number
    bvhStorage: BVHStorage
    camera: Camera

    constructor(bvhStorage: BVHStorage, raysWidth: number, raysHeight: number, camera: Camera)
    {
        this.bvhStorage = bvhStorage;
        this.raysWidth = raysWidth;
        this.raysHeight = raysHeight;
        this.camera = camera;
    }; 

    runOcclusionQuery(): (Mesh | SkinnedMesh) []
    {
        const objects: (Mesh | SkinnedMesh) [] = [];
        const dims = new Vector2(this.raysWidth, this.raysHeight);
        for(var x = -Math.floor(this.raysWidth/2); x != Math.floor(-this.raysWidth/2); x++)
        for(var y = -Math.floor(this.raysHeight/2); y != Math.floor(-this.raysHeight/2); y++)
        {
            const vec2 = new Vector2(x, y);
            vec2.divide(dims).multiplyScalar(2);
            const object = this.bvhStorage.cameraRaycast(this.camera, vec2);
            var alreadyExists = false;
            for(const object_ of objects)
            {
                alreadyExists ||= object.id === object_.id;
            };
            if(!alreadyExists) objects.push(object.clone(false));
        };

        return objects;
    };
};