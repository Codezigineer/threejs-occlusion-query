import { MeshBVH } from "three-mesh-bvh";
import { Camera, Mesh, Ray, SkinnedMesh, Vector2, Vector3 } from 'three';

export class BVHStorage
{
    meshes: { mesh: Mesh, bvh: MeshBVH } [] = [];
    riggedMeshes: { mesh: SkinnedMesh, bvh: MeshBVH } [] = [];
    
    constructor(meshes: (SkinnedMesh | Mesh) [])
    {
        for(const mesh of meshes)
        {
            if(!(mesh as any instanceof Mesh)) continue;
            const bvh = new MeshBVH(mesh.geometry);
            const meshStore = { 
                mesh: mesh, 
                bvh
            };
            if(mesh instanceof SkinnedMesh)
                this.riggedMeshes.push(meshStore as { mesh: SkinnedMesh, bvh: MeshBVH });
            else this.meshes.push(meshStore);
        };
    };

    updateRiggedMeshes(): void
    {
        for(var i = 0; i != this.riggedMeshes.length; i++)
            this.riggedMeshes[i].bvh = new MeshBVH(this.riggedMeshes[i].mesh.geometry);
    };

    updateMeshes(): void
    {
        for(var i = 0; i != this.meshes.length; i++)
            this.meshes[i].bvh = new MeshBVH(this.meshes[i].mesh.geometry);
    };

    raycast(origin: Vector3, direction: Vector3): Mesh | SkinnedMesh
    {
        var currentObject: Mesh | SkinnedMesh | null = null;
        var currentObjectDistance: number = Infinity;
        for(const mesh of [...this.meshes, ...this.riggedMeshes])
        {
            const point = mesh.bvh.raycastFirst(new Ray(origin, direction));
            if(currentObjectDistance > point.distance)
            {
                currentObject = mesh.mesh;
                currentObjectDistance = point.distance;
            };
        };
        return currentObject as Mesh | SkinnedMesh;
    };

    cameraRaycast(camera: Camera, coord: Vector2): Mesh | SkinnedMesh
    {
        const origin = camera.getWorldPosition(new Vector3(0, 0, 0));
        const direction = new Vector3(coord.x, coord.y, 0.5).unproject(camera).sub(origin).normalize();
        return this.raycast(origin, direction);
    };
};