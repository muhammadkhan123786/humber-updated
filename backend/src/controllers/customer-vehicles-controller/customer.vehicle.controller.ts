import { Request, Response } from "express";
import { CustomerVehicleModel } from "../../models/customer.vehicle.models";

//customer owned vehicles 
export const getCustomerOwnedVehiclesByCustomer = async (
    req: Request,
    res: Response
) => {
    try {
        const { customerId } = req.params;

        const vehicles = await CustomerVehicleModel.find({
            customerId,
            isVehicleCompanyOwned: false,
        })
            .populate("vehicleBrandId")
            .populate("vehicleModelId");

        return res.status(200).json({
            success: true,
            data: vehicles,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch vehicles",
        });
    }
};

//company owned vehicles 
export const getCompanyOwnedVehiclesByCustomer = async (
    req: Request,
    res: Response
) => {
    try {
        const { customerId } = req.params;

        const vehicles = await CustomerVehicleModel.find({
            customerId,
            isVehicleCompanyOwned: true,
        })
            .populate("vehicleBrandId")
            .populate("vehicleModelId");

        return res.status(200).json({
            success: true,
            data: vehicles,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch vehicles",
        });
    }
};
