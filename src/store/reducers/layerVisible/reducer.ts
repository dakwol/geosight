import { TOGGLE_LAYER_VISIBILITY } from './actions';

interface State {
  visibleLayers: string;
}

const initialState: State = {
  visibleLayers: '',
};

interface Action {
  type: string;
  payload: string;
}

const visibilityReducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case TOGGLE_LAYER_VISIBILITY:
      const layerId = action.payload;

      return {
        visibleLayers: layerId,
      };

    default:
      return state;
  }
};

export default visibilityReducer;
