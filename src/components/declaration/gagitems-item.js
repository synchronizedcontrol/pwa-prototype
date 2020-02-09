/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { LitElement, html } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import { SharedStyles } from '../shared-styles.js';
import { FormStyles, ButtonStyles } from '../form-styles.js';
import {
  addNewPackages,
  updateGagitem,
  removeCurrentGagitem
} from '../../actions/declaration.js';
import { store } from '../../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import './packages-item.js';

class GagitemsItem extends connect(store)(LitElement) {
  static get properties() {
    return {
      Gagitems: { type: Object },
      defaults: { type: Object },
      Id: { type: Number },
      totalLength: { type: Number }
    };
  }

  constructor() {
    super();
    this.Gagitems = {};
    this.defaults = {};
    this.Id = 0;
    this.totalLength = 0;
  }

  render() {
    const { Gagitems, defaults, Id, totalLength } = this;
    if (!Gagitems) return;
    return html`
      ${SharedStyles} ${FormStyles} ${ButtonStyles}
      <div class="row">
        <h3>
          Product ${Id + 1}
          <button
            dustbin
            type="button"
            @click="${() => store.dispatch(removeCurrentGagitem(Id))}"
            ?disabled="${totalLength === 1}"
          ></button>
        </h3>
        <div class="group">
          <select
            aria-labelledby="commodityChoice"
            @change="${e =>
              store.dispatch(
                updateGagitem(e.target.value, 'Commodity', this.Id)
              )}"
            required
          >
            <option disabled .selected="${!Gagitems.Commodity}"></option>
            ${repeat(
              defaults.default.Commodities,
              item => html`
                <option
                  value="${item.ExternalId}"
                  ?selected="${Gagitems.Commodity == item.ExternalId}"
                  >${item.Name}</option
                >
              `
            )}
          </select>
          <span class="highlight"></span>
          <span class="bar"></span>
          <label aria-label="commodityChoice">Kies een product</label>
        </div>
        <div class="group">
          <input
            type="number"
            aria-labelledby="TSQuantity"
            .value="${typeof Gagitems.StatisticalValue !== 'string'
              ? ''
              : Gagitems.TSQuantity}"
            @blur="${e =>
              store.dispatch(
                updateGagitem(e.target.value, 'TSQuantity', this.Id)
              )}"
            min="0"
            required
          />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label aria-label="TSQuantity">Aantal</label>
        </div>
        <div class="group">
          <input
            type="number"
            aria-labelledby="StatisticalValue"
            .value="${typeof Gagitems.StatisticalValue !== 'string'
              ? ''
              : Gagitems.StatisticalValue}"
            @blur="${e =>
              store.dispatch(
                updateGagitem(e.target.value, 'StatisticalValue', this.Id)
              )}"
            min="0"
            required
          />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label aria-label="StatisticalValue">Waarde</label>
        </div>
        <div class="group">
          <select
            aria-labelledby="StatisticalValueCurrency"
            @change="${e =>
              store.dispatch(
                updateGagitem(
                  e.target.value,
                  'StatisticalValueCurrency',
                  this.Id
                )
              )}"
            required
          >
            <option
              disabled
              .selected="${!Gagitems.StatisticalValueCurrency}"
            ></option>
            ${repeat(
              defaults.default.Currencies,
              item => html`
                <option
                  value="${item.ExternalId}"
                  ?selected="${Gagitems.StatisticalValueCurrency ==
                    item.ExternalId}"
                  >${item.ExternalId} - ${item.Name}</option
                >
              `
            )}
          </select>
          <span class="highlight"></span>
          <span class="bar"></span>
          <label aria-label="StatisticalValueCurrency">Kies valuta</label>
        </div>
      </div>
      <div class="row">
        ${repeat(
          this.Gagitems.Packages,
          (item, index) => html`
            <packages-item
              .Packages="${item}"
              .Id="${index}"
              .GagitemId="${Id}"
              .totalLength="${this.Gagitems.Packages.length}"
            ></packages-item>
          `
        )}
        <button
          type="button"
          class="addPackage"
          @click="${() => store.dispatch(addNewPackages(this.Id))}"
          ?disabled="${this.Gagitems.Packages.length === 10}"
        >
          Verpakking toevoegen
        </button>
      </div>
    `;
  }

  stateChanged(state) {
    this.Gagitems = state.declaration.GoodsShipment.Gagitems[this.Id];
    this.defaults = state.defaults;
  }
}

window.customElements.define('gagitems-item', GagitemsItem);
