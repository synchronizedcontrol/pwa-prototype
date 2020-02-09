/**
@license
Copyright (c) 2018 XBorder BV. All rights reserved.
*/

export const defaults = {
    "Request": {
        "Declarations": {
            "Declaration": {
                "OfficeOfDeclaration": "Office Of Declaration",
                "Company": 1,
                "GoodsShipment": {
                    "NatureOfTransaction": "Nature Of Transaction",
                    "Consignment": {
                        "GoodsLocation": [1, 2, 3, 4, 5],
                        "FreightTransportPaymentMethod": "Freight Transport Payment Method"
                    },
                    "GagItems": [
                        {
                            "Commodity": [1, 2, 3, 4, 5],
                            "Packages": [
                                {
                                    "PackagesIdType": [1, 2, 3, 4, 5]
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
	"SchemaName": "Schema Name"
};

export const defaultsSponq = {
    "Request": {
        "Declarations": {
            "Declaration": {
                "Symbol": "Symbol",
                "Type": "Type",
                "GoodsShipment": {
                    "ExitOffice": "ExitOffice",
                    "TradeTerms": {
                        "Incoterms": "Incoterms",
                        "Place": "Place"
                    },
                    "GagItems": [
                        {
                            "StatisticalValue": "StatisticalValue",
                            "StatisticalValueCurrency": "StatisticalValueCurrency"
                        }
                    ]
                }
            }
        }
    }
}