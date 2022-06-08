/**
 * @flow
 *
 * Manages the state of all UI components which rely on Redux
 * This is currently limited to the LoadingModal.
 */

type UiAction = {
  type: 'ui/loading/hide' | 'ui/loading/show',
}

type UiReduxState = {
  loading: boolean,
}

const initialState = {
  loading: false,
};

export default (state: UiReduxState = initialState, action: UiAction): UiReduxState => {
  switch (action.type) {
    case 'ui/loading/hide':
      return {
        ...state,
        loading: false,
      };

    case 'ui/loading/show':
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};

const isLoading = (state: { ui: UiReduxState }) => state.ui.loading;

export const Store = ({
  isLoading,
});
