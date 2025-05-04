'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { registerUser, loginUser, getUserById, getMe, updateUser, deleteUser, requestResetPassword, verifyOTP, confirmResetPassword, googleMobileAuth, updateUserNumber } from '@/lib/api/user';

function useCookies() {
  const setCookie = useCallback((name, value, options = {}) => {
    Cookies.set(name, value, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
      ...options,
    });
  }, []);

  const getCookie = useCallback((name) => {
    return Cookies.get(name);
  }, []);

  const removeCookie = useCallback((name) => {
    Cookies.remove(name, { path: '/' });
  }, []);

  return { setCookie, getCookie, removeCookie };
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setCookie, getCookie, removeCookie } = useCookies();

  // Load user data on mount
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const userCookie = getCookie('user');
        const token = getCookie('token');

        if (userCookie && token) {
          try {
            const parsedUser = JSON.parse(userCookie);
            if (mounted && parsedUser?.email) {
              setUser(parsedUser);
            } else {
              removeCookie('user');
              removeCookie('token');
            }
          } catch (error) {
            removeCookie('user');
            removeCookie('token');
          }
        }

        if (token) {
          try {
            const response = await getMe();
            if (mounted && response?.data?.user?.email) {
              const userData = {
                id: response.data.user.id || '',
                email: response.data.user.email,
                name: response.data.user.name || '',
                avatar: response.data.user.avatar || '',
              };
              setCookie('user', JSON.stringify(userData));
              setUser(userData);
            }
          } catch (error) {
            if (mounted) {
              setUser(null);
              removeCookie('user');
              removeCookie('token');
            }
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [setCookie, getCookie, removeCookie]);

  const refreshUser = useCallback(async () => {
    const token = getCookie('token');
    if (!token) return;

    try {
      const response = await getMe();
      if (response?.data?.user?.email) {
        const userData = {
          id: response.data.user.id || '',
          email: response.data.user.email,
          name: response.data.user.name || '',
          avatar: response.data.user.avatar || '',
        };
        setCookie('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      setUser(null);
      removeCookie('user');
      removeCookie('token');
    }
  }, [getCookie, setCookie, removeCookie]);

  const register = async (payload) => {
    try {
      const response = await registerUser(payload);
      if (!response?.success || !response?.data) {
        throw new Error('Invalid API response');
      }

      const userData = {
        id: response.data.user.id || '',
        email: response.data.user.email,
        name: response.data.user.name || '',
        avatar: response.data.user.avatar || '',
      };

      if (response.data.token) {
        setCookie('token', response.data.token);
        setCookie('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error('No token provided in register response');
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      if (!response?.success || !response?.data) {
        throw new Error('Invalid API response');
      }

      const userData = {
        id: response.data.user.id || '',
        email: credentials.email,
        name: response.data.user.name || '',
        avatar: response.data.user.avatar || '',
      };

      if (response.data.token) {
        setCookie('token', response.data.token);
        setCookie('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error('No token provided in login response');
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const response = await googleMobileAuth({ credential });
      if (!response?.success || !response?.data) {
        throw new Error('Invalid API response');
      }

      const userData = {
        id: response.data.user.id || '',
        email: response.data.user.email,
        name: response.data.user.name || '',
        avatar: response.data.user.avatar || '',
      };

      if (response.data.token) {
        setCookie('token', response.data.token);
        setCookie('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error('No token provided in Google login response');
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Google login failed');
    }
  };

  const logout = async () => {
    try {
      await apiRequest({
        endpoint: '/logout',
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      removeCookie('user');
      removeCookie('token');
      setUser(null);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await getUserById(id);
      return response?.data?.user;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user');
    }
  };

  const updateUserProfile = async (id, payload) => {
    try {
      const response = await updateUser(id, payload);
      console.log('Update user profile response:', response);
      if (response?.success && response?.data?.user) {
        const userData = {
          id: response.data.user.id || '',
          email: response.data.user.email,
          name: response.data.user.name || '',
          avatar: response.data.user.avatar || '',
        };
        setCookie('user', JSON.stringify(userData));
        setUser(userData);
      }
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update user');
    }
  };

  const deleteUserAccount = async (id) => {
    try {
      const response = await deleteUser(id);
      removeCookie('user');
      removeCookie('token');
      setUser(null);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete user');
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await requestResetPassword({ email });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to request password reset');
    }
  };

  const verifyResetOTP = async (payload) => {
    try {
      const response = await verifyOTP(payload);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to verify OTP');
    }
  };

  const confirmPasswordReset = async (payload) => {
    try {
      const response = await confirmResetPassword(payload);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  const updatePhoneNumber = async (id, payload) => {
    try {
      const response = await updateUserNumber(id, payload);
      if (response?.success && response?.data?.user) {
        const userData = {
          id: response.data.user.id || '',
          email: response.data.user.email,
          name: response.data.user.name || '',
          avatar: response.data.user.avatar || '',
        };
        setCookie('user', JSON.stringify(userData));
        setUser(userData);
      }
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update phone number');
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
        refreshUser,
        fetchUserById,
        updateUserProfile,
        deleteUserAccount,
        requestPasswordReset,
        verifyResetOTP,
        confirmPasswordReset,
        updatePhoneNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
