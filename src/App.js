import SceneContainer from './Components/SceneContainer'
import { useRef, useState } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import * as Papa from 'papaparse'

function App() {
  const [trial_position_sequence, setTrial_position_sequence] = useState([])
  const [trial_tricks_sequence, setTrial_tricks_sequence] = useState([])
  const [trial_delay_sequence, setTrial_delay_sequence] = useState([])

  // const [allowedPosition, setAllowedPosition] = useState(false)
  // const [allowedDelay, setAllowedDelay] = useState(false)
  // const [allowedTricks, setAllowedTricks] = useState(false)

  const [access, setAccess] = useState(false)

  const csvRef = useRef()

  const changeHandle = (e) => {
    switch(e.target.name){
      case 'csv':{
        Papa.parse(csvRef.current.files[0], {
          dynamicTyping:true,
          header:true,
          complete: function(res){
            const positions = [], delays = [], tricks = []
            res.data.forEach(item=>{
              positions.push(item.positions)
              delays.push(item.delay)
              tricks.push(item.tricks)
            })
            setTrial_position_sequence(positions)
            setTrial_delay_sequence(delays)
            setTrial_tricks_sequence(tricks)
            setAccess(true)
          }
        })
        break
      }
      default:
        break
    }
  }

  return <>
  {!access &&
  <Grid container direction = 'column' justify = 'center' alignItems = 'center' style = {{height:'100%'}} spacing = {3}>
        <Grid item>
            <Button component = 'label' variant = 'contained' style = {{color:'#333333',backgroundColor:'#90caf9'}}>
                <input type = "file" ref = {csvRef} name = 'csv' hidden onChange = {changeHandle} />
                <Typography>Load CSV File</Typography>
            </Button>
        </Grid>
  </Grid>
  }
  {access && 
  <SceneContainer trial_position_sequence = {trial_position_sequence}
    trial_tricks_sequence = {trial_tricks_sequence} trial_delay_sequence = {trial_delay_sequence}
    />
    }
    
  </>
}

export default App
