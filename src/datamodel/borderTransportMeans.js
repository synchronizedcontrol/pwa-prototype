/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

class BorderTransportMeansModel {
  static get properties() {
    this.Identification = String;
    this.Mode = Number;
    this.Nationality = String;
  }

  constructor() {
    this.Identification = 'TRUCK';
    this.Mode = 3;
    this.Nationality = 'NL';
  }
}

export const borderTransportMeansModel = BorderTransportMeansModel;
