import React, { FC, useEffect, useState } from "react";
import FormInput from "../../FormInput/FormInput";
import { useDispatch, useSelector } from "react-redux";
import { useTypeSelector } from "../../../hooks/useTypedSelector";
import Buttons from "../../Buttons/Buttons";
import icons from "../../../assets/icons/icons";
import ResetPasswordApiRequest from "../../../api/User/ResetPassword";
import { AuthActionCreators } from "../../../store/reducers/auth/action-creator";
import UserApiRequest from "../../../api/User/Users";
import { fieldToArray } from "../../UI/functions/functions";
import { DataPressState } from "../../../store/reducers/dataPressItem/types";
import { DataPressActionCreators } from "../../../store/reducers/dataPressItem/action-creator";

interface LoginForgotProps {
  onAuth: () => void;
}

interface IOption {
  required: boolean;
  id: number;
  label: string;
  type: string;
}

interface IUserOption {
  key: string;
  value: IOption;
}

const LoginFormForgot: FC<LoginForgotProps> = ({ onAuth }) => {
  const dispatch = useDispatch();
  const dataPress = useSelector(
    (state: any) => state.dataPressReducer.dataPress
  );

  const { error, isLoading } = useTypeSelector((state) => state.authReducer);

  const [email, setEmail] = useState("");
  const [isOptionsUser, setOptionsUser] = useState<IUserOption[]>([]);
  const usersApi = new UserApiRequest();

  useEffect(() => {
    usersApi.options().then((resp) => {
      if (resp.success) {
        setOptionsUser(
          //@ts-ignore
          fieldToArray(resp?.data?.actions?.create) as IFilterOption[]
        );
      }
    });
  }, []);

  const handleChange = (fieldName: string, fieldValue: string | boolean) => {
    dispatch(DataPressActionCreators.setDataPress(fieldName, fieldValue));
  };

  const submit = () => {
    dispatch(AuthActionCreators.setErr(""));
    if (dataPress !== "") {
      usersApi.create({ body: dataPress }).then((resp) => {
        if (resp.success) {
          onAuth();
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
      <h1>Регистрация</h1>
      {isOptionsUser?.map((item: IUserOption) => {
        return (
          <FormInput
            style={""}
            value={undefined}
            onChange={(e) => {
              handleChange(item.key, e);
            }}
            subInput={item.value.label}
            required={item.value.required}
            error={error}
            keyData={""}
            loading={isLoading}
            type={item.key === "phone_number" ? "phone" : item.value.type}
            friedlyInput={true}
          />
        );
      })}

    <div className="containerFooterLogin">
      <Buttons
        // ico={isLoading ? icons.lock : ""}
        text={"Зарегистрироваться"}
        onClick={() => {
          submit();
        }}
        className="buttonLogin"
      />
      <p
        className="backButton"
        onClick={() => {
          onAuth();
        }}
      >
        Вернуться назад
      </p>
      </div>
    </>
  );
};

export default LoginFormForgot;
