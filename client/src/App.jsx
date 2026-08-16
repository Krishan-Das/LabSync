import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomePage from "./pages/HomePage";
import PdfEditor from "./pages/PdfEditor";

function App() {
  return (
    <Routes>
      {/* ১. সাধারণ পেজগুলো (Header & Footer সহ) */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* ২. PDF Editor পেজ (Header & Footer ছাড়া Fullscreen) */}
      <Route path="/pdf-editor" element={<PdfEditor />} />
    </Routes>
  );
}

export default App; 