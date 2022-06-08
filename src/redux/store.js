/**
 * @flow
 *
 * This file configures the Redux store
 *
 * To keep things simple, and because Firebase already acts as a state management solution,
 * we are only using Redux for the following:
 *
 * 1) `redux-form` integration
 * 2) Basic UI state, i.e. the loading modal
 */
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import uiReducer from '../ui/redux/uiReducer';

const rootReducer = combineReducers({
  form: formReducer,
  ui: uiReducer,
});

const store = createStore(rootReducer);
export default store;
