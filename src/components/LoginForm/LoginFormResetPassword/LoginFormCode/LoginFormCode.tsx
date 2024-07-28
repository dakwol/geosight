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
  onCodeSubmit: () => void;
}

const LoginFormCode: FC<LoginFormCode> = ({ goBack, onCodeSubmit }) => {
  const [code, setCode] = useState("");
  const { error, isLoading } = useTypeSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const userApi = new UserApiRequest();

  const checkCode = () => {
    dispatch(AuthActionCreators.setErr(""));
    const code = sessionStorage.getItem("code");
    const email = sessionStorage.getItem("email");
    if (code !== "" && code !== undefined && code !== null) {
      userApi.checkActivationCode({ code: code, email: email }).then((resp) => {
        if (resp.success) {
          onCodeSubmit(); // Move to the next step
        } else {
          dispatch(
            AuthActionCreators.setErr("Произошла ошибка обработки запроса")
          );
        }
      });
    } else {
      dispatch(AuthActionCreators.setErr("Поля не заполнены"));
    }
  };

  return (
    <div className="loginResetCotntainer">
      <h1>Мы отправили код на почту</h1>
      <p>Введите код из письма</p>
      {/* <FormInput
        style={""}
        value={undefined}
        onChange={(e) => {
          setCode(e);
        }}
        subInput={"Электронная почта"}
        required={true}
        error={error}
        keyData={""}
        loading={isLoading}
        type="email"
        friedlyInput={true}
      /> */}
      <InputOtp
        value={code}
        onChange={(e) => sessionStorage.setItem("code", `${e.value}`)}
      />
        <div className="containerFooterLogin">
      <Buttons
        // ico={isLoading ? icons.lock : ""}
        text={"Отправить"}
        onClick={() => {
          checkCode();
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

export default LoginFormCode;
