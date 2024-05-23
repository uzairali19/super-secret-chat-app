import { createContext, useState } from "react";
import { LoginProps } from "./types";

const LoginContext = createContext<LoginProps | null>(null);

const LoginContextProvider = ({ children }:{children:any}) => {
    const [loggedIn, setLoggedIn] = useState(false);
    return (
        <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
        {children}
        </LoginContext.Provider>
    );
};

export { LoginContext, LoginContextProvider };