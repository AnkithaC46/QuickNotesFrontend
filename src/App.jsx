// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainAppContent } from "./pages/MainAppContent";
import { SharedNoteViewer } from "./pages/SharedNoteViewer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainAppContent />} />
        <Route path="/shared/:token" element={<SharedNoteViewer />} />
      
      </Routes>
    </BrowserRouter>
  );
}