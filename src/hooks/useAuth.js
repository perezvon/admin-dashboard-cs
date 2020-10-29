import React, { useState, useEffect, useContext, createContext } from 'react';

import lock from '../lib/auth';
import { getCompanyInfo, getStoreID } from '../lib/global';

const authContext = createContext({});

const useAuthProvider = () => {
  const [user, setUser] = useState({ profile: {} });
  useEffect(() => {
    lock.on('authenticated', (authResult) => {
      // Use the token in authResult to getUserInfo() and save it to localStorage
      lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          return console.log(error);
        }
        const currentId = getStoreID(profile.username);
        const user = {
          accessToken: authResult.accessToken,
          username: profile.username,
          profile: profile.app_metadata,
          ...getCompanyInfo(currentId),
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      });
    });
  }, []);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user);
      setUser(user);
    }
  }, []);

  const showLogin = () => !localStorage.getItem('user') && lock.show();

  const logout = () => {
    lock.logout();
    localStorage.removeItem('user');
  };

  return { user, showLogin, logout };
};

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};
