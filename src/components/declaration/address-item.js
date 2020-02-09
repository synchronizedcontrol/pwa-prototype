/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { LitElement, html } from 'lit-element';
import { updateAddress } from '../../actions/declaration.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { store } from '../../store.js';
import { FormStyles } from '../form-styles.js';

class AddressItem extends LitElement {
  static get properties() {
    return {
      Address: { type: Object }
    };
  }

  render() {
    return html`
      ${FormStyles}
      <div class="group">
        <input
          type="text"
          aria-labelledby="AddressStreetAndNumber"
          @blur="${e =>
            store.dispatch(updateAddress(e.target.value, 'StreetAndNumber'))}"
          .value="${this.Address.StreetAndNumber}"
          maxlength="70"
          required
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="AddressStreetAndNumber">Adres</label>
      </div>
      <div class="group">
        <input
          type="text"
          aria-labelledby="AddressPostcode"
          @blur="${e =>
            store.dispatch(updateAddress(e.target.value, 'Postcode'))}"
          .value="${this.Address.Postcode}"
          maxlength="9"
          required
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="AddressPostcode">Postcode</label>
      </div>
      <div class="group">
        <input
          type="text"
          aria-labelledby="AddressCity"
          @blur="${e => store.dispatch(updateAddress(e.target.value, 'City'))}"
          .value="${this.Address.City}"
          maxlength="35"
          required
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="AddressCity">Plaats</label>
      </div>
      <div class="group">
        <select
          aria-labelledby="AddressCountry"
          @change="${e =>
            store.dispatch(updateAddress(e.target.value, 'Country'))}"
          required
        >
          <option disabled .selected="${!this.Address.Country}"></option>
          ${repeat(
            store.getState()['defaults']['default']['DestinationCountries'],
            item => html`
              <option value="${item.ShortCode}">${item.Name}</option>
            `
          )}
        </select>
        <span class="highlight"></span>
        <span class="bar"></span>
        <label aria-label="AddressCountry">Kies een land</label>
      </div>
    `;
  }
}

window.customElements.define('address-item', AddressItem);
