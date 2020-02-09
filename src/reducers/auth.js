/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import {
  SET_USER,
  SAVE_USER,
  SET_USER_TOKEN,
  AUTH_INITIALIZED,
  AUTH_ERROR,
  UPDATE_AUTH,
  LOG_OFF_AUTH
} from '../actions/auth.js';
import { stateLoader } from '../classes/state-loader.js';
const loader = new stateLoader();

const auth = (
  state = loader.loadState('Portal:Auth', {
    UserName: String,
    Password: String
  }),
  action
) => {
  switch (action.type) {
    case AUTH_INITIALIZED:
      return {
        ...state,
        initialized: true
      };
    case AUTH_ERROR:
      return {
        ...state,
        initialized: false
      };
    case UPDATE_AUTH:
      return {
        ...state,
        [action.attr]: action.val
      };
    case SET_USER:
      return {
        ...state,
        user: action.user
      };
    case SET_USER_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case SAVE_USER:
      const { UserName, Password, ...newState } = state;
      loader.saveState('Portal:Auth', newState);
      return (state = newState);
    case LOG_OFF_AUTH:
      loader.removeState('Portal:Auth');
      return (state = { UserName: String, Password: String });
    default:
      return state;
  }
};

export default auth;
