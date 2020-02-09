/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

import { gagitemsModel } from '../datamodel/gagitems.js';
import { packagesModel } from '../datamodel/packages.js';
import { translatorUrl } from '../components/appConfig.js';
import { navigate } from '../actions/app.js';
import { installRouter } from 'pwa-helpers/router.js';
import { store } from '../store.js';

export const GET_DECLARATION = 'GET_DECLARATION';
export const ADD_GAGITEM = 'ADD_GAGITEM';
export const REMOVE_GAGITEM = 'REMOVE_GAGITEM';
export const ADD_PACKAGES = 'ADD_PACKAGES';
export const REMOVE_PACKAGES = 'REMOVE_PACKAGES';
export const UPDATE_FIELD = 'UPDATE_FIELD';
export const UPDATE_GOODSSHIPMENT = 'UPDATE_GOODSSHIPMENT';
export const UPDATE_CONSIGNEE = 'UPDATE_CONSIGNEE';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const UPDATE_GAGITEM = 'UPDATE_GAGITEM';
export const UPDATE_PACKAGES = 'UPDATE_PACKAGES';
export const SUBMIT_DECLARATION = 'SUBMIT_DECLARATION';
export const RESET_DECLARATION = 'RESET_DECLARATION';

const postDeclaration = dec => {
  return fetch(translatorUrl, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `jwt ${store.getState()['auth']['token']}`,
      'X-identifiable': 1
    },
    body: JSON.stringify(dec)
  }).then(res => {
    if (res.ok) return res.json();
    throw new Error(res);
  });
};

export const addNewGagitem = () => dispatch => {
  dispatch(addGagitem(new gagitemsModel()));
};

export const removeCurrentGagitem = id => dispatch => {
  dispatch(removeGagitem(id));
};

export const addNewPackages = GagitemId => dispatch => {
  dispatch(addPackages(new packagesModel(), GagitemId));
};

export const removeCurrentPackage = (gId, id) => dispatch => {
  dispatch(removePackages(gId, id));
};

export const resettingDeclaration = () => dispatch => {
  dispatch(resetDeclaration());
};
export const declare = (event, declaration) => dispatch => {
  event.preventDefault();
  let deliveryDestinationCountry =
    declaration.GoodsShipment.Consignee.Address.Country;
  let totalColli = 0;

  declaration.GoodsShipment.Gagitems.forEach(function(element, index) {
    declaration.GoodsShipment.Gagitems[index].Packages.forEach(function(el) {
      totalColli += parseInt(el.NumberOfPackages);
    });
    return totalColli;
  });

  const declarationXML = createDeclarationXML(
    declaration,
    deliveryDestinationCountry,
    totalColli
  );

  const declarationJson = {
    AutoProcess: false,
    DeclarationCode: 8,
    Request: declarationXML,
    RequestType: 1,
    SchemaName: store.getState()['defaults']['default']['SchemaNameUsed']
  };

  postDeclaration(declarationJson)
    .then(res => {
      dispatch(resetDeclaration());
      const newLocation = `/declaration-cleared?id=${res}`;
      window.history.pushState({}, '', newLocation);
      installRouter(location => dispatch(navigate(newLocation)));
    })
    .catch(e => {
      console.log(e);
      Promise.reject(e);
    });
  dispatch(submitDeclaration(deliveryDestinationCountry, totalColli));
};

const createDeclarationXML = (dec, destCountry, totals) => {
  const defaultData = store.getState()['defaults']['default'];
  const gagitemsXML = createGagitemsXML(dec);

  return (
    `<?xml version="1.0" encoding="utf-8" standalone="yes"?>` +
    '<DMSInterface CreatedBy="LANGDONS">' +
    `<Declarations>` +
    `<Declaration>` +
    `<DeclarationCode>${dec.DeclarationCode}</DeclarationCode>` +
    `<CompanyReference>${dec.CompanyReference}</CompanyReference>` +
    `<OfficeOfDeclaration>${
      defaultData.OfficeOfDeclaration
    }</OfficeOfDeclaration>` +
    `<Company>` +
    `<ExternalId>${defaultData.Company}</ExternalId>` +
    `</Company>` +
    `<GoodsShipment>` +
    `<SeqNumber>1</SeqNumber>` +
    `<TotalColli>${totals}</TotalColli>` +
    `<CountryOfExportation>${
      dec.GoodsShipment.CountryOfExportation
    }</CountryOfExportation>` +
    `<DeliveryDestinationCountry>${destCountry}</DeliveryDestinationCountry>` +
    `<NatureOfTransaction>${
      defaultData.NatureOfTransaction
    }</NatureOfTransaction>` +
    `<Consignee>` +
    `<Name>${dec.GoodsShipment.Consignee.Name}</Name>` +
    `<Address>` +
    `<City>${dec.GoodsShipment.Consignee.Address.City}</City>` +
    `<Country>${dec.GoodsShipment.Consignee.Address.Country}</Country>` +
    `<StreetAndNumber>${
      dec.GoodsShipment.Consignee.Address.StreetAndNumber
    }</StreetAndNumber>` +
    `<Postcode>${dec.GoodsShipment.Consignee.Address.Postcode}</Postcode>` +
    `</Address>` +
    `</Consignee>` +
    `<Consignment>` +
    `<GoodsLocation>` +
    `<ExternalId>${dec.GoodsShipment.Consignment.GoodsLocation}</ExternalId>` +
    `</GoodsLocation>` +
    `<FreightTransportPaymentMethod>${
      defaultData.FreightTransportPaymentMethod
    }</FreightTransportPaymentMethod>` +
    `<BorderTransportMeans>` +
    `<Identification>${
      dec.GoodsShipment.Consignment.BorderTransportMeans.Identification
    }</Identification>` +
    `<Mode>${dec.GoodsShipment.Consignment.BorderTransportMeans.Mode}</Mode>` +
    `<Nationality>${
      dec.GoodsShipment.Consignment.BorderTransportMeans.Nationality
    }</Nationality>` +
    `</BorderTransportMeans>` +
    `<DepartureTransportMeans>` +
    `<Identification>${
      dec.GoodsShipment.Consignment.DepartureTransportMeans.Identification
    }</Identification>` +
    `<Mode>${
      dec.GoodsShipment.Consignment.DepartureTransportMeans.Mode
    }</Mode>` +
    `</DepartureTransportMeans>` +
    `</Consignment>` +
    `<GagItems>` +
    `${gagitemsXML}` +
    `</GagItems>` +
    `</GoodsShipment>` +
    `</Declaration>` +
    `</Declarations>` +
    `</DMSInterface>`
  );
};

const createGagitemsXML = dec => {
  let allGagitems = '';
  dec.GoodsShipment.Gagitems.forEach(function(element, index) {
    let allPackages = '';
    dec.GoodsShipment.Gagitems[index].Packages.forEach(function(
      element,
      index
    ) {
      return (allPackages +=
        `<Packaging>` +
        `<SeqNumber>${index + 1}</SeqNumber>` +
        `<ShippingMarks>${element.ShippingMarks}</ShippingMarks>` +
        `<PackagesIdType>${element.PackagesIdType}</PackagesIdType>` +
        `<NumberOfPackages>${element.NumberOfPackages}</NumberOfPackages>` +
        `<GrossItemWeight>${element.GrossItemWeight}</GrossItemWeight>` +
        `<NetItemWeight>${element.NetItemWeight}</NetItemWeight>` +
        `</Packaging>`);
    });

    return (allGagitems +=
      `<GovernmentAgencyGoodsItem>` +
      `<SeqNumber>${index + 1}</SeqNumber>` +
      `<StatisticalValue>${parseInt(element.StatisticalValue).toFixed(
        2
      )}</StatisticalValue>` +
      `<StatisticalValueCurrency>${element.StatisticalValueCurrency}` +
      `</StatisticalValueCurrency>` +
      `<Commodity>` +
      `<ExternalId>${element.Commodity}</ExternalId>` +
      `</Commodity>` +
      `<TSQuantity>${element.TSQuantity}</TSQuantity>` +
      `<CustomsRegulation>${element.CustomsRegulation}</CustomsRegulation>` +
      `<PreviousRegulation>${element.PreviousRegulation}</PreviousRegulation>` +
      `<Packages>` +
      `${allPackages}` +
      `</Packages>` +
      `</GovernmentAgencyGoodsItem>`);
  });

  return allGagitems;
};

const addGagitem = item => {
  return {
    type: ADD_GAGITEM,
    item
  };
};

const removeGagitem = id => {
  return {
    type: REMOVE_GAGITEM,
    id
  };
};

const addPackages = (item, id) => {
  return {
    type: ADD_PACKAGES,
    item,
    id
  };
};

const removePackages = (gId, id) => {
  return {
    type: REMOVE_PACKAGES,
    gId,
    id
  };
};

export const updateField = (value, label) => {
  return {
    type: UPDATE_FIELD,
    value,
    label
  };
};

export const updateGoodsshipment = (value, label) => {
  return {
    type: UPDATE_GOODSSHIPMENT,
    value,
    label
  };
};

export const updateConsignee = (value, label) => {
  return {
    type: UPDATE_CONSIGNEE,
    value,
    label
  };
};

export const updateAddress = (value, label) => {
  return {
    type: UPDATE_ADDRESS,
    value,
    label
  };
};

export const updateGagitem = (value, label, id) => {
  return {
    type: UPDATE_GAGITEM,
    value,
    label,
    id
  };
};

export const updatePackages = (value, label, packageID, GagitemID) => {
  return {
    type: UPDATE_PACKAGES,
    value,
    label,
    packageID,
    GagitemID
  };
};

const submitDeclaration = (deliveryDestinationCountry, totalColli) => {
  return {
    type: SUBMIT_DECLARATION,
    deliveryDestinationCountry,
    totalColli
  };
};

const resetDeclaration = () => {
  return {
    type: RESET_DECLARATION
  };
};
