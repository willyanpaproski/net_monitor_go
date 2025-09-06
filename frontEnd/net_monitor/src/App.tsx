import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './i18n';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from "./screens/login/Login";
import { ToastContainer } from "react-toastify";

export type APIError = {
  error : {
    code: string;
    message: string;
  };
}

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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </LanguageProvider>
  );
}