import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    authService.logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsLoginModalOpen(false);
    };

    const signup = (userData) => {
        setUser(userData);
        setIsSignupModalOpen(false);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const openLoginModal = () => {
        setIsSignupModalOpen(false);
        setIsForgotPasswordModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const openSignupModal = () => {
        setIsLoginModalOpen(false);
        setIsForgotPasswordModalOpen(false);
        setIsSignupModalOpen(true);
    };

    const openForgotPasswordModal = () => {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(false);
        setIsForgotPasswordModalOpen(true);
    };

    const closeModals = () => {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(false);
        setIsForgotPasswordModalOpen(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isLoginModalOpen,
                isSignupModalOpen,
                isForgotPasswordModalOpen,
                login,
                signup,
                logout,
                openLoginModal,
                openSignupModal,
                openForgotPasswordModal,
                closeModals,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
