import { Request, Response, NextFunction } from "express";
import { Country } from "../models/country.models";
import { CityModel } from "../models/city.models";
import { Person } from "../models/person.models";
import { Contact } from "../models/contact.models";
import { Address } from "../models/addresses.models";
import mongoose, { ClientSession } from "mongoose";
import { findOrCreate } from "../utils/findOrCreate";
import { CustomerBase } from "../models/customer.models";

export const CreateOrUpdateCustomerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const isEdit = !!id; // edit if _id exists

        let customer;
        if (isEdit) {
            customer = await CustomerBase.findById(id).session(session);
            if (!customer) throw new Error("Customer not found");
        }

        /* -------------------------
           PERSON
        -------------------------- */
        let person;
        const personId = req.body.personId || customer?.personId;
        if (personId) {
            person = await Person.findByIdAndUpdate(
                personId,
                {
                    firstName: req.body.firstName,
                    middleName: req.body.middleName,
                    lastName: req.body.lastName,
                },
                { new: true, session }
            );
        } else {
            person = await new Person({
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
            }).save({ session });
        }

        /* -------------------------
           CONTACT
        -------------------------- */
        let contact;
        const contactId = req.body.contactId || customer?.contactId;
        if (contactId) {
            contact = await Contact.findByIdAndUpdate(
                contactId,
                {
                    mobileNumber: req.body.mobileNumber,
                    phoneNumber: req.body.phoneNumber,
                    emailId: req.body.emailId,
                },
                { new: true, session }
            );
        } else {
            contact = await findOrCreate(
                Contact,
                { mobileNumber: req.body.mobileNumber },
                {
                    mobileNumber: req.body.mobileNumber,
                    phoneNumber: req.body.phoneNumber,
                    emailId: req.body.emailId,
                },
                session
            );
        }

        /* -------------------------
           COUNTRY
        -------------------------- */
        const country = await findOrCreate(
            Country,
            { countryName: req.body.country },
            { countryName: req.body.country },
            session
        );

        /* -------------------------
           CITY
        -------------------------- */
        const city = await findOrCreate(
            CityModel,
            { cityName: req.body.city, countryId: country._id },
            { cityName: req.body.city, countryId: country._id },
            session
        );

        /* -------------------------
           ADDRESS
        -------------------------- */
        let address;
        const addressId = req.body.addressId || customer?.addressId;
        if (addressId) {
            address = await Address.findByIdAndUpdate(
                addressId,
                {
                    address: req.body.address,
                    countryId: country._id,
                    cityId: city._id,
                    zipCode: req.body.zipCode,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                },
                { new: true, session }
            );
        } else {
            address = await findOrCreate(
                Address,
                { address: req.body.address, countryId: country._id, cityId: city._id, zipCode: req.body.zipCode },
                { address: req.body.address, countryId: country._id, cityId: city._id, zipCode: req.body.zipCode, latitude: req.body.latitude, longitude: req.body.longitude },
                session
            );
        }

        /* -------------------------
           Attach IDs
        -------------------------- */
        req.body.personId = person?._id;
        req.body.contactId = contact?._id;
        req.body.addressId = address?._id;

        /* Pass session forward */
        req.mongoSession = session;

        next(); // Controller will commit
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            message: error.message || "Failed to create/update customer",
        });
    }
};