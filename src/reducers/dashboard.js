/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { INITIALIZE_DASHBOARD, SET_DASHBOARD } from '../actions/dashboard.js';

const dashboard = (state = {}, action) => {
  switch (action.type) {
    case INITIALIZE_DASHBOARD:
      return {
        ...state,
        initialized:true,
        declarations:[1,2,3,4,5,6,7,8,9,10]
      }
      break;
    case SET_DASHBOARD:
      return {
        ...state,
        declarations: action.info.slice(action.info.length - 10).sort((a,b) => {
          return new Date(b.CreatedDate) - new Date(a.CreatedDate);
        })
      }
      break;
    default:
      return state;
  }
}

export default dashboard;
