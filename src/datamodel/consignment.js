/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { borderTransportMeansModel } from './borderTransportMeans.js';
import { departureTransportMeansModel } from './departureTransportMeans.js';


class ConsignmentModel {
  constructor (data) {
    this.BorderTransportMeans = new borderTransportMeansModel();
    this.DepartureTransportMeans = new departureTransportMeansModel();
  }
}

export const consignmentModel = ConsignmentModel;
