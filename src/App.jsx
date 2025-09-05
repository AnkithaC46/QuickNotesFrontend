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
        {/* Optional: Add a 404 Not Found Page */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}