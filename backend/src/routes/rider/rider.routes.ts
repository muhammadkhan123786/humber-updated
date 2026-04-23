import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { Request, Response, NextFunction } from "express";
import { riderDoc, Riders } from "../../models/rider/rider.models";
import { RIDER_STATUS, riderZodSchema } from "../../schemas/rider-schemas/rider.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { genericProfileIdsMiddleware } from "../../middleware/generic.profile.middleware";
import { createUploader } from "../../config/multer";
import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";
import { generateRiderCode } from "../../utils/generate.AutoCode.Counter";
import { getAllRiders, getAvailableDrivers } from "../../controllers/rider/rider.statistics.controller";
import { Types } from "mongoose";
import { ActivityStatus } from "../../schemas/technician-activities-records/technician.activities.records.schema";

const riderUploads = createUploader([
  {
    name: "profilePic",
    maxCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  {
    name: "licenseFrontPic",
    maxCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  {
    name: "licenseBackPic",
    maxCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  {
    name: "insuranceDocumentPic",
    maxCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  {
    name: "motCertificatePic",
    maxCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  {
    name: "utilityBillPic",
    maxCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
]);

const riderRouter = Router();

const riderServices = new GenericService<riderDoc>(Riders);

const riderController = new AdvancedGenericController({
  service: riderServices,
  populate: [
    "userId",
    "personId",
    "addressId",
    "contactId",
    "accountId",
    "vehicleTypeId",
    "employeementTypeId",
    {
      path: "addressId",
      populate: [{ path: "cityId" }, { path: "countryId" }],
    },
  ],
  searchFields: [
    "personId.firstName",
    "personId.middleName",
    "personId.lastName",
    "employeeId",
    "contactId.emailId",
    "contactId.mobileNumber",
  ],
  validationSchema: riderZodSchema,
});

const riderProfileMiddleware = genericProfileIdsMiddleware<riderDoc>({
  targetModel: Riders,
});

riderRouter.put('/update-status',async (req: Request, res: Response) => {
  try {
    const { riderId, status } = req.body;

    // ✅ Validate riderId
    if (!riderId || !Types.ObjectId.isValid(riderId)) {
      return res.status(400).json({ success: false, message: "Invalid riderId" });
    }

    // ✅ Validate status
    if (!status || !RIDER_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // ✅ Update rider status
    const updatedRider = await Riders.findByIdAndUpdate(
      riderId,
      { riderStatus: status as ActivityStatus },
      { new: true }
    );

    if (!updatedRider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    res.status(200).json({
      success: true,
      message: `Rider status updated to ${status}`,
      data: updatedRider,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server Error" });
  }
});

riderRouter.get("/available", getAvailableDrivers);
riderRouter.get("/", getAllRiders);
riderRouter.get("/:id", riderController.getById);


// backend/src/routes/rider/rider.routes.ts
riderRouter.post(
  "/",
  riderUploads,
  mapUploadedFilesToBody("/uploads", {}, [
    "profilePic",
    "licenseFrontPic",
    "licenseBackPic",
    "insuranceDocumentPic",
    "motCertificatePic",
    "utilityBillPic",
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(
      "📥 [POST /riders] Request body after multer:",
      JSON.stringify(req.body, null, 2),
    );
    console.log("📥 [POST /riders] Request files:", req.files);
    next();
  },
  riderProfileMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const riderCode = await generateRiderCode();
    req.body.riderAutoId = riderCode;
    console.log(
      "📥 [POST /riders] After adding riderAutoId:",
      req.body.riderAutoId,
    );
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    console.log(
      "📥 [POST /riders] Before controller - final body:",
      JSON.stringify(req.body, null, 2),
    );
    next();
  },
  riderController.create,
);

// PUT
riderRouter.put(
  "/:id",
  riderUploads,
  mapUploadedFilesToBody("/uploads", {}, [
    "profilePic",
    "licenseFrontPic",
    "licenseBackPic",
    "insuranceDocumentPic",
    "motCertificatePic",
    "utilityBillPic",
  ]),
  riderProfileMiddleware,
  riderController.update,
);

// DELETE
riderRouter.delete("/:id", riderController.delete);

export default riderRouter;
