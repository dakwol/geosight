import React, { FC, useState } from "react";
import FormInput from "../../FormInput/FormInput";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../../hooks/useTypedSelector";
import Buttons from "../../Buttons/Buttons";
import icons from "../../../assets/icons/icons";
import ResetPasswordApiRequest from "../../../api/User/ResetPassword";
import { AuthActionCreators } from "../../../store/reducers/auth/action-creator";
import LoginFormCode from "./LoginFormCode/LoginFormCode";
import LoginFormNewPassword from "./LoginFormNewPassword/LoginFormNewPassword";
import UserApiRequest from "../../../api/User/Users";

interface LoginFormResetPasswordProps {
  onReset: () => void;
}

const LoginFormResetPassword: FC<LoginFormResetPasswordProps> = ({
  onReset,
}) => {
  const dispatch = useDispatch();

  const { error, isLoading } = useTypeSelector((state) => state.authReducer);

  const [step, setStep] = useState("resetPassword"); // New state for managing steps

  const resetPasswordApi = new ResetPasswordApiRequest();
  const userApi = new UserApiRequest();

  const submit = () => {
    dispatch(AuthActionCreators.setErr(""));
    const email = sessionStorage.getItem("email");
    if (email !== "" && email !== undefined && email !== null) {
      userApi.sendCode({ email: email }).then((resp) => {
        if (resp.success) {
          setStep("code"); // Move to the next step
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
    <>
      {step === "resetPassword" && (
        <div className="loginResetCotntainer">
          <h1>Восстановление аккаунта</h1>
          <p>
            Пожалуйста, введите адрес электронной почты, связанный с вашей
            учетной записью, и мы отправим письмо с кодом для восстановления.
          </p>
          <FormInput
            style={""}
            value={sessionStorage.getItem("email") || undefined}
            onChange={(e) => {
              sessionStorage.setItem("email", e);
            }}
            subInput={"Электронная почта"}
            required={true}
            error={error}
            keyData={""}
            loading={isLoading}
            type="email"
            friedlyInput={true}
          />
          <Buttons
            // ico={isLoading ? icons.lock : ""}
            text={"Отправить"}
            onClick={() => {
              submit();
            }}
            className="buttonLogin"
          />
          <p
            className="backButton"
            onClick={() => {
              onReset();
            }}
          >
            Вернуться назад
          </p>
        </div>
      )}

      {step === "code" && (
        <LoginFormCode
          goBack={() => setStep("resetPassword")}
          onCodeSubmit={() => setStep("newPassword")} // Add this to handle code submission
        />
      )}

      {step === "newPassword" && (
        <LoginFormNewPassword
          onSubmit={() => onReset()}
          goBack={() => setStep("code")}
        />
      )}
    </>
  );
};

export default LoginFormResetPassword;
