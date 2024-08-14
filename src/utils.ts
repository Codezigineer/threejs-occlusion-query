import { Mesh, Object3D, Scene, SkinnedMesh } from "three";

export function meshesOfScene(scene: Object3D | Scene): Object3D []
{
    const objects: Object3D [] = [];
    for(const object of scene.children)
    {
        if((object instanceof Mesh) || (object instanceof SkinnedMesh)) objects.push(object);
        objects.push(...meshesOfScene(object));
    };
    return objects;
};