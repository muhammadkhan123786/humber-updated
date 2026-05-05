import { Request, Response } from "express";
import { Shop } from "../models/shop.models";
import { Country } from "../models/country.models";
import { Address } from "../models/addresses.models";
import { Person } from "../models/person.models";
import { Contact } from "../models/contact.models";
import { IShopRegisterBackendInterface } from "../types/shopRegister.type";
import { User } from "../models/user.models";
import mongoose from "mongoose";

export const registerShopDetails = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      // userId,
      firstName,
      middleName,
      lastName,
      emailId,
      companyName,
      mobileNumber,
      phoneNumber,
      companyWebsite,
      companyAddress,
      country,
      zipCode,
      latitude,
      longitude,
      password,
      confirmPassword,
      termsSelected,
    } = req.body;

    const payload: IShopRegisterBackendInterface = {
      // userId: new Types.ObjectId(userId),
      firstName,
      middleName,
      lastName,
      fullName: `${firstName} ${middleName ?? ""} ${lastName}`.trim(),
      emailId,
      companyName,
      mobileNumber,
      phoneNumber,
      companyWebsite,
      companyAddress,
      country,
      zipCode,
      latitude: Number(latitude),
      longitude: Number(longitude),
      password,
      confirmPassword,
      logo: req.file?.filename ?? "",
      termsSelected: Boolean(termsSelected),
    };
    const logoPath = (req.file as Express.Multer.File)?.filename || "";

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    let existingUser = await User.findOne({ email: emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const [newUser] = await User.create(
      [
        {
          email: emailId,
          password,
          role: "Admin", // pehla user admin hoga
          isActive: true,
          isDeleted: false,
        },
      ],
      { session },
    );
    // if (!userId) return res.status(400).json({ message: 'User ID is missing' });

    // 1️⃣ Find country by name
    let countryDoc = await Country.findOne({ countryName: country });

    // 2️⃣ If country not found, create it
    if (!countryDoc) {
      countryDoc = await Country.create({ countryName: country });
    }

    // 3️⃣ Create address document
    const [addressDoc] = await Address.create(
      [
        {
          address: companyAddress,
          countryId: countryDoc._id,
          zipCode,
          latitude,
          longitude,
          isActive: true,
          isDeleted: false,
        },
      ],
      { session },
    );

    //person Id
    const [personDoc] = await Person.create(
      [
        {
          firstName,
          middleName,
          lastName,
        },
      ],
      { session },
    );

    //contact Id
    const [contactDoc] = await Contact.create(
      [
        {
          mobileNumber,
          phoneNumber,
          companyWebsite,
          emailId: payload.emailId,
        },
      ],
      { session },
    );

    const [shop] = await Shop.create(
      [
        {
          shopName: companyName,
          personId: personDoc._id,
          contactId: contactDoc._id,
          addressId: addressDoc._id,
          userId: newUser._id,
          logo: logoPath,
          isActive: true,
          isDeleted: false,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Shop registered successfully",
      shop,
      address: addressDoc,
      country: countryDoc,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
};
