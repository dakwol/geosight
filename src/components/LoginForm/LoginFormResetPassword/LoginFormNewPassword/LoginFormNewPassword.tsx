import React, { FC, useState } from "react";
import FormInput from "../../../FormInput/FormInput";
import { useTypeSelector } from "../../../../hooks/useTypedSelector";
import Buttons from "../../../Buttons/Buttons";
import { InputOtp } from "primereact/inputotp";
import { useDispatch } from "react-redux";
import { AuthActionCreators } from "../../../../store/reducers/auth/action-creator";
import UserApiRequest from "../../../../api/User/Users";

interface LoginFormCode {
  goBack: () => void;
  onSubmit: () => void;
}

const LoginFormNewPassword: FC<LoginFormCode> = ({ goBack, onSubmit }) => {
  const [code, setCode] = useState("");
  const { error, isLoading } = useTypeSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const userApi = new UserApiRequest();

  const resetPassword = () => {
    dispatch(AuthActionCreators.setErr(""));

    const code = sessionStorage.getItem("code");
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");
    const password_confirm = sessionStorage.getItem("password_confirm");

    if (!password || !password_confirm || password !== password_confirm) {
      dispatch(AuthActionCreators.setErr("Поля не сопадают"));
      return;
    }

    if (!code || !email) {
      dispatch(AuthActionCreators.setErr("Code or email is missing."));
      return;
    }

    userApi
      .resetPassword({
        code: code,
        email: email,
        password: password,
        password_confirm: password_confirm,
      })
      .then((resp) => {
        if (resp.success) {
          onSubmit();
        } else {
          const errorMessage =
            resp.data.response.data.password[0] ||
            "Произошла ошибка обработки запроса";
          dispatch(AuthActionCreators.setErr(errorMessage));
        }
      })
      .catch((error) => {
        dispatch(
          AuthActionCreators.setErr("Произошла ошибка обработки запроса")
        );
      });
  };

  return (
    <div className="loginResetCotntainer">
      <h1>Введите новый пароль</h1>
      <FormInput
        style={""}
        value={sessionStorage.getItem("password") || undefined}
        onChange={(e) => {
          sessionStorage.setItem("password", e);
        }}
        subInput={"Новый пароль"}
        required={true}
        error={error}
        keyData={""}
        loading={isLoading}
        type="password"
        friedlyInput={true}
      />
      <FormInput
        style={""}
        value={sessionStorage.getItem("password_confirm") || undefined}
        onChange={(e) => {
          sessionStorage.setItem("password_confirm", e);
        }}
        subInput={"Введите пароль ещё раз"}
        required={true}
        error={error}
        keyData={""}
        loading={isLoading}
        type="password"
        friedlyInput={true}
      />
      <div className="containerFooterLogin">
      <Buttons
        // ico={isLoading ? icons.lock : ""}
        text={"Готово"}
        onClick={() => {
          resetPassword();
        }}
        className="buttonLogin"
      />
      <p
        className="backButton"
        onClick={() => {
          goBack();
        }}
      >
        Вернуться назад
      </p>
      </div>
    </div>
  );
};

export default LoginFormNewPassword;
