import React, { FC, useEffect, useState } from "react";
import "./styles.scss";
import FormInput from "../FormInput/FormInput";
import Checkbox from "../Checkbox/Checkbox";
import Buttons from "../Buttons/Buttons";
import { useDispatch } from "react-redux";
import { AuthActionCreators } from "../../store/reducers/auth/action-creator";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import icons from "../../assets/icons/icons";
import ErrorMessage from "../UI/ErrorMassage/ErrorMassage";
import LoginFormAuth from "./LoginFormAuth/LoginFormAuth";
import LoginFormForgot from "./LoginFormForgot/LoginFormForgot";
import LoginFormResetPassword from "./LoginFormResetPassword/LoginFormResetPassword";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../routes";

const LoginForm: FC = () => {
  const dispatch = useDispatch();

  const { error, isLoading, isAuth } = useTypeSelector(
    (state) => state.authReducer
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [isAuthState, setIsAuth] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);

  const submit = () => {
    dispatch(AuthActionCreators.setErr(""));
    if (
      email !== undefined &&
      email !== "" &&
      password !== "" &&
      password != undefined
    ) {
      //@ts-ignore
      dispatch(AuthActionCreators.login(email, password));
    } else {
      dispatch(AuthActionCreators.setErr("Заполните обязательные поля"));
    }
  };

  // useEffect(() => {
  //   dispatch(AuthActionCreators.setErr(""));
  //   dispatch(AuthActionCreators.setIsLoading(true)); // Установите isLoading в true
  //   const timeout = setTimeout(() => {
  //     dispatch(AuthActionCreators.setIsLoading(false)); // Установите isLoading в false через 2 секунды
  //   }, 300);

  //   return () => {
  //     clearTimeout(timeout); // Очистите таймаут при размонтировании
  //   };
  // }, [isAuthState, isResetPassword]);

  useEffect(() => {
    if (isAuth) {
      navigate(RouteNames.MAP);
    }
  }, [isAuth]);

  return (
    <div className="loginForm">
      <div
        className={`loginFormContainer ${isLoading && "active"} ${
          !isAuthState && "miniContainer"
        }`}
      >
        {error != "" && (
          <ErrorMessage
            type={"error"}
            message={error}
            onClick={() => {
              submit();
            }}
            onClose={() => {
              dispatch(AuthActionCreators.setErr(""));
            }}
          />
        )}

        <div className={`containerInput ${isLoading && "active"}`}>
          {isAuthState ? (
            !isResetPassword ? (
              <LoginFormAuth
                onForgot={() => {
                  setIsAuth(false);
                }}
                onResetPassword={() => {
                  setIsResetPassword(true);
                }}
                isLoading={isLoading}
              />
            ) : (
              <LoginFormResetPassword
                onReset={() => {
                  setIsResetPassword(false);
                }}
              />
            )
          ) : (
            <LoginFormForgot
              onAuth={() => {
                setIsAuth(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
