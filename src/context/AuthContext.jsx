import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../config/firebase";

//toast
import { toast } from "sonner";

const authContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);

            try{
                if(!currentUser){
                    setUser(null);
                    setIsAdmin(false);
                    return;   
                }

                const tokenResult = await getIdTokenResult(currentUser);

                setUser(currentUser);
                setIsAdmin(tokenResult.claims.admin === true);
            }catch(error){
                toast.error("Unable to verify admin permissions. Please try again later.");
                setUser(null);
                setIsAdmin(false);
            }finally{
                setLoading(false);
            }
        })
        return unsubscribe;
    }, []);

    return (
        <authContext.Provider value={{ user, isAdmin, loading }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}