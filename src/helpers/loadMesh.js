const { Vector3, SceneLoader, Mesh } = require("@babylonjs/core")

const loadMesh = async (meshName, meshType, x, y, z) => {
    let currentMesh = null
    const loadedMesh = await SceneLoader.ImportMeshAsync(meshName, 'models/', meshType)
    if(meshType === 'grenade.babylon'){
        currentMesh = Mesh.MergeMeshes([loadedMesh.meshes[1], loadedMesh.meshes[2], loadedMesh.meshes[3]])
    } else{
        currentMesh = loadedMesh.meshes[0]
    }
    currentMesh.position = new Vector3(x, y, z)
    currentMesh.scaling = new Vector3(0.07, 0.07, 0.07)
    return currentMesh
}

export default loadMesh