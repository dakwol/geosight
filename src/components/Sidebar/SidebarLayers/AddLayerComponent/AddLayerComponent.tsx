import React, { FC, Fragment, useState } from "react";
import Modal from "../../../Modal/Modal";
import { fieldToArray } from "../../../UI/functions/functions";
import Buttons from "../../../Buttons/Buttons";
import icons from "../../../../assets/icons/icons";
import MapsApiRequest from "../../../../api/Maps/Maps";
import { IOptionInput } from "../../../../models/IOptionInput";
import FormInput from "../../../FormInput/FormInput";
import FilePicker from "../../../FilePicker/FilePicker";
import "./styles.scss";

interface IOptionLayerCreate {
  maps: IOptionInput;
  name: IOptionInput;
}

interface IAddLayerProps {
  mapDataId: string;
}

const AddLayerComponent: FC<IAddLayerProps> = ({ mapDataId }) => {
  const mapLayerApi = new MapsApiRequest();
  const [isAddLayer, setAddLayer] = useState<boolean>(false);
  const [optionLayers, setOptionLayers] = useState<IOptionLayerCreate>();
  const [formData, setFormData] = useState({});
  const handleOpenAddLayer = () => {
    mapLayerApi.optionLayers().then((resp) => {
      if (resp.success && resp.data) {
        setAddLayer(true);
        setOptionLayers(resp.data.actions.create);
      }
    });
  };

  const handleInputChange = (key: string, value: string | File[]) => {
    setFormData((prevFormData) => ({ ...prevFormData, [key]: value }));
  };

  const createLayer = async () => {
    const newFormData = new FormData();
    fieldToArray(formData).forEach((item) => {
      if (Array.isArray(item.value)) {
        item.value.forEach((file) => newFormData.append(item.key, file));
      } else {
        newFormData.append(item.key, item.value);
      }
    });
    newFormData.append("maps", mapDataId);

    try {
      const resp = await mapLayerApi.createLayers(newFormData);
      if (resp.success) {
        setAddLayer(false);
      }
    } catch (error) {
      console.error("Error creating layer:", error);
    }
  };

  return (
    <Fragment>
      <Modal
        content={
          <div>
            <h1 className="titleModal">Новый слой</h1>
            <div className="gridModal">
              {optionLayers &&
                fieldToArray(optionLayers).map((item) => {
                  if (item.key === "maps") {
                    return;
                  }
                  return (
                    <FormInput
                      style={"col-3"}
                      value={undefined}
                      onChange={(value) => handleInputChange(item.key, value)}
                      subInput={item.value.label}
                      required={item.value.required}
                      error={""}
                      keyData={""}
                    ></FormInput>
                  );
                })}
              <FilePicker
                onFilesSelected={(e) => handleInputChange("file", e)}
                title="Выберите или перетащите файлы в эту область"
                formatText="Формат — csv, geojson Размер — не больше 15 МБ."
              />
              <Buttons
                text={"Создать"}
                onClick={createLayer}
                className="modalButtonCreateLayer col-3"
              />
            </div>
          </div>
        }
        isOpen={isAddLayer}
        onClose={() => setAddLayer(false)}
      ></Modal>
      <Buttons
        ico={icons.plus}
        text={"Добавить слой"}
        onClick={() => handleOpenAddLayer()}
        className="addLayerButton"
      />
    </Fragment>
  );
};

export default AddLayerComponent;
