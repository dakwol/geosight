import { AppDispatch } from "../../index";
import { IUser } from "../../../models/IUser";
import { AuthActionEnum, SetAuthAction, SetErrorAction, SetIsLoadingAction, SetTokenAction, SetUserAction } from "./types";
import { IToken } from "../../../models/IToken";
import TokenApiRequest from "../../../api/User/Token";
import { jwtDecode } from "jwt-decode";
import UserApiRequest from "../../../api/User/Users";

export const AuthActionCreators = {
    setUser: (user: IUser): SetUserAction => ({ type: AuthActionEnum.SET_USER, payload: user }),
    setToken: (token: IToken): SetTokenAction => ({ type: AuthActionEnum.SET_TOKEN, payload: token }),
    setIsAuth: (auth: boolean): SetAuthAction => ({ type: AuthActionEnum.SET_AUTH, payload: auth }),
    setErr: (payload: string): SetErrorAction => ({ type: AuthActionEnum.SET_ERROR, payload }),
    setIsLoading: (payload: boolean): SetIsLoadingAction => ({ type: AuthActionEnum.SET_IS_LOADING, payload }),
    login: (email: string, password: string) => async (dispatch: AppDispatch) => {
        dispatch(AuthActionCreators.setIsLoading(true));
        const mockUser = { email, password };
        const userToken = new TokenApiRequest();
        const userData = new UserApiRequest();
       
            if (mockUser.email.length === 0 || mockUser.password.length === 0) {
                dispatch(AuthActionCreators.setErr('Некорректный логин или пароль'));
                dispatch(AuthActionCreators.setIsLoading(false));
                return;
            }
            try {
                userToken.create({ body: mockUser }).then((resp)=>{
                    if (resp.success) {
                        const tokens = resp.data as IToken;
                        dispatch(AuthActionCreators.setToken(tokens));
                        localStorage.setItem('access', tokens.access || '')
                        localStorage.setItem('refresh', tokens.refresh || '')
                       //@ts-ignore
                        const decodeJwt = jwtDecode(tokens.refresh) || '';
                    console.log('localStorage.getItem', localStorage.getItem('access'));
                    
                       if(localStorage.getItem('access')){
                           //@ts-ignore
                            userData.getById({id: decodeJwt.user_id + '/'}).then((resp)=>{
                                    
                                if(resp.success){
                                    localStorage.setItem('auth', "true");
                                    localStorage.setItem('email', mockUser.email);
                            
                                    if (resp.data) {
                                        const data: { id?: string, email?: string, first_name?: string, last_name?: string, patronymic?: string, phone_number?:string, avatar?:string } = resp.data;
                                    
                                        const user = {
                                        id: data.id,
                                        email: data.email,
                                        phone_number: data.phone_number,
                                        first_name: data.first_name,
                                        last_name: data.last_name,
                                        patronymic: data.patronymic,
                                        avatar: data.avatar
                                        };
                                    
                                        localStorage.setItem('account', JSON.stringify(user));
                                        dispatch(AuthActionCreators.setIsAuth(true));
                                        dispatch(AuthActionCreators.setIsLoading(false));
                                    }
                                    
                                    
                                    //@ts-ignore
                                    dispatch(AuthActionCreators.setUser({id: resp.data.id, email: resp.data.email, password: mockUser.password, first_name: resp.data.first_name, last_name: resp.data.last_name, patronymic: resp.data.patronymic, phone_number: resp.data.phone_number}));
                                    dispatch(AuthActionCreators.setIsLoading(false));
                                
                                } else {
                                    dispatch(AuthActionCreators.setErr('Ошибка получения пользователя'));
                                    dispatch(AuthActionCreators.setIsLoading(false));
                                }
                            })
                       }
                          
                        
                      
                    } else {
                        console.log(resp);
                        dispatch(AuthActionCreators.setErr('Произошла ошибка авторизации'));
                        dispatch(AuthActionCreators.setIsLoading(false));
                    }
                });
               
            } catch (e) {
                dispatch(AuthActionCreators.setErr('Произошла ошибка при авторизации'));
                dispatch(AuthActionCreators.setIsLoading(false));
            }
        
   
      
    },
    logout: () => async (dispatch: AppDispatch) => {
        dispatch(AuthActionCreators.setIsLoading(true));
        localStorage.removeItem('auth');
        localStorage.removeItem('account');
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('email');
        localStorage.removeItem('refresh');
        dispatch(AuthActionCreators.setIsAuth(false));
        dispatch(AuthActionCreators.setUser({} as IUser));
        dispatch(AuthActionCreators.setIsLoading(false));
    }
}
