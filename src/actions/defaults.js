/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { defaultDeclarationUrl } from '../components/appConfig.js';
export const REQUEST_DEFAULTS = 'REQUEST_DEFAULTS';
export const RECEIVE_DEFAULTS = 'RECEIVE_DEFAULTS';

export const fetchDefaults = () => dispatch => {
  dispatch(requestDefaults());
  return fetch(`../..${defaultDeclarationUrl}`)
    .then(res => res.json())
    .then(data => {
      dispatch(receiveDefaults(data));
    })
    .catch(e => console.log(e));
};

const requestDefaults = () => {
  return {
    type: REQUEST_DEFAULTS
  };
};

const receiveDefaults = defaults => {
  return {
    type: RECEIVE_DEFAULTS,
    defaults
  };
};
