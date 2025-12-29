import { Request, Response, NextFunction } from "express";
import { Country } from "../models/country.models";
import { CityModel } from "../models/city.models";
import { Person } from "../models/person.models";
import { Contact } from "../models/contact.models";
import { Address } from "../models/addresses.models";
import mongoose from "mongoose";
import { findOrCreate } from "../utils/findOrCreate";

export const CustomerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const body = req.body;
        const isEdit = req.method === "PUT" || req.method === "PATCH";

        if (body.customerType !== "domestic") {
            throw new Error("This endpoint supports only domestic customers");
        }

        /* -------------------------
         * PERSON
         -------------------------- */
        let person;
        if (isEdit && body.personId) {
            person = await Person.findByIdAndUpdate(
                body.personId,
                {
                    firstName: body.firstName,
                    middleName: body.middleName,
                    lastName: body.lastName,
                },
                { new: true, session }
            );
        } else {
            person = await findOrCreate(
                Person,
                {
                    firstName: body.firstName,
                    middleName: body.middleName,
                    lastName: body.lastName,
                },
                {
                    firstName: body.firstName,
                    middleName: body.middleName,
                    lastName: body.lastName,
                },
                session
            );
        }

        /* -------------------------
         * CONTACT
         -------------------------- */
        let contact;
        if (isEdit && body.contactId) {
            contact = await Contact.findByIdAndUpdate(
                body.contactId,
                {
                    mobileNumber: body.mobileNumber,
                    phoneNumber: body.phoneNumber,
                    emailId: body.emailId,
                },
                { new: true, session }
            );
        } else {
            contact = await findOrCreate(
                Contact,
                {
                    mobileNumber: body.mobileNumber,
                    emailId: body.emailId,
                },
                {
                    mobileNumber: body.mobileNumber,
                    phoneNumber: body.phoneNumber,
                    emailId: body.emailId,
                },
                session
            );
        }

        /* -------------------------
         * COUNTRY (lookup only)
         -------------------------- */
        const country = await findOrCreate(
            Country,
            { countryName: body.country },
            { countryName: body.country },
            session
        );

        /* -------------------------
         * CITY (lookup only)
         -------------------------- */
        const city = await findOrCreate(
            CityModel,
            {
                cityName: body.city,
                countryId: country._id,
            },
            {
                cityName: body.city,
                countryId: country._id,
            },
            session
        );

        /* -------------------------
         * ADDRESS
         -------------------------- */
        let address;
        if (isEdit && body.addressId) {
            address = await Address.findByIdAndUpdate(
                body.addressId,
                {
                    address: body.address,
                    countryId: country._id,
                    cityId: city._id,
                    zipCode: body.zipCode,
                    latitude: body.latitude,
                    longitude: body.longitude,
                },
                { new: true, session }
            );
        } else {
            address = await findOrCreate(
                Address,
                {
                    address: body.address,
                    countryId: country._id,
                    cityId: city._id,
                    zipCode: body.zipCode,
                },
                {
                    address: body.address,
                    countryId: country._id,
                    cityId: city._id,
                    zipCode: body.zipCode,
                    latitude: body.latitude,
                    longitude: body.longitude,
                },
                session
            );
        }

        /* -------------------------
         * Attach IDs
         -------------------------- */
        req.body.personId = person?._id;
        req.body.contactId = contact?._id;
        req.body.addressId = address?._id;

        await session.commitTransaction();
        session.endSession();

        next();
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            message: error.message || "Failed to process domestic customer",
        });
    }
};
