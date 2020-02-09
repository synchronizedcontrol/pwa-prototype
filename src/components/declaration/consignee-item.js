/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { LitElement, html } from 'lit-element';
import { updateConsignee } from '../../actions/declaration.js';
import { store } from '../../store.js';
import { FormStyles } from '../form-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import './address-item.js';

class ConsigneeItem extends connect(store)(LitElement) {
  static get properties() {
    return {
      _Name: { type: String, reflect: true },
      _Address: { type: Object, reflect: true }
    };
  }

  constructor() {
    super();
    this._Name = '';
    this._Address = {};
  }

  render() {
    if (!this.Consignee) return;

    return html`
      ${FormStyles}
      <div class="group">
        <input
          type="text"
          aria-labelledby="ConsigneeName"
          @blur="${e =>
            store.dispatch(updateConsignee(e.target.value, 'Name'))}"
          .value="${this._Name}"
          maxlength="64"
          required
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="ConsigneeName">Naam</label>
      </div>
      <address-item .Address="${this._Address}"></address-item>
    `;
  }

  _setInputValues(text, label) {
    this.Consignee[label] = text;
  }

  stateChanged(state) {
    this._Name = state.declaration.GoodsShipment.Consignee.Name;
    this._Address = state.declaration.GoodsShipment.Consignee.Address;
  }
}

window.customElements.define('consignee-item', ConsigneeItem);
