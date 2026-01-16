// import { SupplierSchema } from "../models/suppliers/supplier.models";
// import { CityModel } from "../models/city.models";
// import { Country } from "../models/country.models";
// import { NextFunction } from "express";

// // SupplierSchema.pre("save", async function (next: NextFunction) {

// //     const supplier = this as any;

// //     if (supplier.businessAddress?.city && typeof supplier.businessAddress.city === "string") {
// //         let cityDoc = await CityModel.findOne({ cityName: supplier.businessAddress.city });
// //         if (!cityDoc) {
// //             cityDoc = await CityModel.create({ cityName: supplier.businessAddress.city });
// //         }
// //         supplier.businessAddress.city = cityDoc._id;
// //     }

// //     if (supplier.businessAddress?.country && typeof supplier.businessAddress.country === "string") {
// //         let countryDoc = await Country.findOne({ countryName: supplier.businessAddress.country });
// //         if (!countryDoc) {
// //             countryDoc = await Country.create({ countryName: supplier.businessAddress.country });
// //         }
// //         supplier.businessAddress.country = countryDoc._id;
// //     }

// //     next();
// // });

