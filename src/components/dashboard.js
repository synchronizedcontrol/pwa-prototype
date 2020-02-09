/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { SharedStyles } from './shared-styles.js';
import { thumbUp, timer } from './my-icons.js';
import { getDashboard } from '../actions/dashboard.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import dashboard from '../reducers/dashboard.js';

store.addReducers({
  dashboard
});

//needed customElements
import '@polymer/app-layout/app-grid/app-grid-style.js';

class DashboardApp extends connect(store)(PageViewElement) {
  constructor() {
    super();
  }

  render() {
    const { declarations } = this;
    if (!declarations) {
      return;
    }
    return html`
      ${SharedStyles}
      <style>
        :host {
          --app-grid-columns: 1;
          /* 50% the width of the item is equivalent to 2:1 aspect ratio*/
          --app-grid-item-height: 20%;
        }

        ul {
          padding: 0;
          list-style: none;
        }

        .item {
          background-color: var(--app-input-background-color);
        }

        ul.dashboard > li {
          margin: 0 0 5px 0;
          color: var(--app-primary-color);
        }

        ul.dashboard > li > div > .icon {
          display: inherit;
          float: left;
          width: 30px;
          fill: var(--app-primary-color);
        }

        ul.dashboard > li > div > .icon[hidden] {
          display: none;
        }

        ul.dashboard > li > div > span.header {
          max-width: 50%;
          height: 24px;
          color: var(--app-primary-color);
          display: inherit;
          font-weight: bold;
          font-size: 14px;
          margin-left: 35%;
          padding-top: 1%;
        }

        ul.dashboard > li > div > span.refHeader {
          float: left;
          height: 24px;
          display: inherit;
          font-weight: bold;
          font-size: 14px;
          max-width: 23%;
          padding-top: 1%;
        }

        ul.dashboard > li > div > span.statusLabel {
          float: left;
          height: 24px;
          display: inherit;
          font-weight: bold;
          font-size: 12px;
          max-width: 23%;
          padding-top: 1%;
          color: var(--app-tertiary-color);
        }

        ul.dashboard > li > div > span.status {
          max-width: 50%;
          height: 24px;
          color: var(--app-tertiary-color);
          display: inherit;
          font-size: 12px;
          margin-left: 25%;
          padding-top: 1%;
        }

        ul.dashboard > li > div {
          padding: 7px;
        }

        ul.dashboard > li > div[status] {
          background-color: var(--app-section-odd-color);
        }

        ul[preload] > li {
          background-color: var(--app-input-background-color);
        }

        ul[preload] > li > div[header] {
          background-color: var(--app-preloader-color);
          border-radius: 2px;
          color: var(--app-preloader-color);
        }

        ul[preload] > li > div[status] {
          border-radius: 2px;
          color: var(--app-section-odd-color);
        }

        ul[preload] > li > div[status] > .statusLabel,
        ul[preload] > li > div[status] > .status {
          color: var(--app-section-odd-color);
        }

        ul[preload] > li > div > .icon {
          fill: var(--app-preloader-color);
        }

        @media (min-width: 461px) {
          ul.dashboard > li > div > span.header {
            margin-left: 25%;
          }
        }
      </style>
      <section>
        <h1>Uw recente informatie</h1>
      </section>
      <section>
        <ul class="app-grid dashboard" preload>
          ${repeat(
            declarations,
            item => html`
              <li class="item">
                <div header>
                  <div
                    class="icon"
                    ?hidden="${item.StatusName === 'Cleared for Departure'}"
                  >
                    ${timer}
                  </div>
                  <div
                    class="icon"
                    ?hidden="${item.StatusName !== 'Cleared for Departure'}"
                  >
                    ${thumbUp}
                  </div>
                  <span class="refHeader">Referentie: </span>
                  <span class="header">${item.CompanyReference}</span>
                </div>
                <div status>
                  <span class="statusLabel">Status: </span>
                  <span class="status">${item.StatusName}</span>
                  <span class="statusLabel">Last update: </span>
                  <span class="status"
                    >${new Date(item.CreatedDate).toLocaleDateString()}</span
                  >
                </div>
              </li>
            `
          )}
        </ul>
      </section>
    `;
  }

  static get properties() {
    return {
      declarations: { type: Array }
    };
  }

  stateChanged(state) {
    if (state.dashboard) {
      this.declarations = state.dashboard.declarations;
      if (this.shadowRoot.querySelector('ul[preload]')) {
        this.shadowRoot.querySelector('ul[preload]').removeAttribute('preload');
      }
    }
  }
}

window.customElements.define('dashboard-app', DashboardApp);

export { getDashboard };
