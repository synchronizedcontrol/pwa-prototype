/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { LitElement, html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { store } from '../store.js';
import { openModal } from '../actions/app.js';
import './file-upload.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import { FormStyles, ButtonStyles } from './form-styles.js';

class DeclarationCleared extends LitElement {
  render() {
    return html`
      ${SharedStyles} ${ButtonStyles}
      <section>
        <h1>Gelukt!</h1>
        <p>
          Uw declaratie is verzonden! Ga terug naar uw
          <a href="/dashboard">dashboard</a>
        </p>
        <p>
          <button
            class="addProduct"
            @click="${() => store.dispatch(openModal())}"
          >
            Upload File
          </button>
        </p>
        <file-upload-modal></file-upload-modal>
      </section>
    `;
  }
}

window.customElements.define('declaration-cleared', DeclarationCleared);
