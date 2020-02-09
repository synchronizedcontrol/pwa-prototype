/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

class AddressModel {
  static get properties() {
    this.City = String;
    this.Country = String;
    this.Postcode = String;
    this.StreetAndNumber = String;
  }

  constructor() {
    this.City = '';
    this.Country = '';
    this.Postcode = '';
    this.StreetAndNumber = '';
  }
}

export const addressModel = AddressModel;
