import { AdvancedGenericController } from "./GenericController";
import { GenericService } from "../services/generic.crud.services";
import { CustomerBaseDoc, domesticCutomerSchema, corporateCustomerSchema } from "../models/customer.models";
import { domesticCustomerSchema } from "../schemas/domestic.customer.schema";
import { corporateCustomerValidationSchema } from "../schemas/corporate.customer.schema";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";


const domesticServices = new GenericService<CustomerBaseDoc>(domesticCutomerSchema);

const corporateServices = new GenericService<CustomerBaseDoc>(corporateCustomerSchema);

const domesticController = new AdvancedGenericController<CustomerBaseDoc>(
    {
        service: domesticServices,
        populate: [],
        validationSchema: domesticCustomerSchema
    }
);

const corporateController = new AdvancedGenericController<CustomerBaseDoc>({
    service: corporateServices,
    populate: [],
    validationSchema: corporateCustomerValidationSchema
});

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { customerType } = req.body;

        let controller: AdvancedGenericController<CustomerBaseDoc>;

        if (customerType === "domestic") {
            controller = domesticController;
        } else if (customerType === "corporate") {
            controller = corporateController;
        } else {
            throw new Error("Invalid customer type");
        }

        const customer = await controller.create(req, res);

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Customer created successfully",
            data: customer
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

