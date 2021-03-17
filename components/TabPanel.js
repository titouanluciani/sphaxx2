import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Connect from './Connect'

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

export default function SimpleTabs({ notes, messages, campaign, loadProspects, selectedProspects, cookie, changed, setChanged }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  console.log("notes in tabpanel props : ", notes)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="h-full bg-indigo-400 w-5/12 p-6">
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} className="" aria-label="simple tabs example">
          <Tab label="Connect" {...a11yProps(0)} />
          <Tab label="Message" {...a11yProps(1)} />
          <Tab label="Scenario" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Connect connect={true} notes={notes} campaign={campaign} loadProspects={loadProspects} selectedProspects={selectedProspects} cookie={cookie} setChanged={setChanged} changed={changed} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Connect connect={false} notes={messages} campaign={campaign} loadProspects={loadProspects} selectedProspects={selectedProspects} cookie={cookie} setChanged={setChanged} changed={changed} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}
