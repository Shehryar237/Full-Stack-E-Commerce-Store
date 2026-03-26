const API_BASE = 'http://localhost:5000/auth';
import { useAuthStore } from '../stores/useAuthStore';
import * as cartService from './cartService';

export async function userLogin(email: string, password: string) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    let data;
    
    try {
        data = await res.json();
    } 
    catch {
        throw new Error('Server returned non-JSON response');
    }

    if (!res.ok) {
        return { success: false, message: data?.message || res.statusText || 'Request failed' };
    }
    if (!data.success) {
        return { success: false, message: data.message || 'Login failed' };
    }
    if (!data.token) {
        return { success: false, message: 'No token returned from server' };
    }
    if (!data.user?.email) {
        return { success: false, message: 'No user returned from server' };
    }

    useAuthStore.getState().setToken(data.token);
    useAuthStore.getState().setUsername(data.user.email); // store email not username or name? can sotre name aswell later
    useAuthStore.getState().setRole(data.user.role); //used for cond. rendering
    
    //attempt cart merge
    try {
        await cartService.mergeLocalCartOnLogin();
    } catch (err) {
    // non-fatal
        console.warn('Failed to merge local cart after login', err);
    }
    return {
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
    };
}

export async function userSignup(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error('Server returned non-JSON response');
    }

    if (!res.ok) {
        return { success: false, message: data?.message || res.statusText || 'Request failed' };
    }
    if (!data.success) {
        return { success: false, message: data.message || 'Signup failed' };
    }

    return {
        success: true,
        message: data.message || 'Signup successful! Please log in.',
    };
}
