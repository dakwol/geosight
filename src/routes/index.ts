import React from "react";
import Login from "../pages/Login/Login";
import MapPage from "../pages/MapPage/MapPage";
import icons from "../assets/icons/icons";
import MapListPage from "../pages/MapListPage/MapListPage";
import UsersListPage from "../pages/UsersListPage/UsersListPage";
import CompanyListPage from "../pages/CompanyListPage/CompanyListPage";
import LayersListPage from "../pages/LayersListPage/LayersListPage";
import { isAdmin } from "../utils";

export interface IRoute {
    path: string;
    element : React.ComponentType;
    exact?: boolean;
    id?: string;
    ico?: string;
    name?: string;
    params?: { [key: string]: string | number };
}

export enum RouteNames {
    MAP = '/map',
    LOGIN = '/login',
    MAPLIST = '/map-list',
    USERSLIST = '/users-list',
    COMPANYLIST = '/company-list',
    LAYERSLIST = '/layers-list',

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
      link: RouteNames.LAYERSLIST,
  },
  {
      id: 4,
      name: "Компании",
      link: RouteNames.COMPANYLIST,
      isVisible: isAdmin,
  },
  {
      id: 5,
      name: "Пользователи",
      link: RouteNames.USERSLIST,
  },
].filter(item => item.isVisible !== false);

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, exact: false, element: Login, ico: icons.map, name: 'Аккаунт'}

]

export const privateRoutes: IRoute[] = [
    {path: RouteNames.MAPLIST, exact: false, element: MapListPage, ico: icons.adminPanelSettings, name: 'Админка'},
    
    {path:`${RouteNames.MAP}/:id`, exact: true, element: MapPage, params: { params: ':id' }},

]
export const adminRoutes: IRoute[] = [
    {path: RouteNames.MAPLIST, exact: false, element: MapListPage, ico: icons.adminPanelSettings, name: 'Админка'},
    {path: RouteNames.USERSLIST, exact: false, element: UsersListPage, ico: icons.adminPanelSettings, name: 'Пользователи'},
    {path: RouteNames.COMPANYLIST, exact: false, element: CompanyListPage, ico: icons.adminPanelSettings, name: 'Компании'},
    {path: RouteNames.LAYERSLIST, exact: false, element: LayersListPage, ico: icons.adminPanelSettings, name: 'Слои'},
    
    {path:`${RouteNames.MAP}/:id`, exact: true, element: MapPage, params: { params: ':id' }},

]