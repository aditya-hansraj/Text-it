import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    }, []);

    const updateRegisterInfo = useCallback(info => {
        console.log(info)
        setRegisterInfo(info);
    }, []);

    const registerUser = useCallback(async (event) => {
        event.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterLoading(false);
        setRegisterInfo({
            name: '',
            email: '',
            password: ''
        });
        if(response.error) {
            return setRegisterError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

    const updateLoginInfo = useCallback(info => {
        console.log(info);
        setLoginInfo(info);
    }, []);

    const loginUser = useCallback(async (event) => {
        event.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false);
        setLoginInfo({
            email: '',
            password: ''
        });
        if(response.error) {
            return setLoginError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [loginInfo]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider 
            value={{
                user, 
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                logoutUser,
                loginInfo, 
                updateLoginInfo, 
                loginUser, 
                loginError, 
                isLoginLoading
            }}
        >
            { children }
        </AuthContext.Provider>
    );
}