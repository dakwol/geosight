import React, { FC, useState } from "react";
import FormInput from "../../FormInput/FormInput";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../../hooks/useTypedSelector";
import Checkbox from "../../Checkbox/Checkbox";
import Buttons from "../../Buttons/Buttons";
import icons from "../../../assets/icons/icons";
import { AuthActionCreators } from "../../../store/reducers/auth/action-creator";

interface LoginFormProps {
  onForgot: () => void;
  onResetPassword: () => void;
  isLoading: boolean;
}

const LoginFormAuth: FC<LoginFormProps> = ({
  onForgot,
  onResetPassword,
  isLoading,
}) => {
  const dispatch = useDispatch();

  const { error } = useTypeSelector((state) => state.authReducer);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    //@ts-ignore
    dispatch(AuthActionCreators.login(username, password));
  };

  console.log("isLoading", isLoading);

  return (
    <>
      <h1>Вход в систему</h1>
      <FormInput
        style={""}
        value={undefined}
        onChange={(e) => {
          setUsername(e);
        }}
        subInput={"Почта"}
        required={true}
        error={error}
        keyData={""}
        loading={isLoading}
        type="email"
        friedlyInput={true}
      />
      <FormInput
        style={""}
        value={undefined}
        onChange={(e) => {
          setPassword(e);
        }}
        subInput={"Пароль"}
        required={true}
        error={error}
        keyData={""}
        loading={isLoading}
        type="password"
        friedlyInput={true}
      />

      <Buttons
        ico={isLoading ? icons.lock : ""}
        text={"Войти"}
        onClick={() => {
          !isLoading && submit();
        }}
        className={`buttonLogin ${isLoading && "disabled"}`}
      />
      <div className="containerCheck">
        <p
          onClick={() => {
            onResetPassword();
          }}
        >
          Забыли пароль?
        </p>
        <p>
          Нет аккаунта?
          <a href="https://geosight.ru/#form" target="_blank">
            Подать заявку
          </a>
        </p>
      </div>
    </>
  );
};

export default LoginFormAuth;
