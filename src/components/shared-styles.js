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

export const SharedStyles = html`
  <style>
    :host {
      display: block;
      box-sizing: border-box;

      /**
     * The width for the expandible item is:
     * ((100% - subPixelAdjustment) / columns * itemColumns - gutter
     *
     * - subPixelAdjustment: 0.1px (Required for IE 11)
     * - gutter: var(--app-grid-gutter)
     * - columns: var(--app-grid-columns)
     * - itemColumn: var(--app-grid-expandible-item-columns)
     */
      --app-grid-expandible-item: {
        -webkit-flex-basis: calc(
          (100% - 0.1px) / var(--app-grid-columns, 1) *
            var(--app-grid-expandible-item-columns, 1) -
            var(--app-grid-gutter, 0px)
        ) !important;
        flex-basis: calc(
          (100% - 0.1px) / var(--app-grid-columns, 1) *
            var(--app-grid-expandible-item-columns, 1) -
            var(--app-grid-gutter, 0px)
        ) !important;
        max-width: calc(
          (100% - 0.1px) / var(--app-grid-columns, 1) *
            var(--app-grid-expandible-item-columns, 1) -
            var(--app-grid-gutter, 0px)
        ) !important;
      }
    }

    section {
      padding: 24px;
      background: var(--app-section-odd-color);
    }

    section > * {
      max-width: 600px;
      margin-right: auto;
      margin-left: auto;
    }

    section:nth-of-type(even) {
      background: var(--app-section-even-color);
    }

    h1 {
      text-align: center;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--app-primary-color);
      font-size: 30px;
    }

    h2 {
      font-size: 30px;
      text-align: center;
      color: var(--app-dark-text-color);
      margin-top: 0;
    }

    h3 {
      font-size: 20px;
      font-weight: bold;
      color: var(--app-dark-text-color);
      border-bottom: 1px solid var(--app-primary-color);
      margin-top: 0;
    }

    h4 {
      font-size: 16px;
      font-weight: bold;
      color: var(--app-dark-text-color);
      border-bottom: 1px solid var(--app-primary-color);
      margin-top: 20px;
    }

    .row {
      padding: 15px 0;
    }

    @media (max-width: 460px) {
      h1 {
        font-size: 24px;
      }

      h2 {
        font-size: 24px;
      }

      h3 {
        font-size: 16px;
      }

      h4 {
        font-size: 14px;
      }
    }

    .circle {
      display: block;
      width: 64px;
      height: 64px;
      margin: 0 auto;
      text-align: center;
      border-radius: 50%;
      background: var(--app-primary-color);
      color: var(--app-light-text-color);
      font-size: 30px;
      line-height: 64px;
    }

    .app-grid {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;

      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;

      -ms-flex-wrap: wrap;
      -webkit-flex-wrap: wrap;
      flex-wrap: wrap;

      padding-top: var(--app-grid-gutter, 0px);
      padding-left: var(--app-grid-gutter, 0px);
      box-sizing: border-box;
    }

    .app-grid > * {
      /* Required for IE 10 */
      -ms-flex: 1 1 100%;
      -webkit-flex: 1;
      flex: 1;

      /* The width for an item is: (100% - subPixelAdjustment - gutter * columns) / columns */
      -webkit-flex-basis: calc(
        (
            100% - 0.1px -
              (var(--app-grid-gutter, 0px) * var(--app-grid-columns, 1))
          ) / var(--app-grid-columns, 1)
      );
      flex-basis: calc(
        (
            100% - 0.1px -
              (var(--app-grid-gutter, 0px) * var(--app-grid-columns, 1))
          ) / var(--app-grid-columns, 1)
      );

      max-width: calc(
        (
            100% - 0.1px -
              (var(--app-grid-gutter, 0px) * var(--app-grid-columns, 1))
          ) / var(--app-grid-columns, 1)
      );
      margin-bottom: var(--app-grid-gutter, 0px);
      margin-right: var(--app-grid-gutter, 0px);
      height: var(--app-grid-item-height);
      box-sizing: border-box;
    }

    .app-grid[has-aspect-ratio] > * {
      position: relative;
    }

    .app-grid[has-aspect-ratio] > *::before {
      display: block;
      content: '';
      padding-top: var(--app-grid-item-height, 100%);
    }

    .app-grid[has-aspect-ratio] > * > * {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  </style>
`;

export const pageSlider = html`
  <style>
    .animate {
      transition: transform 0.3s ease-out;
    }

    .page-wrap {
      width: 100%;
    }

    .page-slide {
      width: 100%;
      overflow: hidden;
    }

    .ms-touch.slider {
      overflow-x: scroll;
      overflow-y: hidden;

      -ms-overflow-style: none;
      /* Hides the scrollbar. */

      -ms-scroll-chaining: none;
      /* Prevents Metro from swiping to the next tab or app. */

      -ms-scroll-snap-type: mandatory;
      /* Forces a snap scroll behavior on your images. */

      -ms-scroll-snap-points-x: snapInterval(0%, 100%);
      /* Defines the y and x intervals to snap to when scrolling. */
    }

    .page-hold {
      width: var(--slider-page-holder-width);
      overflow-y: hidden;
    }

    .page-wrapper {
      width: var(--slider-wrapper-width);
      height: 100%;
      float: left;
      position: relative;
      overflow: hidden;
    }

    .page-content {
      height: 100%;
      position: relative;
    }

    .page-content div {
      width: 300px;
    }
  </style>
`;
