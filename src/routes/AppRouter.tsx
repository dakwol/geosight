import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { RouteNames, adminRoutes, privateRoutes, publicRoutes } from "./index";
import { useTypeSelector } from "../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { AuthActionCreators } from "../store/reducers/auth/action-creator";
import { IUser } from "../models/IUser";
import Sidebar from "../components/Sidebar/Sidebar";
import icons from "../assets/icons/icons";
import HeaderAdmin from "../components/HeaderAdmin/HeaderAdmin";

const AppRouter = () => {
  const { isAuth } = useTypeSelector((state) => state.authReducer);
  const isAuthenticated = !!localStorage.getItem("account");
  // const isAuthenticated = true;
  const navigate = useNavigate();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedRoute = localStorage.getItem("currentRoute");

    if (storedRoute) {
      setInitialRoute(storedRoute);
    } else {
      setInitialRoute(RouteNames.LOGIN);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem("currentRoute", window.location.pathname);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const sidebarData = [
    {
      id: 1,
      exact: false,
      element: <></>,
      navigate: () => navigate(RouteNames.MAPLIST),
      ico: icons.adminPanelSettings,
      name: "Админ",
    },
    { id: 2, exact: false, element: <></>, ico: icons.map2, name: "Карта" },
    {
      id: 3,
      exact: false,
      element: <></>,
      ico: icons.iosShare,
      name: "Шеринг",
    },
  ];

  const adminData = [
    {
      display: "Микрорайоны",
      ico: icons.markerPin,
      path: "/",
    },
    {
      display: "Участки",
      ico: icons.map,
      path: "/landPLots",
    },
    {
      display: "Карта",
      ico: icons.map1,
      path: "/map",
    },
  ];

  return (
    <>
      {/* {isAuthenticated && window.location.pathname === "/" && (
        <Sidebar sbData={sidebarData} pageType={undefined} />
      )} */}
      <Routes>
        <Route path="*" element={""} />
        {publicRoutes.map((route) => (
          <Route
            path={route.path}
            element={<route.element />}
            key={route.path}
          />
        ))}
        {isAuthenticated &&
          privateRoutes.map((route) => (
            <Route
              path={route.path}
              element={<route.element />}
              key={route.path}
            />
          ))}
        {isAuthenticated &&
          adminRoutes.map((route) => (
            <Route
              path={route.path}
              element={<route.element />}
              key={route.path}
            />
          ))}
      </Routes>
    </>
  );
};

export default AppRouter;
