import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { insuranceCompaniesDoc, InsuranceCompanies } from "../../models/master-data-models/insurance.companies.models";
import { insuranceCompanyValidation } from "../../schemas/master-data/insurance.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const insuranceCompaniesRouter = Router();

const insuranceCompaniesServices = new GenericService<insuranceCompaniesDoc>(InsuranceCompanies);

const insuranceCompaniesController = new AdvancedGenericController({
    service: insuranceCompaniesServices,
    populate: ["userId"],
    validationSchema: insuranceCompanyValidation,
    searchFields: ["insuranceCompanyName"]
});

insuranceCompaniesRouter.get("/", insuranceCompaniesController.getAll);
insuranceCompaniesRouter.get("/:id", insuranceCompaniesController.getById);
insuranceCompaniesRouter.post("/", insuranceCompaniesController.create);
insuranceCompaniesRouter.put("/:id", insuranceCompaniesController.update);
insuranceCompaniesRouter.delete("/:id", insuranceCompaniesController.delete);

export default insuranceCompaniesRouter;

