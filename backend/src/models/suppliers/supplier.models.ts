import { NextFunction } from "express";
import { Schema, model, Types } from "mongoose";
import { CityModel } from "../city.models";
import { Country } from "../country.models";


export const SupplierSchema = new Schema(
    {
        supplierIdentification: {
            legalBusinessName: { type: String, required: true },
            tradingName: { type: String },
            businessRegNumber: { type: String, required: true },
            vat: { type: String },
            businessTypeId: { type: Types.ObjectId, ref: "BusinessType", required: true },
        },

        contactInformation: {
            primaryContactName: { type: String, required: true },
            jobTitleId: { type: Types.ObjectId, ref: "JobTitles", required: true },
            phoneNumber: { type: String, required: true },
            emailAddress: { type: String },
            website: { type: String },
        },

        businessAddress: {
            businessAddress: { type: String, required: true },
            tradingAddress: { type: String },
            city: { type: Types.ObjectId, ref: "CityModel", required: true },
            state: { type: String, required: true },
            country: { type: Types.ObjectId, ref: "Country", required: true },
            zipCode: { type: String, required: true },
        },

        financialInformation: {
            vatRegistered: { type: Boolean, required: true },
            vatNumber: { type: String },
            taxIdentificationNumber: { type: String, required: true },
            paymentCurrencyId: { type: Types.ObjectId, ref: "Currency", required: true },
            paymentMethodId: { type: Types.ObjectId, ref: "PaymentMethod", required: true },
        },

        bankPaymentDetails: {
            bankName: { type: String },
            accountHolderName: { type: String },
            accountNumber: { type: String },
            sortCode: { type: String },
            ibanNumber: { type: String },
            swiftCode: { type: String },
        },

        productServices: {
            typeOfServiceId: { type: Types.ObjectId, ref: "ProductServices", required: true },
            productCategoryIds: [{ type: Types.ObjectId, ref: "ProductCategory" }],
            leadTimes: { type: Number, required: true },
            minimumOrderQuantity: { type: Number, required: true },
        },

        commercialTerms: {
            paymentTermsId: { type: Types.ObjectId, ref: "paymentTerm", required: true },
            pricingAgreementId: { type: Types.ObjectId, ref: "PricingAgreement", required: true },
            discountTerms: { type: String },
            contractStartDate: { type: Date, required: true },
            contractEndDate: { type: Date },
        },

        complianceDocumentation: {
            businessRegistrationCertificates: [{ type: String }],
            insuranceDetails: { type: String },
            insuranceExpiryDate: { type: Date },
            healthAndSafetyCompliance: { type: Boolean },
            qualityCertificate: { type: String },
        },

        operationalInformation: {
            orderContactName: { type: String },
            orderContactEmail: { type: String },
            returnPolicy: { type: String },
            warrantyTerms: { type: String },
        },

        common: {
            isActive: { type: Boolean, default: true },
            isDeleted: { type: Boolean, default: false },
            isDefault: { type: Boolean, default: false },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-save middleware
SupplierSchema.pre("save", async function (next: NextFunction) {
    const doc = this as any;

    // Handle Country
    if (doc.businessAddress?.country && typeof doc.businessAddress.country === "string") {
        let country = await Country.findOne({ countryName: doc.businessAddress.country });
        if (!country) {
            country = await Country.create({ countryName: doc.businessAddress.country });
        }
        doc.businessAddress.country = country._id;
    }

    // Handle City
    if (doc.businessAddress?.city && typeof doc.businessAddress.city === "string") {
        let city = await CityModel.findOne({ cityName: doc.businessAddress.city });
        if (!city) {
            city = await CityModel.create({ cityName: doc.businessAddress.city });
        }
        doc.businessAddress.city = city._id;
    }

    next();
});

// Pre-update middleware for findOneAndUpdate
SupplierSchema.pre("findOneAndUpdate", async function (next: NextFunction) {
    const update: any = this.getUpdate();

    if (update.businessAddress?.country && typeof update.businessAddress.country === "string") {
        let country = await Country.findOne({ countryName: update.businessAddress.country });
        if (!country) {
            country = await Country.create({ countryName: update.businessAddress.country });
        }
        update.businessAddress.country = country._id;
    }

    if (update.businessAddress?.city && typeof update.businessAddress.city === "string") {
        let city = await CityModel.findOne({ cityName: update.businessAddress.city });
        if (!city) {
            city = await CityModel.create({ cityName: update.businessAddress.city });
        }
        update.businessAddress.city = city._id;
    }

    this.setUpdate(update);
    next();
});

export const SupplierModel =
    model("Supplier") || model("Supplier", SupplierSchema);
