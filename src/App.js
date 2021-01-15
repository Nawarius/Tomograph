import SceneContainer from './Components/SceneContainer'
import { useEffect, useState } from 'react';


function App() {
  const [trial_position_sequence, setTrial_position_sequence] = useState(false)
  const [trial_tricks_sequence, setTrial_tricks_sequence] = useState(false)
  const [trial_delay_sequence, setTrial_delay_sequence] = useState(false)
  useEffect(()=>{
    fetch('http://localhost:4000/', {
          method:'GET',
          headers:{
              'Content-Type':'application/json'
          }
      }).then(res=>{
          if(res.status !== 200) throw new Error('Failed')
          return res.json()
      }).then(resData=>{
          setTrial_position_sequence(JSON.parse(resData.trial_position))
          setTrial_tricks_sequence(JSON.parse(resData.trial_tricks))
          setTrial_delay_sequence(JSON.parse(resData.trial_delay))
      }).catch(err=>{
          throw err
      })
  },[])



        
  return <>
    {trial_position_sequence && trial_tricks_sequence && trial_delay_sequence && <SceneContainer trial_position_sequence = {trial_position_sequence}
     trial_tricks_sequence = {trial_tricks_sequence} trial_delay_sequence = {trial_delay_sequence}
     />}
    
  </>
}

export default App;
