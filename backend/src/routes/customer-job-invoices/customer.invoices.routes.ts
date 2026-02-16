import { NextFunction, Router, Request, Response } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  CustomerJobsInvoices,
  customerInvoiceDoc,
} from "../../models/invoice-jobs/invoice.jobs.models";
import { createInvoiceSchemaValidation } from "../../schemas/job-invoice-schemas/job.invoice.validation";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { generateCustomerInvoiceCode } from "../../utils/generate.AutoCode.Counter";

const customerInvoiceRouter = Router();

const customerInvoiceServices = new GenericService<customerInvoiceDoc>(
  CustomerJobsInvoices,
);

const customerInvoiceController = new AdvancedGenericController({
  service: customerInvoiceServices,
  populate: ["userId", "jobId", "customerId"],
  validationSchema: createInvoiceSchemaValidation,
  searchFields: ["invoiceId"],
});

customerInvoiceRouter.get("/", customerInvoiceController.getAll);
customerInvoiceRouter.get("/:id", customerInvoiceController.getById);
customerInvoiceRouter.post(
  "/",
  async (req: Request, _res: Response, next: NextFunction) => {
    if (req.body.invoiceDate)
      req.body.invoiceDate = new Date(req.body.invoiceDate);
    if (req.body.dueDate) req.body.dueDate = new Date(req.body.dueDate);
    const invoiceCode = await generateCustomerInvoiceCode();
    req.body.invoiceId = invoiceCode;
    next(); // ✅ Important
  },
  customerInvoiceController.create,
);

customerInvoiceRouter.put(
  "/:id",
  (req: Request, _res: Response, next: NextFunction) => {
    if (req.body.invoiceDate)
      req.body.invoiceDate = new Date(req.body.invoiceDate);
    if (req.body.dueDate) req.body.dueDate = new Date(req.body.dueDate);
    next(); // ✅ Important
  },
  customerInvoiceController.update,
);
customerInvoiceRouter.delete("/:id", customerInvoiceController.delete);

export default customerInvoiceRouter;
