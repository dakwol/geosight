import React from "react";
import Login from "../pages/Login/Login";
import MapPage from "../pages/MapPage/MapPage";
import icons from "../assets/icons/icons";

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
    ADMIN = '/admin',

}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, exact: false, element: Login, ico: icons.map, name: 'Аккаунт'}

]

export const privateRoutes: IRoute[] = [
    {path: RouteNames.ADMIN, exact: false, element: MapPage, ico: icons.adminPanelSettings, name: 'Админка'},
    {path: RouteNames.MAP, exact: false, element: MapPage, ico: icons.map, name: 'Карта'},
    {path: RouteNames.MAP, exact: false, element: MapPage, ico: icons.iosShare, name: 'Шеринг'},

]