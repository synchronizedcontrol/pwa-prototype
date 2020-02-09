/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

class PackagesModel {
  static get properties() {
    this.ShippingMarks = String;
    this.NumberOfPackages = Number;
    this.GrossItemWeight = Number;
    this.NetItemWeight = Number;
  }

  constructor() {
    this.ShippingMarks = '';
    this.NumberOfPackages = 0;
    this.GrossItemWeight = 0;
    this.NetItemWeight = 0;
  }
}

export const packagesModel = PackagesModel;
