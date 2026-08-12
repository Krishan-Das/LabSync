import React, { createContext, useContext, useState, useEffect } from 'react';

// Context তৈরি
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auth State
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@university.edu',
  });

  // Dark Mode toggle করার সাথে সাথে <html> ট্যাগে 'dark' ক্লাস যোগ/রিমুভ হবে
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const logout = () => setUser(null);

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// কাস্টম হুক যাতে যেকোনো উপাদান থেকে সহজে Context ব্যবহার করা যায়
export const useApp = () => useContext(AppContext);