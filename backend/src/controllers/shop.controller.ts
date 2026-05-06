import { Request, Response } from "express";
import { Shop } from "../models/shop.models";
import { Country } from "../models/country.models";
import { Address } from "../models/addresses.models";
import { Person } from "../models/person.models";
import { Contact } from "../models/contact.models";
import { User } from "../models/user.models";
import mongoose from "mongoose";

export const registerShopDetails = async (req: Request, res: Response) => {
  console.log("Content-Type:", req.headers['content-type']);
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const {
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
    } = req.body;

    console.log("API HIT");
    const logoPath = (req.file as Express.Multer.File)?.filename || "";

    // 1. Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Create User
    const newUserDocs = await User.create([
      {
        email: emailId,
        password,
        role: "Admin",
        isActive: true,
        isDeleted: false,
      },
    ]);

    if (!newUserDocs || newUserDocs.length === 0) {
      throw new Error("User creation failed, no document returned.");
    }
    const newUser = newUserDocs[0];
    const userId = newUser._id as mongoose.Types.ObjectId;

    console.log("NEW USER ID:", userId);
    if (!userId) {
      throw new Error("userId is missing before creating Country");
    }

    // 4. Find or create Country
    let countryDoc = await Country.findOne({
      countryName: country,
      userId: userId,
    });

    if (!countryDoc) {
      console.log("CRITICAL CHECK - userId value:", userId);
      const newCountry = new Country({
        countryName: country,
        userId: userId,
      });

      const validationError = newCountry.validateSync();
      if (validationError) {
        console.error("Validation failed manually:", validationError);
      }

      const createdCountry = await newCountry.save();
      countryDoc = createdCountry;
    }

    // 5. Create Address
    const addressDoc = new Address({
      address: companyAddress || "",
      countryId: countryDoc._id as mongoose.Types.ObjectId,
      zipCode: zipCode || "",
      latitude: latitude ? Number(latitude) : 0,
      longitude: longitude ? Number(longitude) : 0,
      userId: userId,
      isActive: true,
      isDeleted: false,
    });
    await addressDoc.save();

    // 6. Create Person
    const createdPerson = await Person.create([
      {
        firstName: firstName || "",
        middleName: middleName || "",
        lastName: lastName || "",
        
      },
    ]);
    const personDoc = createdPerson[0];

    // 7. Create Contact
    const createdContact = await Contact.create([
      {
        mobileNumber: mobileNumber || "",
        phoneNumber: phoneNumber || "",
        companyWebsite: companyWebsite || "",
        emailId: emailId || "",
      },
    ]);
    const contactDoc = createdContact[0];

    // 8. Create Shop
    const createdShop = await Shop.create([
      {
        shopName: companyName || "",
        personId: personDoc._id,
        contactId: contactDoc._id,
        addressId: addressDoc._id,
        userId: userId,
        logo: logoPath,
        isActive: true,
        isDeleted: false,
      },
    ]);
    const shop = createdShop[0];
    
    newUser.shopId = shop._id;
    await newUser.save();
    // Success
    return res.status(201).json({
      message: "Shop registered successfully",
      shopId: shop._id,
      email: newUser.email,
    });
  } catch (error: any) {
    console.error("Registration error:", JSON.stringify(error, null, 2));

    return res.status(500).json({
      message: "Registration failed",
      error:
        process.env.NODE_ENV === "development"
          ? { message: error.message, errors: error.errors }
          : undefined,
    });
  }
};