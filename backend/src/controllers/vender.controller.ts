import { Request, Response } from "express"
import { VenderDto } from '../../../common/DTOs/vender.dto';

import { VenderDomainService } from "../services/vender-Domain-Services/vender.domain.services";

export const saveVender = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const venderData: VenderDto = {
            person: req.body.person,
            contact: req.body.contact,
            address: req.body.address,
            userId: req.body.userId,
            venderType: req.body.venderType,
            business_Name: req.body.business_Name,
            website: req.body.website,
            paymentTermId: req.body.paymentTermId,
            currencyId: req.body.currencyId,
            credit_Limit: req.body.credit_Limit,
            bank_name: req.body.bank_name,
            account_Number: req.body.account_Number,
            lead_Time_Days: req.body.lead_Time_Days,
            isActive: req.body.isActive,
            isDefault: req.body.isDefault,
        };
        const vender = new VenderDomainService();

        const createdVender = await vender.createVender(venderData);

        return res.status(201).json({
            success: true,
            message: "Vendor saved successfully",
            createdVender
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Vendor save failed"
        });
    }

}