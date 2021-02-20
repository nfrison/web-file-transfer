import React from 'react';
import './App.css';
import { Typography } from "@material-ui/core";
import UploadFiles from "./components/upload-files.component"

function App() {
  console.log(process.env);
  console.log(process.env.REACT_APP_BACKEND_URL);
  process.env.BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  return (
    <div className="container">
      <div className="mg20">
        <Typography variant="h5">bezkoder.com</Typography>
        <Typography variant="h6">Material UI File Upload</Typography>
      </div>

      <UploadFiles />
    </div>
  );
}

export default App;
