/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/
import { authUrl, profileUrl } from '../components/appConfig.js';
import { navigate } from '../actions/app.js';
import { installRouter } from 'pwa-helpers/router.js';
export const SET_USER = 'SET_USER';
export const SAVE_USER = 'SAVE_USER';
export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const AUTH_INITIALIZED = 'AUTH_INITIALIZED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const UPDATE_AUTH = 'UPDATE_AUTH';
export const LOG_OFF_AUTH = 'LOG_OFF_AUTH';

export const signIn = (user) => (dispatch) => {
  dispatch(authInitialized());
  loadAuth(user).then(token => {
    dispatch(setUserToken(token));
    return loadProfile(token)
  }).then(profile => {
    dispatch(setUser(profile));
    dispatch(saveUser());
    const newLocation = '/dashboard';
    window.history.pushState({}, '', newLocation);
    installRouter((location) => dispatch(navigate(newLocation)));
  }).catch(
    (e) => {
      dispatch(authError());
      console.log(e) 
    }
  );
}

export const signOff = () => (dispatch) => {
  dispatch(logOff());
}

const loadAuth = (user) => {
  return fetch(authUrl, {
    method:"POST",
    mode:"cors",
    cache:"no-cache",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body:JSON.stringify(user)
  })
    .then((res) => {
      if(res.ok)
        return res.json();
      throw new Error('Our request failed')
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}

const loadProfile = (token) => {
  return fetch(profileUrl, {
    method:"GET",
    mode:"cors",
    cache:"no-cache",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json",
      "Authorization":`jwt ${token}`
    }
  })
    .then(res => res.json())
    .catch((e) => {
      console.log(e)
    });
}

const authInitialized = () => {
  return {
    type: AUTH_INITIALIZED
  }
}

const authError = () => {
  return {
    type: AUTH_ERROR
  }
}

export const updateAuth = (val, attr) => {
  return {
    type:UPDATE_AUTH,
    val,
    attr
  }
}

const setUserToken = (token) => {
  return {
    type: SET_USER_TOKEN,
    token
  };
}

// Need to load the profile from backend
const setUser = (user) => {
  return {
    type: SET_USER,
    user
  };
}
// Need to save user so we will not loose their information
const saveUser = () => {
  return {
    type: SAVE_USER
  };
}

const logOff = () => {
  return {
    type: LOG_OFF_AUTH
  };
}
