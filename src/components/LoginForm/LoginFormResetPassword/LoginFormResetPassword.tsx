import React, { FC, useState } from "react";
import FormInput from "../../FormInput/FormInput";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../../hooks/useTypedSelector";
import Buttons from "../../Buttons/Buttons";
import icons from "../../../assets/icons/icons";
import ResetPasswordApiRequest from "../../../api/User/ResetPassword";
import { AuthActionCreators } from "../../../store/reducers/auth/action-creator";

interface LoginFormResetPasswordProps {
  onReset: () => void;
}

const LoginFormResetPassword: FC<LoginFormResetPasswordProps> = ({
  onReset,
}) => {
  const dispatch = useDispatch();

  const { error, isLoading } = useTypeSelector((state) => state.authReducer);

  const [email, setEmail] = useState("");
  const resetPasswordApi = new ResetPasswordApiRequest();
  const submit = () => {
    dispatch(AuthActionCreators.setErr(""));
    if (email !== "" && email !== undefined && email !== null) {
      resetPasswordApi.create({ body: { email: email } }).then((resp) => {
        if (resp.success) {
          onReset();
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
      <h1>Восстановление аккаунта</h1>
      <p>
        Пожалуйста, введите адрес электронной почты, связанный с вашей учетной
        записью, и мы отправим письмо с кодом для восстановления.
      </p>
      <FormInput
        style={""}
        value={undefined}
        onChange={(e) => {
          setEmail(e);
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
  );
};

export default LoginFormResetPassword;
