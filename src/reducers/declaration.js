/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import {
  GET_DECLARATION,
  ADD_GAGITEM,
  ADD_PACKAGES,
  UPDATE_FIELD,
  UPDATE_GOODSSHIPMENT,
  UPDATE_CONSIGNEE,
  UPDATE_ADDRESS,
  UPDATE_GAGITEM,
  UPDATE_PACKAGES,
  SUBMIT_DECLARATION,
  REMOVE_GAGITEM,
  REMOVE_PACKAGES,
  RESET_DECLARATION
} from '../actions/declaration.js';
import { declarationModel } from '../datamodel/declaration.js';

const declaration = (state = new declarationModel(), action) => {
  switch (action.type) {
    case GET_DECLARATION:
      return {
        ...state,
        ...action.declaration
      };
    case ADD_GAGITEM:
      return {
        ...state,
        GoodsShipment: gagitems(state.GoodsShipment, action)
      };
    case REMOVE_GAGITEM:
      return {
        ...state,
        GoodsShipment: gagitems(state.GoodsShipment, action)
      };
    case ADD_PACKAGES:
      return {
        ...state,
        GoodsShipment: {
          ...state.GoodsShipment,
          Gagitems: packages(state.GoodsShipment.Gagitems, action)
        }
      };
    case REMOVE_PACKAGES:
      return {
        ...state,
        GoodsShipment: {
          ...state.GoodsShipment,
          Gagitems: packages(state.GoodsShipment.Gagitems, action)
        }
      };
    case UPDATE_FIELD:
      return {
        ...state,
        [action.label]: action.value
      };
    case UPDATE_GOODSSHIPMENT:
      return {
        ...state,
        GoodsShipment: {
          ...state.GoodsShipment,
          Consignment: {
            ...state.GoodsShipment.Consignment,
            [action.label]: action.value
          }
        }
      };
    case UPDATE_CONSIGNEE:
      return {
        ...state,
        GoodsShipment: {
          ...state.GoodsShipment,
          Consignee: {
            ...state.GoodsShipment.Consignee,
            [action.label]: action.value
          }
        }
      };
    case UPDATE_ADDRESS:
      return {
        ...state,
        GoodsShipment: {
          ...state.GoodsShipment,
          Consignee: {
            ...state.GoodsShipment.Consignee,
            Address: {
              ...state.GoodsShipment.Consignee.Address,
              [action.label]: action.value
            }
          }
        }
      };
    case UPDATE_GAGITEM:
      return {
        ...state,
        GoodsShipment: {
          ...state.GoodsShipment,
          Gagitems: gagitems(state.GoodsShipment.Gagitems, action)
        }
      };
    case UPDATE_PACKAGES:
      return {
        ...state,
        GoodsShipment: {
          ...state.GoodsShipment,
          Gagitems: packages(state.GoodsShipment.Gagitems, action)
        }
      };
    case SUBMIT_DECLARATION:
      return {
        ...state,
        submitted: true,
        GoodsShipment: {
          ...state.GoodsShipment,
          TotalColli: action.TotalColli,
          DeliveryDestinationCountry: action.deliveryDestinationCountry
        }
      };
    case RESET_DECLARATION:
      return (state = new declarationModel());
    default:
      return state;
  }
};

const gagitems = (state, action) => {
  switch (action.type) {
    case ADD_GAGITEM:
      let newState = [...state.Gagitems];
      newState.push(action.item);

      return {
        ...state,
        Gagitems: newState
      };
    case REMOVE_GAGITEM:
      let removeFromState = [
        ...state.Gagitems.slice(0, action.id),
        ...state.Gagitems.slice(action.id + 1)
      ];
      return {
        ...state,
        Gagitems: removeFromState
      };
    case UPDATE_GAGITEM:
      return [
        ...state.slice(0, action.id),
        { ...state[action.id], [action.label]: action.value },
        ...state.slice(action.id + 1)
      ];
    default:
      return state;
  }
};

const packages = (state, action) => {
  switch (action.type) {
    case ADD_PACKAGES:
      let newState = [...state[action.id].Packages];
      newState.push(action.item);
      return [
        ...state.slice(0, action.id),
        { ...state[action.id], Packages: newState },
        ...state.slice(action.id + 1)
      ];
    case REMOVE_PACKAGES:
      let removeFromStatePackages = [
        ...state[action.gId].Packages.slice(0, action.id),
        ...state[action.gId].Packages.slice(action.id + 1)
      ];
      return [
        ...state.slice(0, action.gId),
        { ...state[action.gId], Packages: removeFromStatePackages },
        ...state.slice(action.gId + 1)
      ];
    case UPDATE_PACKAGES:
      return [
        ...state.slice(0, action.GagitemID),
        {
          ...state[action.GagitemID],
          Packages: [
            ...state[action.GagitemID].Packages.slice(0, action.packageID),
            {
              ...state[action.GagitemID].Packages[action.packageID],
              [action.label]: action.value
            },
            ...state[action.GagitemID].Packages.slice(action.packageID + 1)
          ]
        },
        ...state.slice(action.GagitemID + 1)
      ];
    default:
      return state;
  }
};

export default declaration;
