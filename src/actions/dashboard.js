/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { dashboardUrl } from '../components/appConfig.js';
import { navigate } from '../actions/app.js';
import { installRouter } from 'pwa-helpers/router.js';
export const INITIALIZE_DASHBOARD = 'INITIALIZE_DASHBOARD';
export const SET_DASHBOARD = 'SET_DASHBOARD';

export const getDashboard = (user) => (dispatch) => {
  dispatch(dashboardInitialized());
  loadDash(user).then(
    dash => {
      dispatch(setUserDashboard(dash));
    }
  ).catch((e) => {
    const newLocation = '/';
    window.history.pushState({}, '', newLocation);
    installRouter((location) => dispatch(navigate(newLocation)));
  });
}

const loadDash = (user) => {
  return fetch(dashboardUrl, {
    method:"GET",
    mode:"cors",
    cache:"no-cache",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json",
      "Authorization":`jwt ${user.token}`,
      "X-Identifiable":1
    }
  }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    }
  )
}

const dashboardInitialized = () => {
  return {
    type:INITIALIZE_DASHBOARD
  }
}

const setUserDashboard = (info) => {
  return {
    type: SET_DASHBOARD,
    info
  }
}
