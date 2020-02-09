/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { packagesModel } from './packages.js';

class GagitemsModel {
  static get properties() {
    this.Commodity = String;
    this.TSQuantity = Number;
    this.CustomsRegulation = String;
    this.PreviousRegulation = String;
    this.StatisticalValue = Number;
    this.StatisticalValueCurrency = String;
    this.Packages = Array;
  }

  constructor(data) {
    this.Commodity = '';
    this.TSQuantity = 0;
    this.CustomsRegulation = '10';
    this.PreviousRegulation = '00';
    this.StatisticalValue = 0;
    this.StatisticalValueCurrency = '';
    this.Packages = [new packagesModel()];
  }
}

export const gagitemsModel = GagitemsModel;
