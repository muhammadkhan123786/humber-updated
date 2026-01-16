import { CityModel } from "../models/city.models";
import { Country } from "..//models/country.models";
import { NextFunction, Request, Response } from "express";
export const resolveBusinessAddressRefs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { businessAddress } = req.body;

        // Country
        if (typeof businessAddress.country === "string") {
            let country = await Country.findOne({
                countryName: businessAddress.country,
            });

            if (!country) {
                country = await Country.create({
                    countryName: businessAddress.country,
                });
            }

            businessAddress.country = country._id;
        }

        // City
        if (typeof businessAddress.city === "string") {
            let city = await CityModel.findOne({
                cityName: businessAddress.city,
            });

            if (!city) {
                city = await CityModel.create({
                    cityName: businessAddress.city,
                });
            }

            businessAddress.city = city._id;
        }

        next();
    } catch (error) {
        next(error);
    }
};
