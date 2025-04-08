import React from 'react';
import Uploader from './Uploader';
import {Route,Routes} from "react-router-dom";
import Home from "./Home/Home.jsx";
import Downloader from "./Downloader.jsx";
function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/download" element={<Downloader/>}/>
        <Route path="/upload" element={<Uploader/>}/>
     <Route path="/" element={<Home/>}/>
        
      </Routes>
  
    </div>
  );
}

export default App;