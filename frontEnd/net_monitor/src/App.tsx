import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './i18n';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from "./screens/login/Login";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}