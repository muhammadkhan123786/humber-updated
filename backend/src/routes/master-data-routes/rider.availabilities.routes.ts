import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  riderAvailabilitiesDoc,
  riderAvailabilities,
} from "../../models/master-data-models/rider.availabilities.models";

// Import BOTH schemas from your schema file
import {
  riderAvailabilitiesValidation,
  riderAvailabilitiesBaseSchema,
} from "../../schemas/master-data/rider.availabilities.schema";

import { AdvancedGenericController } from "../../controllers/GenericController";

const riderAvailabilitiesRouter = Router();

const riderAvailabilitiesServices = new GenericService<riderAvailabilitiesDoc>(
  riderAvailabilities,
);

const riderAvailabilitiesController = new AdvancedGenericController({
  service: riderAvailabilitiesServices,
  populate: ["userId"],
  /* Use the Base Schema (the raw object) here.
     The controller will use this to allow partial updates (PUT).
  */
  validationSchema: riderAvailabilitiesBaseSchema,
  searchFields: ["name"],
});

riderAvailabilitiesRouter.get("/", riderAvailabilitiesController.getAll);
riderAvailabilitiesRouter.get("/:id", riderAvailabilitiesController.getById);

// Optional: If your controller allows a custom validation override for POST
riderAvailabilitiesRouter.post("/", riderAvailabilitiesController.create);

riderAvailabilitiesRouter.put("/:id", riderAvailabilitiesController.update);
riderAvailabilitiesRouter.delete("/:id", riderAvailabilitiesController.delete);

export default riderAvailabilitiesRouter;
