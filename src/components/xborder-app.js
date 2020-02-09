/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { LitElement, html } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { FormStyles } from './form-styles.js';
import { signOff } from '../actions/auth.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  updateLayout
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

import { menuIcon } from './my-icons.js';
import './snack-bar.js';

class XborderApp extends connect(store)(LitElement) {
  render() {
    const { appTitle, _page, _drawerOpened, _snackbarOpened, _offline } = this;
    // Anything that's related to rendering should be done in here.
    return html`
      <style>
        :host {
          --app-drawer-width: 256px;
          display: block;
          font-family: 'Nunito';

          --app-primary-color: #0eaf25;
          --app-secondary-color: #293237;
          --app-tertiary-color: #1f81e5;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: #fff;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909c;
          --app-preloader-color: #e2e2e2;

          --app-addProduct-color: #308a3d;

          /* FORM */
          --app-input-background-color: #efefef;
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #ccc;
          z-index: 1000;
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
        }

        [main-title] {
          font-family: 'Nunito';
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
        drawer button, and the text looks not centered. Add a padding to
        match that button */
          padding-right: 44px;
        }

        [hidden] {
          display: none !important;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: 100vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 24px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
      changes to a wide layout. */
        @media (min-width: 461px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }

          .main-content {
            padding-top: 107px;
          }

          /* The drawer button isn't shown in the wide layout, so we don't
        need to offset the title */
          [main-title] {
            padding-right: 0px;
          }

          [main-title] p {
            display: none;
          }
        }

        @media (max-width: 460px) {
          [main-title] img {
            display: none;
          }

          [main-title] p {
            font-size: 22px;
            text-align: left;
            height: 24px;
            margin-top: 10px;
          }
        }
      </style>

      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button
            class="menu-btn"
            title="Menu"
            @click="${_ => store.dispatch(updateDrawerState(true))}"
            ?hidden="${_page === 'login' || _page === '/'}"
          >
            ${menuIcon}
          </button>
          <div main-title>
            <img src="./../images/manifest/icon-Header.png" alt="${appTitle}" />
            <p>${appTitle}</p>
          </div>
        </app-toolbar>

        <!-- This gets hidden on a small screen-->
        <nav
          class="toolbar-list"
          ?hidden="${_page === 'login' || _page === '/'}"
        >
          <a ?selected="${_page === 'dashboard'}" href="/dashboard"
            >Dashboard</a
          >
          <a ?selected="${_page === 'declaration'}" href="/declaration"
            >New declaration</a
          >
          <a @click="${() => store.dispatch(signOff())}" href="/">Uitloggen</a>
        </nav>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
        style="z-index:1000;"
        .opened="${_drawerOpened}"
        .opened-changed="${e =>
          store.dispatch(updateDrawerState(e.target.opened))}"
      >
        <nav class="drawer-list">
          <a ?selected="${_page === 'dashboard'}" href="/dashboard"
            >Dashboard</a
          >
          <a ?selected="${_page === 'declaration'}" href="/declaration"
            >New declaration</a
          >
          <a @click="${() => store.dispatch(signOff())}" href="/">Uitloggen</a>
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        <app-login class="page" ?active="${_page === 'login'}"></app-login>
        <dashboard-app
          class="page"
          ?active="${_page === 'dashboard'}"
        ></dashboard-app>
        <new-declaration
          class="page"
          ?active="${_page === 'declaration'}"
        ></new-declaration>
        <declaration-cleared
          class="page"
          ?active="${_page === 'declaration-cleared'}"
        ></declaration-cleared>
        <my-view404 class="page" ?active="${_page === 'view404'}"></my-view404>
      </main>

      <footer>
        <p>Prototype made by XBorder</p>
      </footer>

      <snack-bar ?active="${_snackbarOpened}">
        You are now ${_offline ? 'offline' : 'online'}.</snack-bar
      >
    `;
  }

  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
      _modalOpened: { type: Object }
    };
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/2.0/docs/devguide/gesture-events#use-passive-gesture-listeners
    setPassiveTouchGestures(true);
  }

  firstUpdated() {
    installRouter(location =>
      store.dispatch(navigate(window.decodeURIComponent(location.pathname)))
    );
    installOfflineWatcher(offline => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`, matches =>
      store.dispatch(updateLayout(matches))
    );
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  stateChanged(state) {
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
    this._modalOpened = state.app.uploadModalOpened;
  }
}

window.customElements.define('xborder-app', XborderApp);
