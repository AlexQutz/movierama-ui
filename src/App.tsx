import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Route} from "react-router-dom";
import { Routes } from "react-router";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AddMoviePage from "./pages/AddMoviePage.tsx";

export default function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/addMovie" element={<AddMoviePage />} />
        </Routes>
    </BrowserRouter>
    );
}
