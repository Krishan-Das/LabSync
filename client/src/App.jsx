import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomePage from "./pages/HomePage";
import PdfEditor from "./pages/PdfEditor";
import AboutPage from "./pages/AboutPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage/>} />
      </Route>

      <Route path="/pdf-editor" element={<PdfEditor />} />
    </Routes>
  );
}

export default App; 