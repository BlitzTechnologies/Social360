import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAlert } from "./AlertContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: localStorage.getItem('username'),
        email: localStorage.getItem("email")
    });

    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const loginUser = async ({ usernameEmail, password }) => {
        try {
            const res = await login({ usernameEmail, password });
            localStorage.setItem("accessToken", res.token);
            localStorage.setItem("username", res.user.username);
            localStorage.setItem("email", res.user.email);
            setUser({ username: res.user.username, email: res.user.email });
            showAlert("success", `You have been logged in, welcome back ${res.user.username}!`);
            navigate("/");
        } catch (err) {
            throw err;
        }
    }

    const logoutUser = () => {
        setUser({ username: null, email: null });
        localStorage.clear();
        showAlert("info", "You have been logged out.");
        navigate('/');
    };

    const isLoggedIn = () => {
        if (!user.username || !user.email)
        {
            return false;
        }
        return true
    }

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
