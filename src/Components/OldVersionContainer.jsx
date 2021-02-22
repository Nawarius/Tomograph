import React from 'react'
import { Vector3, HemisphericLight, ArcRotateCamera, Tools, Color3 } from '@babylonjs/core'
import SceneComponent from './OldVersionPresent'
import setMovesAndTimesToFile from '../helpers/setMovesAndTimesToFile'
import { AdvancedDynamicTexture, Image } from '@babylonjs/gui/2D'


let trick_delay = 50
let reactionTime = 0, prematureReaction = 0
let basket_position = 0
let n_trial = -1
let in_trial_time = 0

let trial_status = "stop"

let advancedTexture = null, instructionImage = null, rightArrowImage = null, leftArrowImage = null, topArrowImage = null
let currentControl = null
let movesAndTimes = []
let initialTricksArray = []

const MainComponent = ({trial_position_sequence, trial_delay_sequence, trial_tricks_sequence}) => {
    
initialTricksArray = [...trial_tricks_sequence]

const onSceneReady = (scene, engine) => {
  engine.displayLoadingUI()
  scene.clearColor = Color3.Gray()
  let camera = new ArcRotateCamera("camera", Tools.ToRadians(90), Tools.ToRadians(30), 10, Vector3.Zero(), scene)
  camera.setTarget(Vector3.Zero())

  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene)
  light.intensity = 0.5

  advancedTexture = new AdvancedDynamicTexture.CreateFullscreenUI("UI")
  instructionImage = new Image("img", "./textures/Instructions_Practice.bmp")
  rightArrowImage = new Image("img1", "./textures/Right_Arrow.BMP")
  leftArrowImage = new Image("img2", "./textures/Left_Arrow.BMP")
  topArrowImage = new Image("img3", "./textures/Stop_Arrow.BMP")
  currentControl = instructionImage
  advancedTexture.addControl(currentControl)

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
            advancedTexture.removeControl(currentControl)
        } else if ((evt.keyCode == 68) | (evt.keyCode == 39)) {
            basket_position = -1
            trial_status = "in_trial_received"
            reactionTime = in_trial_time - trial_delay_sequence[n_trial]

            prematureReaction = in_trial_time - trial_delay_sequence[n_trial] < trick_delay
            if(prematureReaction && trial_tricks_sequence[n_trial]){
              trial_tricks_sequence[n_trial] = 0
              trial_tricks_sequence[n_trial + 1] = 1
            } 
            advancedTexture.removeControl(currentControl)
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
        advancedTexture.removeControl(currentControl)
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
                  currentControl = leftArrowImage
                  advancedTexture.addControl(currentControl)
              } else {
                  currentControl = rightArrowImage
                  advancedTexture.addControl(currentControl)
              }
        }
    }

    if (trial_tricks_sequence[n_trial]) {
        if (in_trial_time > trick_delay + trial_delay_sequence[n_trial]) {
            advancedTexture.removeControl(currentControl)
            currentControl = topArrowImage
            advancedTexture.addControl(currentControl)
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
    
    movesAndTimes.push({ position: basket_position, reaction: reactionTime.toFixed(3) })
    trial_status = 'reset'
    
}
if (trial_status == 'reset') {
    basket_position = 0
    advancedTexture.removeControl(currentControl)
    //ground.setEnabled(false)
    reactionTime = 0
    in_trial_time = 0
    trial_status = 'in_trial_not_listening'
    n_trial += 1
    if (n_trial >= trial_delay_sequence.length) {
        trial_status = 'stop'
        setMovesAndTimesToFile(movesAndTimes)
        movesAndTimes = []
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