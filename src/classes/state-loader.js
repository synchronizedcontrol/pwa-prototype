/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/
// NOTE: Class for saving state in localstorage, making sure it will always be available.
class StateLoader {
  loadState (stateName, state) {
    try {
      let serializedState = localStorage.getItem(stateName);
      if (serializedState === null)       {
        return this.initialzeState(state);
      }

      return JSON.parse(serializedState);
    } catch (e) {
      console.log(e);
      return this.initialzeState();
    }
  }

  saveState (stateName, state) {
    try {
        let serializedState = JSON.stringify(state);
        localStorage.setItem(stateName, serializedState);
    } catch (e) {
      console.log(e);
    }
  }

  removeState (stateName) {
    try {
        localStorage.removeItem(stateName);
    } catch (e) {
      console.log(e);
    }
  }

  initialzeState (state) {
    return state;
  }
}

export const stateLoader = StateLoader;
