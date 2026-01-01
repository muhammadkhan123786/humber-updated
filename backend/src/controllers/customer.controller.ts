import { GenericService } from "../services/generic.crud.services";
import { CustomerBaseDoc, domesticCutomerSchema, corporateCustomerSchema } from "../models/customer.models";
import { domesticCustomerSchema } from "../schemas/domestic.customer.schema";
import { corporateCustomerValidationSchema } from "../schemas/corporate.customer.schema";
import { Request, Response, NextFunction } from "express";



const domesticServices = new GenericService<CustomerBaseDoc>(domesticCutomerSchema);

const corporateServices = new GenericService<CustomerBaseDoc>(corporateCustomerSchema);

export const saveCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { customerType } = req.body;

        let service: GenericService<CustomerBaseDoc>;
        let validationSchema;

        if (customerType === "domestic") {
            service = domesticServices;
            validationSchema = domesticCustomerSchema;
        } else if (customerType === "corporate") {
            service = corporateServices;
            validationSchema = corporateCustomerValidationSchema;
        } else {
            return res.status(400).json({ message: "Invalid customer type" });
        }

        // ✅ Validate input
        const parseResult = validationSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parseResult.error.issues
            });
        }

        let customer;

        if (id) {
            // ✅ Update existing customer
            customer = await service.updateById(id, req.body);
        } else {
            // ✅ Create new customer
            customer = await service.create(req.body);
        }
        res.status(200).json({
            message: id ? "Customer updated successfully" : "Customer created successfully",
            data: customer
        });

    } catch (error: any) {

        next(error);
    }
};


//update customer 
