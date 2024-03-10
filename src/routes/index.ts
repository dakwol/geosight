import React from "react";
import Login from "../pages/Login/Login";
import MapPage from "../pages/MapPage/MapPage";
import icons from "../assets/icons/icons";
import MapListPage from "../pages/MapListPage/MapListPage";
import UsersListPage from "../pages/UsersListPage/UsersListPage";
import CompanyListPage from "../pages/CompanyListPage/CompanyListPage";

export interface IRoute {
    path: string;
    element : React.ComponentType;
    exact?: boolean;
    id?: string;
    ico?: string;
    name?: string;
}

export enum RouteNames {
    MAP = '/',
    LOGIN = '/login',
    MAPLIST = '/map-list',
    USERSLIST = '/users-list',
    COMPANYLIST = '/company-list',

}

export const navDate = [
    {
      id: 1,
      name: "Карты",
      link: RouteNames.MAPLIST,
    },
    {
      id: 2,
      name: "Слои",
    //   link: RouteNames.VACANCY,
    },
    {
      id: 3,
      name: "Скоринг",
    //   link: RouteNames.VACANCY,
    },
    {
      id: 4,
      name: "Компании",
      link: RouteNames.COMPANYLIST,
    },
    {
      id: 5,
      name: "Пользователи",
      link: RouteNames.USERSLIST,
    },
  ];

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, exact: false, element: Login, ico: icons.map, name: 'Аккаунт'}

]

export const privateRoutes: IRoute[] = [
    {path: RouteNames.MAPLIST, exact: false, element: MapListPage, ico: icons.adminPanelSettings, name: 'Админка'},
    {path: RouteNames.MAP, exact: false, element: MapPage, ico: icons.map, name: 'Карта'},

]
export const adminRoutes: IRoute[] = [
    {path: RouteNames.MAPLIST, exact: false, element: MapListPage, ico: icons.adminPanelSettings, name: 'Админка'},
    {path: RouteNames.USERSLIST, exact: false, element: UsersListPage, ico: icons.adminPanelSettings, name: 'Пользователи'},
    {path: RouteNames.COMPANYLIST, exact: false, element: CompanyListPage, ico: icons.adminPanelSettings, name: 'Компании'},
    {path: RouteNames.MAP, exact: false, element: MapPage, ico: icons.map, name: 'Карта'},

]