import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

//jwt created on backend auth controller

interface AuthState {
    //this defines shape of our store
    token: string | null;
    userName: string | null;
    role: string | null;

    setToken: (token: string | null) => void;
    clearToken: () => void;

    setUsername: (userName: string | null) => void;
    clearUsername: () => void;

    setRole: (role: string | null) => void; 
    clearRole: () => void; 
}
//"create" wil create zustand store
//"persist" will save our store to localstorage

export const useAuthStore = create<AuthState>()(
//this hook will be used for auth state
    persist(
        (set) => ({
            //state update
            token: null,//initial state
            userName:null,
            role: null,
            setToken: (token) => set({ token }),
            clearToken: () => set({ token: null }),
            setUsername:(userName)=>set({userName}),
            clearUsername:()=> set({userName:null}),
            setRole: (role) => set({ role }),
            clearRole: () => set({ role: null }), 
        }),
        {   //persist config
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage), 
        }
    )
);
