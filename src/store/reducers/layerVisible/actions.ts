export const TOGGLE_LAYER_VISIBILITY = "TOGGLE_LAYER_VISIBILITY";

export const toggleLayerVisibility = (layerId: string) => ({
  type: TOGGLE_LAYER_VISIBILITY,
  payload: layerId,
});

