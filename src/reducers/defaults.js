/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { REQUEST_DEFAULTS, RECEIVE_DEFAULTS } from '../actions/defaults.js';

const defaults = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_DEFAULTS:
      return {
        ...state,
        initialized:true
      };
    case RECEIVE_DEFAULTS:
      return {
        ...state,
        default: action.defaults
      };
    default:
      return state;
  }
}

export default defaults;
