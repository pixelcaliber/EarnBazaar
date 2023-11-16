import "./App.css";
import Home from "./pages/home/Home.jsx";
import Welcome from "./pages/welcome/Welcome";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
// import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Write from "./pages/write/Write";
import SingleEvent from "./pages/singleEvent/SingleEvent";
import Update from "./pages/update/Update";

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
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/write" element={<Write />} />
            <Route path="/events/:event_id" element={<SingleEvent />} />
            <Route path="/events/update/:event_id" element={<Update />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
};

export default App;
