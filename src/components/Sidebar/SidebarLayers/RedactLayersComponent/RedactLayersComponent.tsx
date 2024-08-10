import { FC, useEffect, useMemo, useState } from "react";
import icons from "../../../../assets/icons/icons";
import "./styles.scss";
import MapsApiRequest from "../../../../api/Maps/Maps";
import {
  IOptionFormSelector,
  IOptionInput,
} from "../../../../models/IOptionInput";
import FormInput from "../../../FormInput/FormInput";
import { fieldToArray } from "../../../UI/functions/functions";
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";
import { useDispatch, useSelector } from "react-redux";
import { DataPressActionCreators } from "../../../../store/reducers/dataPressItem/action-creator";
import { Slider } from "primereact/slider";
import Checkbox from "../../../Checkbox/Checkbox";

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

  const dataPress = useSelector((state: any) => state.dataPressReducer.dataPress);
  const isUpdate = useSelector((state: any) => state.dataPressReducer.isUpdate);

  const typeLayerStyles = [
    { id: 1, value: "polygon", display_name: "Полигон" },
    { id: 2, value: "line", display_name: "Линия" },
    { id: 3, value: "point", display_name: "Точка" },
  ];

  const [layersOption, setLayersOption] = useState<ILayersStylesOption>();
  const [isUpdateMap, setIsUpdateMap] = useState(false);
  const [layersFieldName, setLayersFieldName] = useState([]);
  const [fieldCalculation, setFieldCalculation] = useState([]);
  const [layersPalitre, setLayersPalitre] = useState([]);
  const [activeTypeLayer, setActiveTypeLayer] = useState("polygon");
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(null);

  const [dataFonts, setDataFonts] = useState([
    { value: "Open Sans", display_name: "Open Sans" },
  ]);
  const [dataFontsStyle, setDataFontsStyle] = useState([
    { value: "Semibold", display_name: "Semibold" },
    { value: "Bold", display_name: "Bold" },
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

    mapLayerApi
      .layersPropertis(layerData.id, "?types=integer&types=float&types=string")
      .then((resp) => {
        if (resp.success && resp.data) {
          const newProperties = resp.data.map((item: any) => ({
            id: item.name,
            value: item.name,
            display_name: item.name,
            type: item.type,
          }));
          setFieldCalculation(newProperties);
        }
      });
  }, []);

  useEffect(() => {
  
    // Accessing the polygon_value_field_name property from dataPress
    const valueFieldName = dataPress.polygon_value_field_name;
    const valueFieldLabel = dataPress.polygon_label_field_value;
  
    if (
      (valueFieldName !== undefined &&
      valueFieldName !== "") ||
      (valueFieldLabel !== undefined &&
        valueFieldLabel !== "")
    ) {
      const currentFilter = fieldCalculation.find(
        //@ts-ignore
        (field) => field.value === (valueFieldName || valueFieldLabel)
      );
      
  
      if (currentFilter) {
        mapLayerApi
          .layersPropertyValues(
            layerData.id,
            //@ts-ignore
            'integer/',
            //@ts-ignore
            `?property_name=${currentFilter.value}`
          )
          .then((resp) => {
            if (resp.success && resp.data) {
              
              //@ts-ignore
              if (currentFilter.type === "string") {
                // const newPropertiesName =
                //   resp.data.results.length > 0 &&
                //   resp.data.results.map((item: any) => ({
                //     id: item.id,
                //     value: item.id,
                //     display_name: item.name,
                //   }));
                // setLayersPalitre(newPropertiesName);
                setLayersPalitre(resp.data);
              } else {
                setLayersPalitre(resp.data);
              }
            }
          });
      }
    }
  }, [dataPress.polygon_value_field_name]);
  

  useEffect(() => {
    dispatch(DataPressActionCreators.clearDataPress());
    fieldToArray(layerData.serialize_styles[activeTypeLayer]).forEach((item) =>
      handleChange(item.key, item.value, false)
    );
  }, [activeTypeLayer]);

  const handleChange = (
    fieldName: string,
    fieldValue: string | boolean,
    updateMap: boolean = false
  ) => {
    if (fieldName.endsWith("opacity")) {
      dispatch(DataPressActionCreators.setDataPress(fieldName, `${Number(fieldValue)}`));
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
            if (item.key.endsWith("value_field_name")) {
              return (
                <div>
                  <FormInput 
                    style={""} 
                    value={dataPress[item.key]} 
                    onChange={(value) => handleChange(item.key, value, true)}
                    subInput={item.value.label} 
                    required={false}
                    options={fieldCalculation} 
                    error={""} 
                    keyData={""}
                  />
                </div>
              );
            }
            if (item.key.endsWith("label_field_value")) {
              return (
                <div>
                  <FormInput 
                    style={""} 
                    value={dataPress[item.key]} 
                    onChange={(value) => handleChange(item.key, value, true)}
                    subInput={item.value.label} 
                    required={false}
                    options={fieldCalculation} 
                    error={""} 
                    keyData={""}
                  />
                </div>
              );
            }

            if (item.key.endsWith("palette")) {
              const dataColors = [
                {
                  'empty-0': { size: 0, color: "#FFDFD6" }, 
                  'empty-1': { size: 25, color: "#E3A5C7" }, 
                  'empty-2': { size: 50, color: "#B692C2" }, 
                  'empty-3': { size: 75, color: "#694F8E" }, 
                  'empty-4': { size: 100, color: "#F7EFE5" }
                },
                {
                  'empty-0': { size: 0, color: "#201E43" }, 
                  'empty-1': { size: 25, color: "#071952" }, 
                  'empty-2': { size: 50, color: "#134B70" }, 
                  'empty-3': { size: 75, color: "#508C9B" }, 
                  'empty-4': { size: 100, color: "#EEEEEE" }
                },
                {
                  'empty-0': { size: 0, color: "#006769" }, 
                  'empty-1': { size: 25, color: "#538392" }, 
                  'empty-2': { size: 50, color: "#40A578" }, 
                  'empty-3': { size: 75, color: "#9DDE8B" }, 
                  'empty-4': { size: 100, color: "#E6FF94" }
                },
                {
                  'empty-0': { size: 0, color: "#1F2544" }, 
                  'empty-1': { size: 25, color: "#2D3250" }, 
                  'empty-2': { size: 50, color: "#424769" }, 
                  'empty-3': { size: 75, color: "#7077A1" }, 
                  'empty-4': { size: 100, color: "#F6B17A" }
                },
                {
                  'empty-0': { size: 0, color: "#EADBC8" }, 
                  'empty-1': { size: 25, color: "#E4C59E" }, 
                  'empty-2': { size: 50, color: "#AF8260" }, 
                  'empty-3': { size: 75, color: "#803D3B" }, 
                  'empty-4': { size: 100, color: "#322C2B" }
                }
              ];
            
              const handleCheckboxChange = (index: any, palette: any) => {
                setSelectedPaletteIndex(index);
                
                handleChange(item.key, palette, true); // Передаем выбранный массив цветов
              };
            
              return (
                <div className="fillInputColor">
                  {dataColors.map((palette, paletteIndex) => (
                    <div key={paletteIndex} className={`checkboxContainerFill ${selectedPaletteIndex === paletteIndex && 'focus'}`} onClick={() => handleCheckboxChange(paletteIndex, palette)}>
                     
                      <div className="colorPalette">
                        {Object.values(palette).map((colorObj, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="colorPickerInputFill"
                            style={{ backgroundColor: colorObj.color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
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
