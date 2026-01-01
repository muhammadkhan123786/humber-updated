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

        let targetService: GenericService<CustomerBaseDoc>;
        let validationSchema;

        if (customerType === "domestic") {
            targetService = domesticServices;
            validationSchema = domesticCustomerSchema;
        } else if (customerType === "corporate") {
            targetService = corporateServices;
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

        /* =========================
           CREATE
        ========================== */
        if (!id) {
            const customer = await targetService.create(req.body);
            return res.status(201).json({
                message: "Customer created successfully",
                data: customer
            });
        }

        /* =========================
           UPDATE
        ========================== */

        // 🔹 Fetch customer from BOTH collections
        const existingCustomer =
            (await domesticServices.getById(id)) ||
            (await corporateServices.getById(id));

        if (!existingCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        /* =========================
           TYPE CONVERSION
        ========================== */
        if (existingCustomer.customerType !== customerType) {

            // 1️⃣ Archive old customer
            const oldService =
                existingCustomer.customerType === "domestic"
                    ? domesticServices
                    : corporateServices;

            await oldService.updateById(existingCustomer._id.toString(), {
                isActive: false,
                convertedAt: new Date()
            });

            // 2️⃣ Create new customer
            const newCustomer = await targetService.create({
                ...req.body,
                previousCustomerId: existingCustomer._id
            });

            // 3️⃣ Link both
            await oldService.updateById(existingCustomer._id.toString(), {
                convertedToCustomerId: newCustomer._id
            });

            return res.status(201).json({
                message: "Customer converted successfully",
                data: newCustomer
            });
        }

        /* =========================
           NORMAL UPDATE
        ========================== */
        const updatedCustomer = await targetService.updateById(id, req.body);

        return res.status(200).json({
            message: "Customer updated successfully",
            data: updatedCustomer
        });

    } catch (error) {
        next(error);
    }
};



//update customer 
