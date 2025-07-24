import "./index.css";
import React from "react"
import { Route,Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";


const App = () => {
  return (
        <Routes>
          <Route path='/' element={<Auth/>}></Route>
          <Route path='/dashboard/:userId' element={<Dashboard/>}></Route>
        </Routes>
  );
};

export default App;