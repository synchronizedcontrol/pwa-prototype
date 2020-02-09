/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { consigneeModel } from './consignee.js';
import { consignmentModel } from './consignment.js';
import { gagitemsModel } from './gagitems.js';

class GoodsShipmentModel {
  static get properties() {
    this.SeqNumber = Number;
    this.TotalColli = Number;
    this.CountryOfExportation = String;
    this.DeliveryDestinationCountry = String;
    this.Consignee = Object;
    this.Consignment = Object;
    this.Gagitems = Array;
  }
  constructor() {
    this.SeqNumber = 0;
    this.TotalColli = 0;
    this.CountryOfExportation = 'NL';
    this.DeliveryDestinationCountry = '';
    this.Consignee = new consigneeModel();
    this.Consignment = new consignmentModel();
    this.Gagitems = [new gagitemsModel()];
  }
}

export const goodsShipmentModel = GoodsShipmentModel;
