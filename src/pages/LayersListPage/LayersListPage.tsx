import React, { FC, Fragment, useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./styles.scss";
import Tables from "../../components/Tables/Tables";
import MapsApiRequest from "../../api/Maps/Maps";
import {
  IMapsCreateOptions,
  IMapsHeaderOptions,
  IMapsListOptions,
} from "../../models/IMaps";
import { IUserOption } from "../../models/IUser";
import { fieldToArray } from "../../components/UI/functions/functions";
import Modal from "../../components/Modal/Modal";
import FormInput from "../../components/FormInput/FormInput";
import Buttons from "../../components/Buttons/Buttons";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import { TableActionCreators } from "../../store/reducers/tableCreateReducer/action-creatorTable";
import ErrorMessage from "../../components/UI/ErrorMassage/ErrorMassage";
import { isAdmin } from "../../utils";
import { ILayersCreateOptions } from "../../models/ILayersData";
import FilePicker from "../../components/FilePicker/FilePicker";

const LayersListPage: FC = () => {
  const mapsApi = new MapsApiRequest();
  const [isHeaderTable, setHeaderTable] = useState<IUserOption>();
  const [isBodyTable, setBodyTable] = useState<any>([]);
  const [optionCreate, setOptionCreate] = useState<ILayersCreateOptions>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isRedact, setIsRedact] = useState(false);
  const [newLayer, setNewLayer] = useState<ILayersCreateOptions>();
  const [mapsOptionArray, setMapsOptionArray] = useState<any>([]);
  const dispatch = useDispatch();

  const { Table, isUpdate, error } = useTypeSelector(
    (state) => state.TableReducer
  );

  useEffect(() => {
    mapsApi.optionLayers().then((resp) => {
      if (resp.success) {
        setHeaderTable(resp.data && resp.data.actions.list);
        setOptionCreate(resp.data && resp.data.actions.create);

        mapsApi.getLayers().then((resp) => {
          if (resp.success) {
            setBodyTable(resp.data && resp.data.results);

            mapsApi.mapsFromCreate().then((resp) => {
              if (resp.success && resp.data) {
                setMapsOptionArray(resp.data);
              }
            });
          }
        });
      }
    });
  }, [isUpdate]);

  const handleNewLayer = (
    key: string,
    value: string | string[] | boolean | File[]
  ) => {
    const updatedLayer = {
      ...newLayer,
      [key]: value,
    };
    setNewLayer(updatedLayer as ILayersCreateOptions);
    dispatch(
      TableActionCreators.setTable(updatedLayer as ILayersCreateOptions)
    );
  };

  const handleSearch = (value: string) => {
    mapsApi.getLayers(`?search=${value}`).then((resp) => {
      if (resp.success) {
        setBodyTable(resp.data && resp.data.results);
      }
    });
  };

  const newLayerCreate = () => {
    mapsApi.createLayers(Table).then((resp) => {
      if (resp.success && resp.data) {
        dispatch(TableActionCreators.setTable(undefined));
        dispatch(TableActionCreators.setUpdate(!isUpdate));
        setIsOpenModal(false);
      } else {
        dispatch(
          TableActionCreators.setErr({ message: resp.message, type: "error" })
        );
      }
    });
  };

  const layerUpdate = () => {
    mapsApi.updateByIdLayer(`${Table.id}/`, Table).then((resp) => {
      if (resp.success && resp.data) {
        dispatch(TableActionCreators.setUpdate(!isUpdate));
        setIsOpenModal(false);
      } else {
        dispatch(
          TableActionCreators.setErr({ message: resp.message, type: "error" })
        );
      }
    });
  };
  const layerDelete = (id: string | number) => {
    mapsApi.deleteByIdLayer(`${id}/`).then((resp) => {
      if (resp.success && resp.data) {
        dispatch(TableActionCreators.setUpdate(!isUpdate));
        setIsOpenModal(false);
      } else {
        dispatch(
          TableActionCreators.setErr({ message: resp.message, type: "error" })
        );
      }
    });
  };

  const handleRedactLayer = (item: any) => {
    console.log("dddddd", item);

    mapsApi.getByIdLayer(item.id).then((resp) => {
      if (resp.success && resp.data) {
        const updatedLayer = fieldToArray(resp.data).reduce(
          (acc, data) => {
            //@ts-ignore
            acc[data.key] = data.value;
            return acc;
          },
          { ...newLayer }
        );
        setIsRedact(true);
        setNewLayer(updatedLayer as ILayersCreateOptions);
        dispatch(
          TableActionCreators.setTable(updatedLayer as IMapsCreateOptions)
        );
        setIsOpenModal(true);
      }
    });
  };

  return (
    <Fragment>
      {error.message && error.message !== "" && (
        <ErrorMessage
          type={error.type}
          message={error.message}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          onClose={() => dispatch(TableActionCreators.setErr({ message: "" }))}
        ></ErrorMessage>
      )}
      <Modal
        content={
          <div className="modalTable">
            <h1>{isRedact ? "Редактировать слой" : "Новый слой"}</h1>
            <div className="gridModal">
              {optionCreate &&
                fieldToArray(optionCreate).map((item) => {
                  if (isAdmin || item.key !== "company") {
                    return (
                      <FormInput
                        style={"col-3"}
                        value={Table ? Table[item.key] : undefined}
                        onChange={(e) => {
                          handleNewLayer(
                            item.key,
                            item.key === "maps" ? [e] : e
                          );
                        }}
                        subInput={item.value.label}
                        required={item.value.required}
                        error={""}
                        textArea={item.key === "description"}
                        keyData={""}
                        type={item.value.type}
                        //@ts-ignore
                        options={
                          item.key === "maps"
                            ? mapsOptionArray
                            : item.value.choices
                        }
                      />
                    );
                  }
                })}
              {!isRedact && (
                <FilePicker
                  onFilesSelected={(e) => handleNewLayer("file", e)}
                  title={
                    Table?.file
                      ? "Файл выбран"
                      : "Выберите или перетащите файлы в эту область"
                  }
                  formatText="Формат — csv, geojson Размер — не больше 15 МБ."
                />
              )}
            </div>
            <div className="gridModal">
              <Buttons text={"Отмена"} onClick={() => setIsOpenModal(false)} />
              <Buttons
                text={isRedact ? "Редактировать" : "Создать слой"}
                onClick={() => {
                  isRedact ? layerUpdate() : newLayerCreate();
                }}
              />
            </div>
          </div>
        }
        onClose={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
      />
      <div className="grayPageContainer">
        <HeaderAdmin
          title={"Создать слой"}
          onClick={() => {
            setIsOpenModal(true);
          }}
          onSearch={(value) => handleSearch(value)}
        />
        <Tables
          data={isBodyTable}
          headers={isHeaderTable ? fieldToArray(isHeaderTable) : []}
          totals={[]}
          onItemClick={(item) => {
            handleRedactLayer(item);
          }}
          onItemDelete={(item) => {
            layerDelete(item.id);
          }}
        />
      </div>
    </Fragment>
  );
};

export default LayersListPage;
