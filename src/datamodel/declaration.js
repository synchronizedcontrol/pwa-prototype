/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { goodsShipmentModel } from './goodsShipment.js';

class DeclarationModel {
  static get properties() {
    this.DeclarationCode = String;
    this.CompanyReference = String;
    this.GoodsShipment = Object;
  }

  constructor() {
    this.DeclarationCode = 'A';
    this.CompanyReference = '';
    this.GoodsShipment = new goodsShipmentModel();
  }
}

export const declarationModel = DeclarationModel;
