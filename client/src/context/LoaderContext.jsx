import React, { createContext, useContext, useState } from "react";
import Loader from "../components/Loader";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const showLoader = (msg = "Loading, please wait...") => {
    setMessage(msg);
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, loading }}>
      {children}
      <Loader show={loading} message={message} />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);