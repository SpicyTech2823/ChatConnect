import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!!localStorage.getItem("token"));
  
    // On page load, verify the saved token with the backend
    useEffect(() => {
      if (!token) return setLoading(false);
      getMe(token)
        .then((data) => setUser(data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    }, []);
    const saveSession = (data) => {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        navigate("/chat", { replace: true });
      };
    const login = async (email, password) => {
        const data = await loginUser(email, password);
        saveSession(data);
    }
    const register = async (name, email, password, phone) => {
        const data = await registerUser(name, email, password, phone);
        saveSession(data);
    }
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/login", { replace: true });
    }
    return (
        <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
