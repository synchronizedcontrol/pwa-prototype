/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
Paged slider that transcludes content.
*/
// NOTE: Slider is too sensitive, harder to select input fields. Needs fix

import { LitElement, html } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import { pageSlider } from './shared-styles.js';
import { ButtonStyles } from './form-styles.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

class PageSlider extends connect(store)(LitElement) {
  render() {
    const { numberOfPages } = this;
    const pageLength = Array.from(Array(numberOfPages), (x, i) => i + 1);
    return html`
      <style>
        :host {
          --slider-page-holder-width: calc(
            (100% * ${numberOfPages}) + (0.1px * ${numberOfPages})
          );
          --slider-wrapper-width: calc((100% / ${numberOfPages}));
        }
        .page-content {
          padding: 10px;
        }
        .buttonBar {
          border-top: 1px solid #666;
          width: 100% !important;
          height: 50px;
          margin-top: 10px;
          padding-top: 5px;
        }
      </style>
      ${pageSlider} ${ButtonStyles}
      <div class="page-wrap">
        <div class="page-slide" id="pageSlide">
          <div class="page-hold">
            ${repeat(
              pageLength,
              item => html`
                <div class="page-wrapper">
                  <div class="page-content">
                    <content>
                      <slot name="page-${item}"></slot>
                      <div class="buttonBar">
                        <button class="btnPrevious">Previous</button>
                        <button
                          class="btnNext"
                          ?hidden="${item ===
                            pageLength[pageLength.length - 1]}"
                        >
                          Next
                        </button>
                      </div>
                    </content>
                  </div>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    this._attachTouch();
  }

  static get properties() {
    return {
      numberOfPages: {
        type: Number
      }
    };
  }

  _attachTouch(idx) {
    const elem = this.shadowRoot.querySelector('#pageSlide');
    const indexedPages = this.numberOfPages;
    if (navigator.msMaxTouchPoints) {
      elem.addClass('ms-touch');

      elem.on('scroll', function() {
        $('.page-slot').css(
          'transform',
          'translate3d(-' + (100 - $(this).scrollLeft() / 6) + 'px,0,0)'
        );
      });
    } else {
      const slider = {
        el: {
          slider: elem,
          holder: elem.querySelector('.page-hold'),
          pageSlide: elem.querySelector('content'),
          buttonPrev: elem.querySelectorAll('.btnPrevious'),
          buttonNext: elem.querySelectorAll('.btnNext')
        },

        slideWidth: undefined,
        totalSlideWidth: undefined,
        touchStartX: undefined,
        touchStartY: undefined,
        touchMoveX: undefined,
        touchMoveY: undefined,
        moveX: undefined,
        index: idx || 0,
        longTouch: undefined,

        init: function() {
          this.bindUIEvents();
        },

        bindUIEvents: function() {
          this.el.holder.addEventListener(
            'touchstart',
            function(e) {
              slider.start(e);
            },
            { passive: true }
          );

          this.el.holder.addEventListener(
            'touchmove',
            function(e) {
              slider.move(e);
            },
            { passive: true }
          );

          this.el.holder.addEventListener(
            'touchend',
            function(e) {
              slider.end(e);
            },
            { passive: true }
          );
          for (let i = 0; i < this.el.buttonNext.length; i++) {
            this.el.buttonNext[i].addEventListener('click', function(e) {
              slider.click(e, 'next');
            });
          }

          for (let i = 0; i < this.el.buttonPrev.length; i++) {
            this.el.buttonPrev[i].addEventListener('click', function(e) {
              slider.click(e, 'prev');
            });
          }
        },

        start: function(e) {
          if (
            e.path[0].nodeName === 'INPUT' ||
            e.path[0].nodeName === 'SELECT'
          ) {
            return;
          }
          this.longTouch = false;
          setTimeout(function() {
            this.longTouch = true;
          }, 250);
          if (!this.slideWidth) {
            this.slideWidth = elem.getBoundingClientRect()['width'];
            this.totalSlideWidth =
              this.slideWidth * indexedPages - this.slideWidth;
          }
          this.touchStartX = e.changedTouches[0].pageX;
          this.touchStartY = e.changedTouches[0].pageY;
          if (elem.querySelector('.animate'))
            elem.querySelector('.animate').classList.remove('animate');
        },

        move: function(e) {
          if (!this.touchStartX && !this.touchMoveX) {
            return;
          }
          this.touchMoveX = e.changedTouches[0].pageX;
          this.touchMoveY = e.changedTouches[0].pageY;
          let diffMoveX = Math.abs(this.touchStartX - this.touchMoveX);
          let diffMoveY = Math.abs(this.touchStartY - this.touchMoveY);
          if (diffMoveX > diffMoveY) {
            this.moveX =
              this.index * this.slideWidth +
              (this.touchStartX - this.touchMoveX);
            let panX = 100 - this.moveX / 6;
            if (this.moveX < this.totalSlideWidth) {
              this.el.holder.style.transform =
                'translate3d(-' + this.moveX + 'px, 0,0)';
            }
            if (panX < 100) {
              this.el.pageSlide.style.transform =
                'translate3d(-' + panX + 'px, 0,0)';
            }
          }
        },

        end: function(e) {
          if (
            e.path[0].nodeName === 'INPUT' ||
            e.path[0].nodeName === 'SELECT'
          ) {
            return;
          }
          let diffMoveX = Math.abs(this.touchStartX - this.touchMoveX);
          let diffMoveY = Math.abs(this.touchStartY - this.touchMoveY);
          if (diffMoveX > diffMoveY) {
            let absMove = Math.abs(this.index * this.slideWidth - this.moveX);
            if (absMove > this.slideWidth / 2 || this.longTouch === false) {
              if (
                this.moveX > this.index * this.slideWidth &&
                this.index < indexedPages - 1
              ) {
                this.index++;
              } else if (
                this.moveX < this.index * this.slideWidth &&
                this.index > 0
              ) {
                this.index--;
              }
            }

            this.el.holder.classList.add('animate');
            this.el.holder.style.transform = `translate3d(-${this.index *
              this.slideWidth}px,0,0)`;
            this.el.pageSlide.classList.add('animate');
            this.el.pageSlide.style.transform = `translate3d(-${100 -
              this.index * 50}px,0,0)`;
          }
        },

        click: function(e, type) {
          let currentScroll =
            document.documentElement.scrollTop || document.body.scrollTop;
          if (!this.slideWidth) {
            this.slideWidth = elem.getBoundingClientRect()['width'];
            this.totalSlideWidth =
              this.slideWidth * indexedPages - this.slideWidth;
          }
          if (type === 'next' && this.index < indexedPages - 1) {
            this.index++;
          } else if (type === 'prev' && this.index > 0) {
            this.index--;
          }
          if (currentScroll > 0) {
            window.scrollTo(0, 0);
          }
          this.el.holder.classList.add('animate');
          this.el.holder.style.transform = `translate3d(-${this.index *
            this.slideWidth}px,0,0)`;
          this.el.pageSlide.classList.add('animate');
          this.el.pageSlide.style.transform = `translate3d(-${100 -
            this.index * 50}px,0,0)`;
        }
      };
      slider.init();
    }
  }
  stateChanged(state) {
    if (state.app.page !== 'declaration') {
      const elem = this.shadowRoot.querySelector('#pageSlide');
      if (elem) {
        let pageHold = elem.querySelector('.page-hold');
        pageHold.style.transform = `translate3d(${0}px,0,0)`;
        this._attachTouch(0);
      }
    }
  }
}

window.customElements.define('page-slider', PageSlider);
