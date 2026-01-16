import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { SupplierModel, SupplierBaseDoc } from "../../models/suppliers/supplier.models";
import { supplierSchemaValidation } from "../../schemas/suppliers/supplier.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { createUploader } from "../../config/multer";
import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";


const supplierUploads = createUploader([
    {
        name: "businessRegistrationCertificates",
        maxCount: 1000,
        mimeTypes: ["image/jpeg", "image/png"],
    },
]);
const SupplierRouters = Router();

const SupplierServices = new GenericService<SupplierBaseDoc>(SupplierModel);



const SupplierController = new AdvancedGenericController({
    service: SupplierServices,
    populate: ["userId", "businessTypeId", "jobTitleId", "city", "country", "paymentCurrencyId"
        , "paymentMethodId",
        "typeOfServiceId", "productCategoryIds", "paymentTermsId", "pricingAgreementId"],
    validationSchema: supplierSchemaValidation,

});



SupplierRouters.get("/", SupplierController.getAll);
SupplierRouters.get("/:id", SupplierController.getById);
SupplierRouters.post("/", supplierUploads, mapUploadedFilesToBody(), SupplierController.create);
SupplierRouters.post("/:id", supplierUploads, mapUploadedFilesToBody(), SupplierController.update);
SupplierRouters.delete("/:id", SupplierController.delete);

export default SupplierRouters;

