import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { RouteNames, privateRoutes, publicRoutes } from "./index";
import { useTypeSelector } from "../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { AuthActionCreators } from "../store/reducers/auth/action-creator";
import { IUser } from "../models/IUser";
import Sidebar from "../components/Sidebar/Sidebar";
import icons from "../assets/icons/icons";

const AppRouter = () => {
  const { isAuth } = useTypeSelector((state) => state.authReducer);
  const isAuthenticated = !!localStorage.getItem("account");
  // const isAuthenticated = true;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = JSON.parse(
        localStorage.getItem("account") || "{}"
      ) as IUser;
      dispatch(AuthActionCreators.setUser(storedUser));
      navigate(RouteNames.MAP);
    } else {
      navigate(RouteNames.LOGIN);
      // navigate(RouteNames.MAP);
    }
  }, [isAuthenticated]);

  const sidebarData = [
    {
      exact: false,
      element: <></>,
      ico: icons.adminPanelSettings,
      name: "Админ",
    },
    { exact: false, element: <></>, ico: icons.map, name: "Карта" },
    { exact: false, element: <></>, ico: icons.iosShare, name: "Шеринг" },
  ];

  return (
    <>
      {isAuthenticated && <Sidebar sbData={sidebarData} pageType={undefined} />}
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        {publicRoutes.map((route) => (
          <Route
            path={route.path}
            element={<route.element />}
            key={route.path}
          />
        ))}
        {privateRoutes.map((route) => (
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
