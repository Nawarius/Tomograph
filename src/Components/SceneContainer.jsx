import React from 'react';
import { Vector3, HemisphericLight, ArcRotateCamera, Tools } from '@babylonjs/core';
import SceneComponent from './ScenePresent'
import createDefaultGUIText from '../helpers/createDefaultGUIText'
import setMovesAndTimesToFile from '../helpers/setMovesAndTimesToFile'
import loadMesh from '../helpers/loadMesh'

let trick_delay = 500
let reactionTime = 0

let basket_position = 0
let n_trial = -1
let in_trial_time = 0

let trial_status = "stop"

let box = null, bomb = null, basket = null, apple = null, banana = null, cheese = null, hamburger = null, orange = null, pizza = null
const fruits = {}

let textblock = null

let movesPush = [], timesPush = []

const MainComponent = ({trial_position_sequence, trial_delay_sequence, trial_tricks_sequence}) => {
    
const onSceneReady = async (scene, engine) => {
        engine.displayLoadingUI()
        let camera = new ArcRotateCamera("camera", Tools.ToRadians(90), Tools.ToRadians(30), 10, Vector3.Zero(), scene)
        camera.setTarget(Vector3.Zero())

        let light = new HemisphericLight("light", new Vector3(0, 1, 0), scene)
        light.intensity = 5
        
        apple = await loadMesh('', 'Apple.babylon', 0, 0, 0)
        fruits.apple = apple
        box = apple
        bomb = await loadMesh('Bomb', 'Bomb.babylon', 0, 0, 0)
        bomb.setEnabled(false)
        banana = await loadMesh('Banana', 'Banana.babylon', 0, 0, 0)
        banana.setEnabled(false)
        fruits.banana = banana
        cheese = await loadMesh('Cheese', 'Cheese.babylon', 0, 0, 0)
        cheese.setEnabled(false)
        fruits.cheese = cheese
        hamburger = await loadMesh('Hamburger', 'Hamburger.babylon', 0, 0, 0)
        hamburger.setEnabled(false)
        fruits.hamburger = hamburger
        orange = await loadMesh('Orange', 'Orange.babylon', 0, 0, 0)
        orange.setEnabled(false)
        fruits.orange = orange
        pizza = await loadMesh('PizzaSlice', 'PizzaSlice.babylon', 0, 0, 0)
        pizza.setEnabled(false)
        fruits.pizza = pizza
        basket = await loadMesh('Rattan_Case', 'Rattan_Case.babylon', 0, 0, 3.5)
        basket.rotation = new Vector3(-Math.PI/3, 0, 0)

        textblock = createDefaultGUIText()
        
            window.addEventListener("keydown", evt => {
                if (trial_status == "in_trial_listening") {
                    if ((evt.keyCode == 65) | (evt.keyCode == 37)) {
                        basket_position = 1
                        basket.position.x = 2
                        trial_status = "in_trial_received"
                        reactionTime = in_trial_time - trial_delay_sequence[n_trial]
                    } else if ((evt.keyCode == 68) | (evt.keyCode == 39)) {
                        basket_position = -1
                        basket.position.x = -2
                        trial_status = "in_trial_received"
                        reactionTime = in_trial_time - trial_delay_sequence[n_trial]
                    } else {
                        return
                    }
                }
    
                if (evt.keyCode == 32) {
                    textblock.text = ''
                    trial_status = 'reset'
                    n_trial = -1
                    in_trial_time = 0
                    basket.position.x = 0
                    basket_position = 0
                    reactionTime = 0
                }
            }
            )
            engine.hideLoadingUI()  
}

let speed = 15. / 1000
let on_screen_time = 1000

let rand = null

const onRender = (scene) => {
    
    if (trial_status != 'stop'){
        //Random for fruits
        if(rand > 0 && rand < 0.2){
            box.setEnabled(false)
            fruits.pizza.position = box.position
            box = fruits.pizza
            box.setEnabled(true)
        } else if(rand > 0.2 && rand < 0.4){
            box.setEnabled(false)
            fruits.orange.position = box.position
            box = fruits.orange
            box.setEnabled(true)
        } else if(rand > 0.4 && rand < 0.6){
            box.setEnabled(false)
            fruits.hamburger.position = box.position
            box = fruits.hamburger
            box.setEnabled(true)
        } else if(rand > 0.6 && rand < 0.8){
            box.setEnabled(false)
            fruits.cheese.position = box.position
            box = fruits.cheese
            box.setEnabled(true)
        } else {
            box.setEnabled(false)
            fruits.apple.position = box.position
            box = fruits.apple
            box.setEnabled(true)
        }
        //End of random
        let dt = scene.getEngine().getDeltaTime()

        box.position.z += speed * dt;
        in_trial_time += dt;
        if (in_trial_time > on_screen_time + trial_delay_sequence[n_trial]) {
            trial_status = 'trial_end'
        }

        if (trial_status == "in_trial_not_listening") {
            if (in_trial_time > trial_delay_sequence[n_trial]) {
                trial_status = 'in_trial_listening'
            }
        }

        if (trial_tricks_sequence[n_trial]) {
            if (in_trial_time > trick_delay + trial_delay_sequence[n_trial]) {
                box.setEnabled(false)
                bomb.setEnabled(true)
                bomb.position = box.position
            }
        } else {
            box.setEnabled(true)
            bomb.setEnabled(false)
        }
    }
    
    if (trial_status == 'trial_end') {
        if (trial_tricks_sequence[n_trial]) {
            if (basket_position == 0) {
                textblock.text = `good ${reactionTime}`
                console.log('good')
            } else {
                textblock.text = `bad ${reactionTime}`
                console.log('bad')
            }
        } else {
            if (basket_position == trial_position_sequence[n_trial]) {
                textblock.text = `good ${reactionTime}`
                console.log('good')
            } else {
                textblock.text = `bad ${reactionTime}`
                console.log('bad')
            }
        }
        movesPush.push(basket.position.x)
        timesPush.push(reactionTime)
        trial_status = 'reset'
        
    }
    if (trial_status == 'reset') {
        console.log('Here')
        basket.position.x = 0
        basket_position = 0

        reactionTime = 0
        in_trial_time = 0
        
        trial_status = 'in_trial_not_listening'
        n_trial += 1
        if (n_trial >= trial_delay_sequence.length) {
            trial_status = 'stop'
            textblock.text = 'All done!'
            setMovesAndTimesToFile(movesPush, timesPush)
            movesPush = []
            timesPush = []
        }
        box.position.z = 3 - speed * (on_screen_time + trial_delay_sequence[n_trial])
        box.position.x = 2 * trial_position_sequence[n_trial]
        rand = Math.random()
    }
}
    return <>
            <div>
                <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id='my-canvas' />
            </div>
    </>

}

export default MainComponent