import React from 'react'
import { Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, ArcRotateCamera, Tools } from '@babylonjs/core'
import SceneComponent from './OldVersionPresent'
import setMovesAndTimesToFile from '../helpers/setMovesAndTimesToFile'

let trick_delay = 50
let reactionTime = 0, prematureReaction = 0
let basket_position = 0
let n_trial = -1
let in_trial_time = 0

let trial_status = "stop"

let ground = null, leftArrowMaterial = null, rightArrowMaterial = null, topArrowMaterial = null
let movesPush = [], timesPush = []
let initialTricksArray = []

const MainComponent = ({trial_position_sequence, trial_delay_sequence, trial_tricks_sequence}) => {
initialTricksArray = [...trial_tricks_sequence]

const onSceneReady = (scene, engine) => {
  engine.displayLoadingUI()
  let camera = new ArcRotateCamera("camera", Tools.ToRadians(90), Tools.ToRadians(30), 10, Vector3.Zero(), scene)
  camera.setTarget(Vector3.Zero())

  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  ground = MeshBuilder.CreateGround("ground", {width: 1, height: 1}, scene)
  ground.rotation = new Vector3(0,Math.PI,0)
  ground.setEnabled(false)

  leftArrowMaterial = new StandardMaterial("leftArrow", scene)
  leftArrowMaterial.diffuseTexture = new Texture("./textures/leftArrow.jpg", scene)

  rightArrowMaterial = new StandardMaterial("rightArrow", scene)
  rightArrowMaterial.diffuseTexture = new Texture("./textures/rightArrow.jpg", scene)
  
  topArrowMaterial = new StandardMaterial("topArrow", scene)
  topArrowMaterial.diffuseTexture = new Texture("./textures/topArrow.jpg", scene)

  window.addEventListener("keydown", evt => {
    if (trial_status == "in_trial_listening") {
        if ((evt.keyCode == 65) | (evt.keyCode == 37)) {
            basket_position = 1
            trial_status = "in_trial_received"
            reactionTime = in_trial_time - trial_delay_sequence[n_trial]

            prematureReaction = in_trial_time - trial_delay_sequence[n_trial] < trick_delay
            if(prematureReaction && trial_tricks_sequence[n_trial]){
              trial_tricks_sequence[n_trial] = 0
              trial_tricks_sequence[n_trial + 1] = 1
            } 
            ground.setEnabled(false)
        } else if ((evt.keyCode == 68) | (evt.keyCode == 39)) {
            basket_position = -1
            trial_status = "in_trial_received"
            reactionTime = in_trial_time - trial_delay_sequence[n_trial]

            prematureReaction = in_trial_time - trial_delay_sequence[n_trial] < trick_delay
            if(prematureReaction && trial_tricks_sequence[n_trial]){
              trial_tricks_sequence[n_trial] = 0
              trial_tricks_sequence[n_trial + 1] = 1
            } 
            ground.setEnabled(false)
        } else {
            return
        }
    }

    if (evt.keyCode == 32) {
        trial_status = 'reset'
        n_trial = -1
        in_trial_time = 0
        basket_position = 0
        reactionTime = 0
    }
}
)

  engine.hideLoadingUI() 
}
let on_screen_time = 1000

const onRender = scene => {
  if (trial_status != 'stop'){
    let dt = scene.getEngine().getDeltaTime()

    in_trial_time += dt

    if (in_trial_time > on_screen_time + trial_delay_sequence[n_trial]) {
        trial_status = 'trial_end'
    }

    if (trial_status == "in_trial_not_listening") {
        if (in_trial_time > trial_delay_sequence[n_trial]) {
            trial_status = 'in_trial_listening'
              if(trial_position_sequence[n_trial] > 0) {
                  ground.setEnabled(true)
                  ground.material = leftArrowMaterial
              } else {
                  ground.setEnabled(true)
                  ground.material = rightArrowMaterial
              }
        }
    }

    if (trial_tricks_sequence[n_trial]) {
        if (in_trial_time > trick_delay + trial_delay_sequence[n_trial]) {
            ground.setEnabled(true)
            ground.material = topArrowMaterial
        }
    }
}

if (trial_status == 'trial_end') {
    if (trial_tricks_sequence[n_trial]) {
        if (basket_position == 0) {
            if(trick_delay < 900) trick_delay+=50
            console.log('good', trick_delay)
        } else {
            if(trick_delay > 50) trick_delay-=50
            console.log('bad', trick_delay)
        }
    } else {
        if (basket_position == trial_position_sequence[n_trial]) {
            console.log('good')
        } else {
            console.log('bad')
        }
    }
    movesPush.push(basket_position)
    timesPush.push(reactionTime.toFixed(3))
    trial_status = 'reset'
    
}
if (trial_status == 'reset') {
    basket_position = 0
    ground.setEnabled(false)
    reactionTime = 0
    in_trial_time = 0
    trial_status = 'in_trial_not_listening'
    n_trial += 1
    if (n_trial >= trial_delay_sequence.length) {
        trial_status = 'stop'
        setMovesAndTimesToFile(movesPush, timesPush)
        movesPush = []
        timesPush = []
        trick_delay = 50
        trial_tricks_sequence = [...initialTricksArray]
    }
}
}
return <>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id='my-canvas' />
  </>
}

export default MainComponent