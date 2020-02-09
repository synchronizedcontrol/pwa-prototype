/**
@license
Copyright (c) 2019 XBorder BV. All rights reserved.
Polymer file upload webcomponent
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { IronOverlayBehaviorImpl } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { translatorUrl, fileUploadUrl } from '../components/appConfig.js';
import { upload } from './my-icons.js';

import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { closeModal } from '../actions/app.js';

// Convert Lit `TemplateResult` to `HTMLTemplateElement` so it can be interpolated
// by Polymer's html template literal tag
import { FormStyles, ButtonStyles } from './form-styles.js';
const formStyleTemplate = document.createElement('template');
formStyleTemplate.innerHTML = FormStyles.strings[0];
const buttonStyleTemplate = document.createElement('template');
buttonStyleTemplate.innerHTML = ButtonStyles.strings[0];
const uploadIcon = document.createElement('template');
uploadIcon.innerHTML = upload.strings[0];

class FileUploadModal extends connect(store)(
  mixinBehaviors([IronOverlayBehaviorImpl], PolymerElement)
) {
  static get template() {
    return html`
      ${formStyleTemplate} ${buttonStyleTemplate}
      <style>
        :host {
          display: block;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          width: 320px;
          padding: 12px;
          visibility: hidden;
          will-change: transform;
          top: 56px;
          right: 16px;
          -webkit-transform: translate3d(calc(100% + 16px), 0, 0);
          transform: translate3d(calc(100% + 16px), 0, 0);
          transition-property: visibility, -webkit-transform;
          transition-property: visibility, transform;
          transition-duration: 0.2s;
          transition-delay: 0.1s;
        }

        :host(.opened) {
          visibility: visible;
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }

        .inputfile {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        .inputfile + label {
          font-weight: 700;
          cursor: pointer;
          display: flex;
          background-color: var(--app-input-background-color);
          padding: 10px 73px;
        }

        .inputfile + label > span.text {
          display: block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .inputfile:focus + label,
        .inputfile + label:hover {
          background-color: var(--app-primary-color);
          color: white;
        }

        .icon {
          margin-right: 10px;
          width: 20px;
          height: 20px;
        }

        .inputfile + label:hover svg {
          fill: white;
        }

        .layout-group {
          display: flex;
        }

        .horizontal {
          flex-direction: row;
        }

        .vertical {
          flex-direction: column;
        }

        .modal-button {
          flex: 1;
          margin: 8px 0px;
        }

        #closeBtn {
          position: absolute;
          right: 5px;
          top: 5px;
        }

        #uploadFile[hidden] {
          display: none;
        }

        @media (max-width: 767px) {
          :host {
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: auto;
            -webkit-transform: translate3d(0, 100%, 0);
            transform: translate3d(0, 100%, 0);
          }
        }
      </style>
      <div class="layout-group">
        <h4>Voeg document toe</h4>
      </div>
      <div class="layout-group vertical">
        <div class="group">
          <input
            type="file"
            id="document"
            name="document"
            on-blur="_uploadFile"
            class="inputfile"
            accept=".png, .pdf, .jpg, .jpeg, image/jpg, image/jpeg, application/pdf, image/png"
            required
          />
          <label for="document">
            <span class="icon">
              ${uploadIcon}
            </span>
            <span class="text">[[ _docTitle ]]</span></label
          >
        </div>
        <div class="group">
          <input
            type="text"
            id="documentName"
            aria-labelledby="documentName"
            value="{{_documentInfo.ReferenceNumber::input}}"
            maxlength="35"
            required
          />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label aria-label="documentName">Document naam</label>
        </div>
        <div class="group">
          <input
            type="text"
            id="documentType"
            aria-labelledby="documentType"
            value="{{_documentInfo.Type::input}}"
            maxlength="35"
            required
          />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label aria-label="documentType">Document type</label>
        </div>
      </div>
      <div class="layout-group horizontal">
        <shop-button class="modal-button">
          <button class="btnCancel" on-click="_cancel" id="cancel">
            Cancel
          </button>
        </shop-button>
        <shop-button class="modal-button">
          <button
            class="addProduct"
            style="float:right;"
            on-click="_postFile"
            id="uploadFile"
            hidden$="[[!hasDoi]]"
          >
            Upload file
          </button>
        </shop-button>
      </div>

      <paper-icon-button
        icon="close"
        id="closeBtn"
        aria-label="Close dialog"
        on-click="close"
      >
      </paper-icon-button>
    `;
  }

  static get properties() {
    return {
      withBackdrop: {
        type: Boolean,
        value: true
      },
      hasDoi: {
        type: Boolean,
        value: false
      },
      _docTitle: {
        type: String
      },
      _documentInfo: {
        type: Object,
        value: {
          ReferenceNumber: String,
          Type: String
        }
      },
      _doi: {
        type: Number
      },
      _timer: {
        type: String
      },
      _file: {
        type: Object
      }
    };
  }

  constructor() {
    super();
    this._doi = -1;
    this._docTitle = 'Upload document';
    this._documentInfo = {
      ReferenceNumber: '',
      Type: ''
    };
  }

  stateChanged(state) {
    this.opened = state.app.uploadModalOpened;
    if (state.app.uploadModalOpened) this._getTranslationInformation();
    if (!state.app.uploadModalOpened && window.interval)
      clearInterval(window.interval);
    if (state.app.page !== 'declaration-cleared')
      clearInterval(window.interval);
  }

  ready() {
    super.ready();
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.addEventListener('transitionend', e => this._transitionEnd(e));
    this.addEventListener('iron-overlay-canceled', e => this._onCancel(e));
    this.addEventListener('opened-changed', () => {
      // NOTE: Don't dispatch if modal.opened became false due to time
      // travelling (i.e. state.modal is already false).
      // This check is generally needed whenever you have both UI updating
      // state and state updating the same UI.
      if (!this.opened && store.getState().app.uploadModalOpened) {
        store.dispatch(closeModal());
      }
    });
  }

  _renderOpened() {
    this.restoreFocusOnClose = true;
    this.backdropElement.style.display = 'none';
    this.classList.add('opened');
  }

  _renderClosed() {
    this.classList.remove('opened');
  }

  _onCancel(e) {
    // Don't restore focus when the overlay is closed after a mouse event
    if (e.detail instanceof MouseEvent) {
      this.restoreFocusOnClose = false;
    }
  }

  _transitionEnd(e) {
    if (e.target !== this || e.propertyName !== 'transform') {
      return;
    }
    if (this.opened) {
      this._finishRenderOpened();
    } else {
      this._finishRenderClosed();
      this.backdropElement.style.display = '';
    }
  }

  async _uploadFile(e) {
    const input = e.target;
    if (input.files.length == 0) return;
    try {
      const buffer = await new Response(input.files[0]).arrayBuffer();
      const array = new Uint8Array(buffer);
      const encoded = this._encodeBase64(array);
      this._docTitle = input.files[0].name;
      this._file = {
        ContentBase64: encoded,
        FileFormat: this._setFormat(input.files[0].type)
      };
    } catch (error) {
      console.log(error);
    }
  }

  _fileTypes() {
    return [
      { Id: 1, Type: 'PNG', Format: 1 },
      { Id: 2, Type: 'JPEG', Format: 2 },
      { Id: 3, Type: 'PDF', Format: 3 },
      { Id: 4, Type: 'JPG', Format: 2 }
    ];
  }
  _setFormat(type) {
    if (!type) return;
    let formatType = type.split('/')[1].toUpperCase();
    let types = this._fileTypes();
    return types.find(item => item.Type === formatType)['Format'];
  }

  _encodeBase64(bytes) {
    return btoa(this._uint8ToString(bytes));
  }

  _uint8ToString(buf) {
    var i,
      length,
      out = '';
    for (i = 0, length = buf.length; i < length; i += 1) {
      out += String.fromCharCode(buf[i]);
    }
    return out;
  }

  _getTranslationInformation() {
    this._timer = new Date().getTime();
    const parsedUrl = new URL(window.location.href);
    this._getInformations(this, parsedUrl.searchParams.get('id'));
    window.interval = setInterval(
      this._getInformations.bind(null, this, parsedUrl.searchParams.get('id')),
      5000
    );
  }

  _getInformations(scope, id) {
    const time = new Date().getTime() - scope._timer;
    if (time > 60000) {
      clearInterval(window.interval);
      scope.close();
      window.alert(
        'Het duurde te lang om de benodigde informatie te krijgen' +
          ' om uw document op te slaan. Probeer het later nog eens.'
      );
      return;
    }

    fetch(translatorUrl + `id/${id}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `jwt ${store.getState()['auth']['token']}`,
        'X-identifiable': 1
      }
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error(res);
      })
      .then(data => {
        if (data.DOI !== -1 && data.DOI !== '-1') {
          clearInterval(window.interval);
          scope._doi = data.DOI;
          scope.hasDoi = true;
        }
      });
  }

  _postFile(e) {
    this._file = {
      ...this._file,
      ReferenceNumber: this._documentInfo.ReferenceNumber,
      Type: this._documentInfo.Type,
      DeclarationDoi: this._doi,
      DeclarationType: 8,
      UploadOptions: 3
    };
    fetch(fileUploadUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `jwt ${store.getState()['auth']['token']}`,
        'X-identifiable': 1
      },
      body: JSON.stringify(this._file)
    }).then(res => {
      this.close();
      alert('File upload was succesful!');
      const inputType = this.shadowRoot.querySelector('#documentType');
      const inputName = this.shadowRoot.querySelector('#documentName');
      const inputFile = this.shadowRoot.querySelector('#document');
      inputType.value = '';
      inputName.value = '';
      inputFile.value = '';
      this._docTitle = 'Upload document';
    });
  }
  _cancel() {
    this.close();
    const inputType = this.shadowRoot.querySelector('#documentType');
    const inputName = this.shadowRoot.querySelector('#documentName');
    const inputFile = this.shadowRoot.querySelector('#document');
    inputType.value = '';
    inputName.value = '';
    inputFile.value = '';
    this._docTitle = 'Upload document';
  }
  get _focusableNodes() {
    return [this.$.viewCartAnchor, this.$.closeBtn];
  }

  refit() {}

  notifyResize() {}
}

customElements.define('file-upload-modal', FileUploadModal);
