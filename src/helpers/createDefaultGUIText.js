import { MeshBuilder, Vector3 } from '@babylonjs/core'
import * as GUI from 'babylonjs-gui'

const createDefaultGUIText = () => {
    const textplane = MeshBuilder.CreateGround('textField', {width:5, height:5})
    textplane.rotation = new Vector3(0,Math.PI,0)

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(textplane)
    const textblock = new GUI.TextBlock()
    textblock.text = "Space to start"
    textblock.fontSize = 60
    textblock.top = -200
    textblock.color = "white"
    advancedTexture.addControl(textblock)

    return textblock
}

export default createDefaultGUIText