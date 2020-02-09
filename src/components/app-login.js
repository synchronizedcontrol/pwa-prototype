/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';
import { FormStyles, ButtonStyles } from './form-styles.js';
import { signIn, updateAuth } from '../actions/auth.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

const un = 'UserName';
const pw = 'Password';

class AppLogin extends connect(store)(PageViewElement) {
  render() {
    const { _user } = this;
    return html`
      ${SharedStyles} ${FormStyles} ${ButtonStyles}
      <section>
        <h1>Please login to your portal:</h1>
      </section>
      <section>
        <div id="login">
          <div class="group">
            <input
              type="text"
              aria-labelledby="login username"
              autofocus
              @change="${e => store.dispatch(updateAuth(e.target.value, un))}"
              autocomplete="Username"
              required
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label aria-label="username">Username</label>
          </div>
          <div class="group">
            <input
              type="password"
              aria-labelledby="login password"
              @change="${e => store.dispatch(updateAuth(e.target.value, pw))}"
              autocomplete="Password"
              required
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label aria-label="password">Password</label>
          </div>
          <button
            aria-labelledby="login"
            aria-label="submit"
            type="submit"
            @click="${() => store.dispatch(signIn(_user), this._resetFields())}"
          >
            Login
          </button>
        </div>
      </section>
    `;
  }

  static get properties() {
    return {
      _user: { type: Object }
    };
  }

  _resetFields() {
    let nodeList = this.shadowRoot.querySelectorAll('input');
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].value = '';
    }
  }

  stateChanged(state) {
    this._user = state.auth;
  }
}

window.customElements.define('app-login', AppLogin);
