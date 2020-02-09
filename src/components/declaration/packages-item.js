/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { LitElement, html } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import {
  updatePackages,
  removeCurrentPackage
} from '../../actions/declaration.js';
import { store } from '../../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../shared-styles.js';
import { FormStyles, ButtonStyles } from '../form-styles.js';

class PackagesItem extends connect(store)(LitElement) {
  render() {
    const { Packages, defaults, Id, GagitemId, totalLength } = this;
    if (!Packages) return;

    return html`
      ${SharedStyles} ${FormStyles} ${ButtonStyles}
      <h4>Verpakking ${Id + 1}</h4>
      <div class="group">
        <select
          aria-labelledby="PackageType"
          @change="${e =>
            store.dispatch(
              updatePackages(e.target.value, 'PackagesIdType', Id, GagitemId)
            )}"
          required
        >
          <option disabled selected></option>
          ${repeat(
            defaults.default.PackageTypes,
            item => html`
              <option
                value="${item.Value}"
                ?selected="${Packages.PackagesIdType == item.Value}"
                >${item.Name}</option
              >
            `
          )}
        </select>
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="PackageType">Verpakking / Soort</label>
      </div>
      <div class="group">
        <input
          type="text"
          .value="${typeof Packages.ShippingMarks !== 'string'
            ? ''
            : Packages.ShippingMarks}"
          aria-labelledby="ShippingMarks"
          @blur="${e =>
            store.dispatch(
              updatePackages(e.target.value, 'ShippingMarks', Id, GagitemId)
            )}"
          maxlength="42"
          required
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="ShippingMarks">Referentienummer</label>
      </div>
      <div class="group">
        <input
          type="number"
          .value="${typeof Packages.NumberOfPackages !== 'string'
            ? ''
            : Packages.NumberOfPackages}"
          aria-labelledby="NumberOfPackages"
          @blur="${e =>
            store.dispatch(
              updatePackages(e.target.value, 'NumberOfPackages', Id, GagitemId)
            )}"
          min="0"
          required
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="NumberOfPackages">Aantal verpakkingen</label>
      </div>
      <div class="group">
        <input
          type="number"
          .value="${typeof Packages.GrossItemWeight !== 'string'
            ? ''
            : Packages.GrossItemWeight}"
          aria-labelledby="GrossItemWeight"
          @blur="${e =>
            store.dispatch(
              updatePackages(e.target.value, 'GrossItemWeight', Id, GagitemId)
            )}"
          min="0"
          required
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="GrossItemWeight">Bruto gewicht</label>
      </div>
      <div class="group">
        <input
          type="number"
          .value="${typeof Packages.NetItemWeight !== 'string'
            ? ''
            : Packages.NetItemWeight}"
          aria-labelledby="NetItemWeight"
          @blur="${e =>
            store.dispatch(
              updatePackages(e.target.value, 'NetItemWeight', Id, GagitemId)
            )}"
          min="0"
          required
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="NetItemWeight">Netto gewicht</label>
      </div>
      <button
        remove
        class="${totalLength - 1 == Id ? 'floatLeft' : ''}"
        type="button"
        @click="${() => store.dispatch(removeCurrentPackage(GagitemId, Id))}"
        ?disabled="${totalLength === 1}"
      >
        Verpakking verwijderen
      </button>
    `;
  }

  static get properties() {
    return {
      Packages: { type: Object },
      defaults: { type: Object },
      Id: { type: Number },
      GagitemId: { type: Number },
      totalLength: { type: Number }
    };
  }

  _reset() {
    let nodeList = this.shadowRoot.querySelectorAll('input');
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].value = '';
    }
    let nodeSelect = this.shadowRoot.querySelector('select');
    nodeSelect.selectedIndex = null;
  }

  stateChanged(state) {
    if (state.declaration.GoodsShipment.Gagitems[this.GagitemId])
      this.Packages =
        state.declaration.GoodsShipment.Gagitems[this.GagitemId].Packages[
          this.Id
        ];
    this.defaults = state.defaults;
  }
}

window.customElements.define('packages-item', PackagesItem);
