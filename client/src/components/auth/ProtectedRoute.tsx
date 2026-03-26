import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

interface Props {
    children: React.ReactElement;
}

export default function ProtectedRoute({ children }: Props) {
    const token = useAuthStore(state => state.token);
    if (!token) return <Navigate to="/login" replace />;
    return children;
}