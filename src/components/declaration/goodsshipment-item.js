/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { LitElement, html } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import {
  addNewGagitem,
  updateGoodsshipment
} from '../../actions/declaration.js';
import { SharedStyles } from '../shared-styles.js';
import { FormStyles, ButtonStyles } from '../form-styles.js';
import { store } from '../../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import './consignee-item.js';
import './gagitems-item.js';

class GoodsshipmentItem extends connect(store)(LitElement) {
  render() {
    const { GoodsShipment, defaults } = this;
    const locations = [1, 2];
    return html`
      ${SharedStyles} ${FormStyles} ${ButtonStyles}
      <consignee-item Consignee="${GoodsShipment.Consignee}"></consignee-item>
      <label>Goods Location:</label>
      <select
        @change="${e =>
          store.dispatch(updateGoodsshipment(e.target.value, 'GoodsLocation'))}"
      >
        ${repeat(
          locations,
          item => html`
            <option value="${item}">${item}</option>
          `
        )}
      </select>

      <h2>Gag items</h2>
      <button @click="${() => store.dispatch(addNewGagitem())}">
        Add gag item
      </button>

      ${repeat(
        GoodsShipment.Gagitems,
        (item, index) => html`
          <gagitems-item Gagitems="${item}" Id="${index}"></gagitems-item>
        `
      )}
    `;
  }

  static get properties() {
    return {
      GoodsShipment: { type: Object },
      defaults: { type: Object }
    };
  }

  stateChanged(state) {
    this.GoodsShipment = state.declaration.GoodsShipment;
    this.defaults = state.defaults;
  }
}

window.customElements.define('goodsshipment-item', GoodsshipmentItem);
