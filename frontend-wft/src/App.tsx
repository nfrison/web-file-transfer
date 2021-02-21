import React from 'react';
import './App.css';
import { Typography, Tabs, Tab } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import UploadFiles from "./components/upload-files.component";
import Chat from "./components/chat.component";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  console.log(process.env);
  console.log(process.env.REACT_APP_BACKEND_URL);
  process.env.BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  return (
    <div className="container">
      <div className="mg20">
        <Typography variant="h5">bezkoder.com</Typography>
        <Typography variant="h6">Material UI File Upload</Typography>
      </div>
      
      <Tabs style={{marginBottom: "1em"}} value={value} onChange={handleChange} variant="fullWidth" aria-label="simple tabs example">
        <Tab label="Files" id="simple-tab-0" aria-controls="`simple-tabpanel-0" />
        <Tab label="Chat" id="simple-tab-1" aria-controls="`simple-tabpanel-1" />
      </Tabs>
      
      <div
        role="tabpanel"
        hidden={value !== 0}
        id="simple-tabpanel-0"
        aria-labelledby="simple-tab-0"
      >
        {value === 0 && (
          <UploadFiles />
        )}
      </div>

      <div
        role="tabpanel"
        hidden={value !== 1}
        id="simple-tabpanel-1"
        aria-labelledby="simple-tab-1"
      >
        {value === 1 && (
          <Chat />
        )}
      </div>
    </div>
  );
}

export default App;
