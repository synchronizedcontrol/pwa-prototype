/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';

export const FormStyles = html`
  <style>
    .group {
      position: relative;
      margin-bottom: 20px;
    }
    input[type='text'],
    input[type='number'],
    input[type='password'],
    select {
      font-size: 12px;
      background-color: var(--app-input-background-color);
      padding: 20px 0px 5px 0px;
      display: block;
      width: 100%;
      border: none;
      border-bottom: 1px solid var(--app-primary-color);
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    input[type='text'],
    input[type='number'],
    input[type='password'] {
      text-indent: 5px;
    }
    select {
      height: 40px;
    }
    input[type='text']:focus,
    input[type='number']:focus,
    input[type='password']:focus,
    select:focus {
      outline: none;
    }

    /* LABEL ======================================= */
    input[type='text'] ~ label,
    input[type='number'] ~ label,
    input[type='password'] ~ label,
    select ~ label {
      color: #999;
      font-size: 14px;
      font-weight: normal;
      position: absolute;
      pointer-events: none;
      left: 5px;
      top: 10px;
      transition: 0.2s ease all;
      -moz-transition: 0.2s ease all;
      -webkit-transition: 0.2s ease all;
    }

    /* active state */
    input[type='text']:focus ~ label,
    input[type='number']:focus ~ label,
    input[type='password']:focus ~ label,
    input[type='text']:valid ~ label,
    input[type='number']:valid ~ label,
    input[type='password']:valid ~ label,
    select:focus ~ label,
    select:valid ~ label {
      top: 3px;
      font-size: 10px;
      color: var(--app-primary-color);
    }

    /* BOTTOM BARS ================================= */
    .bar {
      position: relative;
      display: block;
      width: 100%;
    }

    .bar:before,
    .bar:after {
      content: '';
      height: 2px;
      width: 0;
      bottom: 1px;
      position: absolute;
      background: var(--app-primary-color);
      transition: 0.2s ease all;
      -moz-transition: 0.2s ease all;
      -webkit-transition: 0.2s ease all;
    }
    .bar:before {
      left: 50%;
    }
    .bar:after {
      right: 50%;
    }

    /* active state */
    input[type='text']:focus ~ .bar:before,
    input[type='number']:focus ~ .bar:before,
    input[type='password']:focus ~ .bar:before,
    input[type='text']:focus ~ .bar:after,
    input[type='number']:focus ~ .bar:after,
    input[type='password']:focus ~ .bar:after,
    select:focus ~ .bar:before,
    select:focus ~ .bar:after {
      width: 50%;
    }

    /* HIGHLIGHTER ================================== */
    .highlight {
      position: absolute;
      height: 60%;
      width: 100px;
      top: 25%;
      left: 0;
      pointer-events: none;
      opacity: 0.5;
    }

    /* active state */
    input[type='text']:focus ~ .highlight,
    input[type='number']:focus ~ .highlight,
    input[type='password']:focus ~ .highlight,
    select:focus ~ .highlight {
      -webkit-animation: inputHighlighter 0.3s ease;
      -moz-animation: inputHighlighter 0.3s ease;
      animation: inputHighlighter 0.3s ease;
    }

    /*Icons*/
    .hollowLoader {
      width: 20px;
      height: 20px;
      animation: loaderAnim 1.25s infinite ease-in-out;
      outline: 1px solid transparent;
      float: left;
    }

    .largeBox {
      height: 20px;
      width: 20px;
      background-color: var(--app-primary-color);
      outline: 1px solid transparent;
      position: fixed;
    }

    .smallBox {
      height: 20px;
      width: 20px;
      background-color: var(--app-secondary-color);
      position: fixed;
      z-index: 1;
      outline: 1px solid transparent;
      animation: smallBoxAnim 1.25s alternate infinite ease-in-out;
    }

    /*End icons*/

    /* ANIMATIONS ================ */
    @-webkit-keyframes inputHighlighter {
      from {
        background: var(--app-primary-color);
      }
      to {
        width: 0;
        background: transparent;
      }
    }
    @-moz-keyframes inputHighlighter {
      from {
        background: var(--app-primary-color);
      }
      to {
        width: 0;
        background: transparent;
      }
    }
    @keyframes inputHighlighter {
      from {
        background: var(--app-primary-color);
      }
      to {
        width: 0;
        background: transparent;
      }
    }

    @keyframes smallBoxAnim {
      0% {
        transform: scale(0.2);
      }
      100% {
        transform: scale(0.75);
      }
    }

    @keyframes loaderAnim {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(90deg);
      }
    }

    @media (min-width: 461px) {
    }

    @media (max-width: 460px) {
      h1 {
        text-align: center;
      }
      button {
        width: 100%;
      }
    }
  </style>
`;

export const ButtonStyles = html`
  <style>
    button {
      font-size: 14px;
      display: inline-block;
      height: 36px;
      min-width: 88px;
      padding: 6px 16px;
      line-height: 1.42857143;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border-width: 0;
      border-radius: 2px;
      color: white;
      outline: 0;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
      transition: filter 0.3s;
      filter: brightness(100%);
    }
    .addPackage {
      background-color: var(--app-primary-color);
    }

    .addProduct {
      background-color: var(--app-addProduct-color);
    }
    button:hover,
    button:focus {
      filter: brightness(90%);
    }

    button[disabled] {
      background-color: var(--app-input-background-color) !important;
      cursor: not-allowed;
      color: var(--app-secondary-color);
    }

    button[remove] {
      background-color: red;
      color: var(--app-secondary-color);
    }

    button[dustbin] {
      min-width: 0;
      width: 25px;
      height: 25px;
      float: right;
      padding: 0;
      margin: 0;
      border: none;
      background: none !important;
      box-shadow: none;
    }

    button[dustbin]::after {
      content: url("data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='none' d='M0 0h24v24H0V0z'/><path fill='black' d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z'/><path fill='none' d='M0 0h24v24H0z'/></svg>");
    }

    button[dustbin]:hover::after {
      content: url("data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='none' d='M0 0h24v24H0V0z'/><path fill='#999' d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z'/><path fill='none' d='M0 0h24v24H0z'/></svg>");
    }

    button[dustbin][disabled]::after {
      content: url("data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='none' d='M0 0h24v24H0V0z'/><path fill='#ccc' d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z'/><path fill='none' d='M0 0h24v24H0z'/></svg>");
    }

    button[type='submit'] {
      float: right;
      margin-top: 33px;
      background-color: var(--app-primary-color);
    }

    [hidden] {
      display: none;
    }

    button.floatLeft {
      float: left;
      margin-right: 5px;
    }

    .btnPrevious,
    .btnCancel {
      float: left;
      background-color: var(--app-section-even-color);
      color: black;
      box-shadow: none;
    }

    .btnNext {
      float: right;
      background-color: var(--app-tertiary-color);
    }

    @media (max-width: 460px) {
      button {
        width: 100%;
        margin: 0 0 10px 0;
      }

      .btnPrevious,
      .btnNext {
        display: none;
      }
    }
  </style>
`;
