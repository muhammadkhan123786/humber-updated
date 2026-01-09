import { Request, Response } from "express";
import { VenderDto } from "../../../common/DTOs/vender.dto";

import { VenderDomainService } from "../services/vender-Domain-Services/vender.domain.services";
export const saveOrUpdateVender = async (req: Request, res: Response) => {
  try {
    const venderData: VenderDto = {
      person: req.body.person,
      contact: req.body.contact,
      address: req.body.address,
      userId: req.body.userId,
      venderType: req.body.venderType,
      business_name: req.body.business_name,
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

    const venderService = new VenderDomainService();
    let result;

    // 🔹 EDIT MODE
    if (req.params.id) {
      result = await venderService.updateVender(req.params.id, venderData);

      return res.status(200).json({
        success: true,
        message: "Vendor updated successfully",
        vender: result,
      });
    }

    // 🔹 CREATE MODE
    result = await venderService.createVender(venderData);

    return res.status(201).json({
      success: true,
      message: "Vendor saved successfully",
      vender: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Vendor save/update failed",
    });
  }
};
