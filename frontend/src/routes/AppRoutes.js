// src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";


export default function AppRoutes() {

  return (

    <Routes>

      <Route path="/" element={<Home />} />

      {/* You can add more routes here later */}

    </Routes>

  );

}