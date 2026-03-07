import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('customer' | 'organizer' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // You might want a better loading spinner here
        return <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        const isOrganizerOnlyRoute =
            allowedRoles &&
            allowedRoles.length > 0 &&
            allowedRoles.includes('organizer') &&
            !allowedRoles.includes('customer') &&
            !allowedRoles.includes('admin');

        const loginPath = isOrganizerOnlyRoute ? '/login?type=organizer' : '/login';

        return <Navigate to={loginPath} replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user has wrong role, redirect to home
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
