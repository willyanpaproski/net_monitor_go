import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './i18n';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import Login from "./screens/login/Login";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <LanguageSelector />
        
        <div style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}