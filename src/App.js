import SceneContainer from './Components/SceneContainer'
import OldVersionContainer from './Components/OldVersionContainer'
import { useRef, useState } from 'react';
import { Grid, Button, Typography, withStyles, Switch } from '@material-ui/core';
import * as Papa from 'papaparse'

const BlueSwitch = withStyles({
  switchBase: {
    color: '#90caf9',
    '&$checked': {
      color: '#90caf9',
    },
    '&$checked + $track': {
      backgroundColor: '#90caf9',
    },
  },
  checked: {},
  track: {},
})(Switch)

function App() {
  const [trial_position_sequence, setTrial_position_sequence] = useState([])
  const [trial_tricks_sequence, setTrial_tricks_sequence] = useState([])
  const [trial_delay_sequence, setTrial_delay_sequence] = useState([])

  const [versionTrigger, setVersionTrigger] = useState(true)

  const [accessToNewVersion, setAccessToNewVersion] = useState(false)
  const [accessToOldVersion, setAccessToOldVersion] = useState(false)

  const csvRef = useRef()
  const handleVersionTriggerChange = () => setVersionTrigger(!versionTrigger)

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
            versionTrigger ? setAccessToNewVersion(true) : setAccessToOldVersion(true)
          }
        })
        break
      }
      default:
        break
    }
  }
  
  return <>
  {!accessToNewVersion && !accessToOldVersion &&
  <Grid container direction = 'column' justify = 'center' alignItems = 'center' style = {{height:'100%', color: 'white'}} spacing = {3}>
      <BlueSwitch checked={versionTrigger} onChange={handleVersionTriggerChange} />
      {versionTrigger && <p>New Version</p>}
      {!versionTrigger && <p>Old Version</p>}
        <Grid item>
            <Button component = 'label' variant = 'contained' style = {{color:'#333333',backgroundColor:'#90caf9'}}>
                <input type = "file" ref = {csvRef} name = 'csv' hidden onChange = {changeHandle} />
                <Typography>Load CSV File</Typography>
            </Button>
        </Grid>
  </Grid>
  }
  {accessToNewVersion && 
  <SceneContainer trial_position_sequence = {trial_position_sequence}
      trial_tricks_sequence = {trial_tricks_sequence} trial_delay_sequence = {trial_delay_sequence}
    />
  }
  {accessToOldVersion && 
  <OldVersionContainer trial_position_sequence = {trial_position_sequence}
      trial_tricks_sequence = {trial_tricks_sequence} trial_delay_sequence = {trial_delay_sequence}
    />
  }
  </>   
}

export default App




