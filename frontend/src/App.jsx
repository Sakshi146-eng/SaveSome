import "./index.css";
import React from "react"
import { Route,Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
const App = () => {
  return (
        <Routes>
          <Route path='/' element={<Signup/>}></Route>
          <Route path ='/login' element={<Login/>}></Route>
        </Routes>
  );
};

export default App;