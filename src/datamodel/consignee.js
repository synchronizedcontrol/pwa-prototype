/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { addressModel } from './address.js';

class ConsigneeModel {
  static get properties() {
    this.Name = String;
    this.Address = Object;
  }

  constructor() {
    this.Name = '';
    this.Address = new addressModel();
  }
}

export const consigneeModel = ConsigneeModel;
