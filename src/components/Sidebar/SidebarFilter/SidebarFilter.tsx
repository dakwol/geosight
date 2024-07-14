import React, { FC, useEffect, useState } from "react";
import Buttons from "../../Buttons/Buttons";
import icons from "../../../assets/icons/icons";
import FormInput from "../../FormInput/FormInput";
import "./styles.scss";
import { Slider } from "primereact/slider";
import MapsApiRequest from "../../../api/Maps/Maps";

interface Filter {
  id: number;
  layer: string;
  property_name: string;
  range: string;
  type: string;
  propertiesArray: any[];
  propertiesType: any[];
}

interface IMapDataLayer {
  description: string;
  id: string | number;
  is_active: boolean;
  name: string;
  serialize_styles: any;
}

interface IMapDataLayers {
  mapDataLayers: IMapDataLayer[];
  mapDataId?: string;
}

const SidebarFilter: FC<IMapDataLayers> = ({ mapDataLayers }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [layersArray, setLayersArray] = useState<any>([]);
  const [choicesProperti, setChoicesProperty] = useState<any>([]);
  const mapLayerApi = new MapsApiRequest();

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        id: Date.now(),
        layer: "",
        property_name: "",
        range: "",
        type: "",
        propertiesArray: [],
        propertiesType: [],
      },
    ]);
  };

  const updateFilter = (id: number, key: keyof Filter, value: string) => {
    const updatedFilters = filters.map((filter) => {
      if (filter.id === id) {
        if (key === "layer") {
          return {
            ...filter,
            [key]: value,
            property_name: "",
            type: "",
            propertiesArray: [],
            propertiesType: [],
          };
        } else {
          return { ...filter, [key]: value };
        }
      }
      return filter;
    });

    if (key === "layer") {
      mapLayerApi.layersPropertis(value, "").then((resp) => {
        if (resp.success && resp.data) {
          const newProperties = resp.data.map((item: any) => ({
            id: item.name,
            value: item.name,
            display_name: item.name,
            type: item.type,
          }));

          setFilters((prevFilters) =>
            prevFilters.map((filter) =>
              filter.id === id
                ? {
                    ...filter,
                    propertiesType: newProperties,
                    propertiesArray: newProperties,
                  }
                : filter
            )
          );
        }
      });
    }

    if (key === "property_name") {
      const currentFilter = updatedFilters.find((filter) => filter.id === id);
      const fieldType =
        currentFilter?.propertiesType.find((prop: any) => prop.value === value)
          ?.type || "";

      const finalFilters = updatedFilters.map((filter) =>
        filter.id === id ? { ...filter, type: fieldType } : filter
      );
      setFilters(finalFilters);

      if (currentFilter) {
        mapLayerApi
          .layersPropertyValues(
            currentFilter.layer,
            `${fieldType}/`,
            `?${key}=${currentFilter.property_name}`
          )
          .then((resp) => {
            if (resp.success && resp.data) {
              console.log("API response data:", resp.data);
              if (fieldType === "string") {
                const newPropertiesName =
                  resp.data.results.length > 0 &&
                  resp.data.results.map((item: any) => ({
                    id: item.id,
                    value: item.id,
                    display_name: item.name,
                  }));
                setChoicesProperty(newPropertiesName);
              } else {
                setChoicesProperty(resp.data);
              }
            }
          });
      }
    }

    setFilters(updatedFilters);
  };

  console.log("filters", filters);

  const removeFilter = (id: number) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  useEffect(() => {
    const newLayers = mapDataLayers.map((item) => ({
      id: item.id,
      value: item.id,
      display_name: item.name,
    }));

    setLayersArray(newLayers);
  }, [mapDataLayers]);

  console.log(mapDataLayers);

  return (
    <div className="containerSidebarRight">
      <div className="containerAddLayer">
        <strong className="titleSidebarMenu">Фильтры</strong>
        <Buttons
          ico={icons.plus}
          text={"Добавить фильтр"}
          onClick={addFilter}
          className="addLayerButton"
        />
      </div>
      <div className="filtersContainer">
        {filters.map((filter) => (
          <div key={filter.id} className="filterBlock">
            <div className="filterLayerContainer">
              <FormInput
                style={""}
                value={filter.layer}
                onChange={(value: string) =>
                  updateFilter(filter.id, "layer", value)
                }
                subInput={"Слой"}
                required={false}
                error={""}
                keyData={""}
                options={layersArray}
              />
              <img
                src={icons.TrashOne}
                className="removeFilter"
                onClick={() => removeFilter(filter.id)}
              ></img>
            </div>
            {filter.layer && (
              <>
                <FormInput
                  style={""}
                  value={filter.property_name}
                  onChange={(value: string) =>
                    updateFilter(filter.id, "property_name", value)
                  }
                  subInput={"Поле"}
                  required={false}
                  options={filter.propertiesArray}
                  error={""}
                  keyData={""}
                />
                {filter.property_name &&
                  (filter.type === "string" ? (
                    <FormInput
                      style={""}
                      value={undefined}
                      onChange={function (
                        value: string,
                        isChecked?: boolean
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
                      subInput={undefined}
                      required={false}
                      options={choicesProperti}
                      error={""}
                      keyData={""}
                    />
                  ) : (
                    <>
                      <p>{filter.range}</p>
                      <Slider
                        value={Number(filter.range)}
                        onChange={(e) =>
                          updateFilter(filter.id, "range", `${e.value}`)
                        }
                        range
                      />
                    </>
                  ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarFilter;
