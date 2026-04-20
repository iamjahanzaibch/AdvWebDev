import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import FormPage from "./pages/FormPage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
