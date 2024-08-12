import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { RouteNames, adminRoutes, privateRoutes, publicRoutes } from "./index";
import { useTypeSelector } from "../hooks/useTypedSelector";
import Login from "../pages/Login/Login";

const AppRouter = () => {
  const { isAuth } = useTypeSelector((state) => state.authReducer);
  const isAuthenticated = !!localStorage.getItem("account");
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to track route changes
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
const userData = JSON.parse(localStorage.getItem("account") || '{}')
  useEffect(() => {
    const storedRoute = localStorage.getItem("currentRoute");

    if (isAuthenticated) {
      if (storedRoute) {
        setInitialRoute(storedRoute);
        navigate(storedRoute);
      } else {
         navigate(
        `${RouteNames.MAP}/1`
      );
      }
    } else {
      navigate(RouteNames.LOGIN);
    }
  }, [isAuth, isAuthenticated]);



  useEffect(() => {
    // Update localStorage whenever the location changes
    localStorage.setItem("currentRoute", location.pathname);
  }, [location]); // Depend on location to trigger on route change


  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route path={route.path} element={<route.element />} key={route.path} />
      ))}
      {isAuthenticated &&
        privateRoutes.map((route) => (
          <Route path={route.path} element={<route.element />} key={route.path} />
        ))}
      {isAuthenticated &&
        adminRoutes.map((route) => (
          <Route path={route.path} element={<route.element />} key={route.path} />
        ))}
      <Route path="*" element={<Navigate to={RouteNames.LOGIN} />} />
    </Routes>
  );
};

export default AppRouter;
