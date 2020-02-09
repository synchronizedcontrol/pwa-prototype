/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { FormStyles, ButtonStyles } from './form-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import {
  updateField,
  updateGoodsshipment,
  declare,
  resettingDeclaration,
  addNewGagitem
} from '../actions/declaration.js';
import { fetchDefaults } from '../actions/defaults.js';
import './declaration/goodsshipment-item.js';
import './page-slider.js';
import './declaration/consignee-item.js';
import './declaration/gagitems-item.js';

import declaration from '../reducers/declaration.js';
import defaults from '../reducers/defaults.js';

store.addReducers({
  declaration,
  defaults
});

class NewDeclaration extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      declaration: { type: Object },
      defaults: { type: Object }
    };
  }

  render() {
    if (!this.defaults.default) {
      return;
    }
    return html`
      ${SharedStyles} ${FormStyles} ${ButtonStyles}
      <section>
        <h1>Nieuwe export aangifte</h1>
      </section>
      <section>
        <form
          @submit="${e => store.dispatch(declare(e, this.declaration))} }"
          id="declarationForm"
        >
          <page-slider numberOfPages="3">
            <div slot="page-1">
              <h2>Wie is de ontvanger?</h2>
              <div class="row">
                <consignee-item
                  .Consignee="${this.declaration.GoodsShipment.Consignee}"
                ></consignee-item>
              </div>
            </div>
            <div slot="page-2">
              <h2>Wat ga je exporteren?</h2>
              ${repeat(
                this.declaration.GoodsShipment.Gagitems,
                (item, index) => html`
                  <gagitems-item
                    .Gagitems="${item}"
                    Id="${index}"
                    totalLength="${this.declaration.GoodsShipment.Gagitems
                      .length}"
                  ></gagitems-item>
                `
              )}
              <button
                type="button"
                class="addProduct"
                @click="${() => store.dispatch(addNewGagitem())}"
                ?disabled="${this.declaration.GoodsShipment.Gagitems.length ===
                  10}"
              >
                Product toevoegen
              </button>
            </div>
            <div slot="page-3">
              <h2>Bevestig aangifte</h2>
              <div class="row">
                <div class="group">
                  <select
                    aria-labelledby="goodsLocationChoice"
                    @change="${e =>
                      store.dispatch(
                        updateGoodsshipment(e.target.value, 'GoodsLocation')
                      )}"
                    required
                  >
                    <option
                      disabled
                      .selected="${!this.declaration.GoodsShipment.Consignment
                        .GoodsLocation}"
                    ></option>
                    ${repeat(
                      this.defaults.default.GoodsLocations,
                      item => html`
                        <option value="${item.ExternalId}">${item.Name}</option>
                      `
                    )}
                  </select>
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label aria-label="goodsLocationChoice"
                    >Kies een product locatie</label
                  >
                </div>
                <div class="group">
                  <input
                    type="text"
                    aria-labelledby="declarationForm CompanyReference"
                    @blur="${e =>
                      store.dispatch(
                        updateField(e.target.value, 'CompanyReference')
                      )}"
                    maxlength="35"
                    required
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label aria-label="CompanyReference"
                    >Declaratie referentie</label
                  >
                </div>
                <button type="submit">Bevestig en verstuur!</button>
              </div>
            </div>
          </page-slider>
        </form>
      </section>
    `;
  }

  stateChanged(state) {
    this.declaration = state.declaration;
    this.defaults = state.defaults;
  }
}

window.customElements.define('new-declaration', NewDeclaration);

export { fetchDefaults, resettingDeclaration };
