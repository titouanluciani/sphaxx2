import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Connect from './Connect'
import Scenario from './Scenario'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs({ notes, messages, campaign, loadProspects, selectedProspects, cookie, changed, setChanged, campaignHasChanged, handleMessageFilter }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  console.log("notes in tabpanel props : ", notes)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const createProspect = async () => {
    const url = document.getElementById('linkedinUrl').value
    const name = document.getElementById('linkedinName').value
    console.log(url, name)
    await fetch('api/createProspect', {
      method:'POST',
      body:JSON.stringify({ cookie, url, campaign, name })
    })
  }

  return (
    <div className=" bg-blue-200 w-5/12 p-6 rounded shadow-lg">
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} className="" aria-label="simple tabs example">
          <Tab label="Connect" {...a11yProps(0)} />
          <Tab label="Message" {...a11yProps(1)} />
          <Tab label="Scenario" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Connect connect={true} notes={notes} campaign={campaign} loadProspects={loadProspects} selectedProspects={selectedProspects} cookie={cookie} setChanged={setChanged} changed={changed} handleMessageFilter={handleMessageFilter}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Connect connect={false} notes={messages} campaign={campaign} loadProspects={loadProspects} selectedProspects={selectedProspects} cookie={cookie} setChanged={setChanged} changed={changed} campaignHasChanged={campaignHasChanged} handleMessageFilter={handleMessageFilter} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/*<input id="linkedinUrl" type="text" placeholder="Linkedin Url"/>
        <input id="linkedinName" type="text" placeholder="FirstName & Name"/>
  <button onClick={createProspect} >Submit</button>*/}
        <Scenario/>
      </TabPanel>
    </div>
  );
}
