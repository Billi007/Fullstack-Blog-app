import { createContext, useState,} from "react"


// Create Context
const UserContext = createContext();

//Create provider
const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
         {children}
        </UserContext.Provider>
    )

}

export {UserContext, UserProvider}