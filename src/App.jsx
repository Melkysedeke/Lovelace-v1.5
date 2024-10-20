import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";
import FormActivity from "./pages/FormActivity.jsx";
import Activity from "./pages/Activity.jsx";
import UserArea from "./pages/UserArea.jsx";
import Profile from "./pages/Profile.jsx"
import EditActivity from "./pages/EditActivity.jsx";
import AccessActivity from "./pages/AccessActivity.jsx"
import ActivityResponses from "./pages/ActivityResponses.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/ce" element={<FormActivity/>}/>
        <Route path="/a/:id" element={<Activity/>}/>
        <Route path="/ua" element={<UserArea/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/eA/:id" element={<EditActivity/>}/>
        <Route path='/aA/:id' element={<AccessActivity/>}/>
        <Route path='/rA/:id' element={<ActivityResponses/>}/> 
      </Routes>
    </BrowserRouter>
  )
}
