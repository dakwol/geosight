import React, { FC, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import icons from "../../../../assets/icons/icons";
import "./styles.scss";
import MapsApiRequest from "../../../../api/Maps/Maps";
import {
  IOptionFormSelector,
  IOptionInput,
} from "../../../../models/IOptionInput";
import { ILayersData } from "../../../../models/ILayersData";
import FormInput from "../../../FormInput/FormInput";
import { fieldToArray } from "../../../UI/functions/functions";
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";
import { useDispatch, useSelector } from "react-redux";
import { DataPressActionCreators } from "../../../../store/reducers/dataPressItem/action-creator";
import { Slider } from "primereact/slider";
import { DataPressState } from "../../../../store/reducers/dataPressItem/types";

interface IRedactLayersProps {
  layerData: any;
  onBack: () => void;
}

interface ILayersStylesOption {
  point: IOptionInput;
  line: IOptionInput;
  polygon: IOptionInput;
}

const RedactLayersComponent: FC<IRedactLayersProps> = ({
  layerData,
  onBack,
}) => {
  const mapLayerApi = new MapsApiRequest();
  const dispatch = useDispatch();

  const dataPress = useSelector(
    (state: any) => state.dataPressReducer.dataPress
  );
  const isUpdate = useSelector((state: any) => state.dataPressReducer.isUpdate);

  console.log("isUpdate", isUpdate);

  const typeLayerStyles = [
    {
      id: 1,
      value: "polygon",
      display_name: "Полигон",
    },
    {
      id: 2,
      value: "line",
      display_name: "Линия",
    },
    {
      id: 3,
      value: "point",
      display_name: "Точка",
    },
  ];

  const [layersOption, setLayersOption] = useState<ILayersStylesOption>();
  const [isUpdateMap, setIsUpdateMap] = useState(false);
  const [layersFieldName, setLayersFieldName] = useState([]);
  const [activeTypeLayer, setActiveTypeLayer] = useState("polygon");

  const [dataFonts, setDataFonts] = useState([
    {
      value: "Open Sans",
      display_name: "Open Sans",
    },
  ]);
  const [dataFontsStyle, setDataFontsStyle] = useState([
    {
      value: "Semibold",
      display_name: "Semibold",
    },
    {
      value: "Bold",
      display_name: "Bold",
    },
  ]);

  useEffect(() => {
    mapLayerApi.optionLayers().then((resp) => {
      if (resp.success && resp.data) {
        setLayersOption({
          polygon: resp.data.actions.polygon,
          line: resp.data.actions.line,
          point: resp.data.actions.point,
        });
      }
    });
    mapLayerApi
      .layersPropertis(layerData.id, "?types=integer&types=float")
      .then((resp) => {
        if (resp.success && resp.data) {
          const newProperties = resp.data.map((item: any) => ({
            id: item.name,
            value: item.name,
            display_name: item.name,
            type: item.type,
          }));

          setLayersFieldName(newProperties);
        }
      });
  }, []);


  useEffect(() => {
    dispatch(DataPressActionCreators.clearDataPress());
    fieldToArray(layerData.serialize_styles[activeTypeLayer]).map((item) =>
      handleChange(item.key, item.value, false)
    );
  }, [activeTypeLayer]);

  const handleChange = (
    fieldName: string,
    fieldValue: string | boolean,
    updateMap: boolean = false
  ) => {

    if (fieldName.endsWith("opacity")) {
      dispatch(
        DataPressActionCreators.setDataPress(fieldName, `${Number(fieldValue)}`)
      );
    } else {
      dispatch(DataPressActionCreators.setDataPress(fieldName, fieldValue));
    }

    if (updateMap) {
      setIsUpdateMap(true);
    }
  };

  useEffect(() => {
    if (isUpdateMap) {
      mapLayerApi
        .updateLayers(layerData.id, activeTypeLayer, dataPress)
        .then((resp) => {
          if (resp.success && resp.data) {
            dispatch(DataPressActionCreators.setUpdate(!isUpdate));
          }
        });
    }
  }, [dataPress]);

  console.log("dataPress", dataPress);

  return (
    <div className="containerSidebarRight">
      <div className="containerAddLayer">
        <h1 className="titleSidebarMenu">{layerData.name}</h1>
        <img
          src={icons.undo}
          onClick={() => onBack()}
          className="backRedactButton"
        ></img>
      </div>
      <div className="containerLayers">
        <FormInput
          style={"formInputRedactLayer"}
          value={activeTypeLayer}
          onChange={(e) => setActiveTypeLayer(e)}
          options={typeLayerStyles as IOptionFormSelector[]}
          subInput={"Тип"}
          required={false}
          error={""}
          keyData={""}
        ></FormInput>

        {layersOption &&
          dataPress &&
          //@ts-ignore
          fieldToArray(layersOption[activeTypeLayer]).map((item) => {
            console.log("item", item);

            if (item.key === "id") {
              return null;
            }
            if (item.key.endsWith("color")) {
              return (
                <div className="colorPickerContainer">
                  <ColorPicker
                    value={dataPress[item.key]}
                    onChange={(e: ColorPickerChangeEvent) =>
                      handleChange(item.key, `#${e.value}`, true)
                    }
                    panelClassName="colorPickerLayerStyle"
                    inputClassName="colorPickerInputStyle"
                    children={<div></div>}
                  />
                  <input
                    value={dataPress[item.key]}
                    className="colorPickerInput"
                    placeholder="#FFFFFF"
                    onChange={(e) =>
                      handleChange(item.key, e.target.value, true)
                    }
                  />
                </div>
              );
            }
            if (item.key.endsWith("opacity")) {
              return (
                <div>
                  <FormInput 
                    style={"miniFormOpacity"} 
                    value={dataPress[item.key]} 
                    onChange={(value)=>handleChange(item.key, `${Number(value) / 10}`, true)} 
                    subInput={item.value.label} 
                    required={false} 
                    error={""} 
                    keyData={""}
                  />
                  <Slider value={Number(dataPress[item.key])} onChange={(e) => handleChange(item.key, `${Number(e.value)}`, true)} max={1} step={0.1}/>
                </div>
              );
            }

            if (item.key.endsWith("palette")) {
              const paletteEntries = Object.entries(dataPress[item.key] || "");

              // Заполним массив до 5 элементов пустыми значениями, если текущих меньше 5
              while (paletteEntries.length < 5) {
                paletteEntries.push([`empty-${paletteEntries.length}`, ""]);
              }

              return (
                <div className="fillInputColor">
                  {paletteEntries.map(
                    ([paletteKey, paletteValue]: [string, any], index) => (
                      <ColorPicker
                        key={paletteKey || index}
                        value={paletteValue}
                        onChange={(e: ColorPickerChangeEvent) =>
                          handleChange(
                            item.key,
                            {
                              ...dataPress[item.key],
                              [paletteKey]: `#${e.value}`,
                            },
                            true
                          )
                        }
                        panelClassName="colorPickerLayerStyle"
                        inputClassName="colorPickerInputFill"
                      >
                        <div></div>
                      </ColorPicker>
                    )
                  )}
                </div>
              );
            }

            return (
              <div>
                <FormInput
                  style={"formInputRedactLayer"}
                  value={dataPress[item.key]}
                  onChange={(value) => handleChange(item.key, value, true)}
                  subInput={item.value.label}
                  required={false}
                  placeholder={item.value.placeholder}
                  error={""}
                  options={
                    item.key.endsWith("value_field_name")
                      ? layersFieldName.length !== 0
                        ? layersFieldName
                        : []
                      : item.key.endsWith("label_font")
                      ? dataFonts
                      : item.key.endsWith("label_font_style")
                      ? dataFontsStyle
                      : item.value.choices
                  }
                  keyData={""}
                ></FormInput>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RedactLayersComponent;
