import './App.css';
import Home from './pages/home/Home.jsx';
import Main from './pages/main/Main';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
// import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Write from './pages/write/Write';
import Single from './pages/single/Single';
import Update from './pages/update/Update';

const App = () => {
  // const [data, setData] = useState("");

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/", {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     setData(response.data);
  //     console.log(data + "data");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/write" element={<Write />} />
            <Route path="/events/:event_id" element={<Single />} />
            <Route path="/events/update/:event_id" element={<Update />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
};

export default App;
