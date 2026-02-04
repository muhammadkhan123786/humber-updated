import express, { Application } from "express";
import cors from "cors";
import path from "path";
import "dotenv/config"; // load env variables

// Import routes
import shopRouter from "./routes/shop.routes";
import authRouter from "./routes/auth.routes";
import { adminProtecter, technicianMasterProtector, technicianProtecter } from "./middleware/auth.middleware";
import vehicleBrandRouter from "./routes/vehicleBrand.routes";
import modelRouter from "./routes/vehicleModel.routes";
import aiRoutes from './routes/ai.routes';

import customerSourceRouter from "./routes/customer.source.routes";
import repairStatusRouter from "./routes/repair.status.routes";
import serviceTypeMasterRouter from "./routes/services.types.master.routes";
import subServiceRouter from "./routes/subServices.routes";
import cityRouter from "./routes/city.routes";
import countryRouter from "./routes/country.routes";
import addressRouter from "./routes/addresses.routes";
import TechnicianRoleRouter from "./routes/technician.roles.routes";
import ServiceZoneRouter from "./routes/service.zones.routes";
import ServiceRequestPrioprityRouter from "./routes/service.request.prioprity.routes";
import serviceRequestTypeRouter from "./routes/service.request.types.routes";
import CustomerBaseRouter from "./routes/customer.routes";
import currecyRouter from "./routes/currency.routes";
import paymentTermRouter from "./routes/payment.terms.routes";
import orderStatusRouter from "./routes/order.status.rotues";
import productChannelsRouter from "./routes/product.channel.routes";
import productSourceRouter from "./routes/product.source.routes";
import proposedActionsRouter from "./routes/proposed.actions.routes";
import ItemsConditionsRouter from "./routes/items.conditions.routes";
import taxRouter from "./routes/tax.routes";
import categoryRouter from "./routes/category.routes";
import venderRouter from "./routes/vender.routes";
import unitRouter from "./routes/units.routes";
import warehouseStatusRouter from "./routes/warehouse.status.routes";
import warehouseRouter from "./routes/warehouse.routes";
import colorRouter from "./routes/color.routes";
import sizeRouter from "./routes/size.routes";
import ticketStatusRouter from "./routes/ticket-management-system-routes/ticket.status.routes";
import productBaseRouter from "./routes/product.base.routes";
import departmentRouter from "./routes/ticket-management-system-routes/department.routes";
import ticketTypesRouter from "./routes/ticket-management-system-routes/ticket.types.routes";
import ticketActionsRouter from "./routes/ticket-management-system-routes/ticket.actions.routes";
import ticketStatusTransitionRouter from "./routes/ticket-management-system-routes/ticket.status.transition.routes";
import ticketReferenceTypesRouter from "./routes/ticket-management-system-routes/ticket.reference.types.routes";
import documentTypesRouter from "./routes/document.types.routes";
import jobTypesRouter from "./routes/job.types.routes";

//  Muzamil Hassan 8/1/2026

import productAttributesRoutes from "./routes/product.attributes";
import customerVehicleRouter from "./routes/customer.vehicle.routes";
import customerTicketBaseRouter from "./routes/ticket-management-system-routes/customer.ticket.base.routes";
import businessTypeRouter from "./routes/suppliers/business.types.routes";
import paymentMethodRouter from "./routes/suppliers/payment.method.routes";
import pricingAgreementRouter from "./routes/suppliers/pricing.agreement.routes";
import productServicesRouter from "./routes/suppliers/product.services.routes";
import jobTitleRouter from "./routes/master-data-routes/job.titles.routes";
import iconsRouter from "./routes/master-data-routes/icons.routes";
import SupplierRouters from "./routes/suppliers/supplier.routes";
import contractTypeRouter from "./routes/master-data-routes/contract.types.routes";
import techniciansRouter from "./routes/technicians/technicians.routes";
import technicianServiceTypeRouter from "./routes/master-data-routes/technician.service.types.routes";
import technicianInspectionListRouter from "./routes/master-data-routes/technician.inspection.list.routes";
import technicianJobStatusRouter from "./routes/master-data-routes/technician.jobs.status.routes";
import technicianJobsRouter from "./routes/technician-jobs/technician.jobs.routes";
import autoCodeGeneratorRouter from "./routes/auto-code-generator/auto.code.generator.routes";
import driverRouter from "./routes/driver/driver.routes";
import otpRouter from "./routes/otp-routes/mobile.otp.routes";
import ticketDecisionRouter from "./routes/master-data-routes/ticket.decision.routes";
import partsRouter from "./routes/master-data-routes/parts.routes";
import insuranceCompaniesRouter from "./routes/master-data-routes/insurance.companies.routes";


import purchaseOrderRoutes from "./routes/purchaseOrder.routes";
import grnRoutes from "./routes/grn.routes";
import goodsReturnRoutes from "./routes/goodsReturn.routes";
import documentNumberRoutes from "./routes/document-numbers.routes";
import productRoutes from "./routes/product.routes";
import marketplaceTemplateRoutes from "./routes/marketplace.template.routes";
import technicianRouter from "./routes/technician.routes";
import technicianDashboardRouter from "./routes/technician-dashboard/technician.tickets.routes";


// Create express app
const app: Application = express();

// Middlewares
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(cors());

// Static files (for uploads/public folder)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use(`${process.env.API_PREFIX}/auth`, authRouter);
app.use(`${process.env.API_PREFIX}/register`, shopRouter);
app.use(
  `${process.env.API_PREFIX}/vehiclebrand`,
  adminProtecter,
  vehicleBrandRouter,
);
app.use(`${process.env.API_PREFIX}/vechilemodel`, adminProtecter, modelRouter);
app.use(
  `${process.env.API_PREFIX}/repairstatus`,
  adminProtecter,
  repairStatusRouter,
);
app.use(
  `${process.env.API_PREFIX}/service-types-master`,
  adminProtecter,
  serviceTypeMasterRouter,
);
app.use(
  `${process.env.API_PREFIX}/sub-services`,
  adminProtecter,
  subServiceRouter,
);
app.use(`${process.env.API_PREFIX}/city`, adminProtecter, cityRouter);
app.use(`${process.env.API_PREFIX}/country`, adminProtecter, countryRouter);
app.use(
  `${process.env.API_PREFIX}/customer-source`,
  adminProtecter,
  customerSourceRouter,
);
app.use(`${process.env.API_PREFIX}/addresses`, adminProtecter, addressRouter);
app.use(
  `${process.env.API_PREFIX}/technician-roles`,
  adminProtecter,
  TechnicianRoleRouter,
);
app.use(
  `${process.env.API_PREFIX}/services-zones`,
  adminProtecter,
  ServiceZoneRouter,
);
app.use(
  `${process.env.API_PREFIX}/service-request-prioprity-level`,
  adminProtecter,
  ServiceRequestPrioprityRouter,
);
app.use(
  `${process.env.API_PREFIX}/service-request-type`,
  adminProtecter,
  serviceRequestTypeRouter,
);
app.use(`${process.env.API_PREFIX}/customers`, CustomerBaseRouter);
app.use(
  `${process.env.API_PREFIX}/technicians`,
  adminProtecter,
  techniciansRouter,
);
app.use(`${process.env.API_PREFIX}/currencies`, adminProtecter, currecyRouter);
app.use(
  `${process.env.API_PREFIX}/payment-terms`,
  adminProtecter,
  paymentTermRouter,
);
app.use(
  `${process.env.API_PREFIX}/order-status`,
  adminProtecter,
  orderStatusRouter,
);
app.use(
  `${process.env.API_PREFIX}/product-channels`,
  adminProtecter,
  productChannelsRouter,
);
app.use(
  `${process.env.API_PREFIX}/product-source`,
  adminProtecter,
  productSourceRouter,
);
app.use(
  `${process.env.API_PREFIX}/proposed-actions`,
  adminProtecter,
  proposedActionsRouter,
);
app.use(
  `${process.env.API_PREFIX}/items-conditions`,
  adminProtecter,
  ItemsConditionsRouter,
);
app.use(`${process.env.API_PREFIX}/tax`, adminProtecter, taxRouter);
app.use(`${process.env.API_PREFIX}/units`, adminProtecter, unitRouter);
app.use(`${process.env.API_PREFIX}/categories`, adminProtecter, categoryRouter);
app.use(`${process.env.API_PREFIX}/venders`, adminProtecter, venderRouter);
app.use(
  `${process.env.API_PREFIX}/warehouse-status`,
  adminProtecter,
  warehouseStatusRouter,
);
app.use(
  `${process.env.API_PREFIX}/warehouses`,
  adminProtecter,
  warehouseRouter,
);
app.use(`${process.env.API_PREFIX}/colors`, adminProtecter, colorRouter);
app.use(`${process.env.API_PREFIX}/sizes`, adminProtecter, sizeRouter);
app.use(
  `${process.env.API_PREFIX}/product-base`,
  adminProtecter,
  productBaseRouter,
);

//ticket management system by Muhammad Imran 01-07-2026

//mast data routes.
app.use(
  `${process.env.API_PREFIX}/ticket-status`,
  adminProtecter,
  ticketStatusRouter,
);
app.use(
  `${process.env.API_PREFIX}/departments`,
  adminProtecter,
  departmentRouter,
);
app.use(
  `${process.env.API_PREFIX}/ticket-types`,
  adminProtecter,
  ticketTypesRouter,
);
app.use(
  `${process.env.API_PREFIX}/ticket-actions`,
  adminProtecter,
  ticketActionsRouter,
);

//transition forms 01-07-2026
app.use(
  `${process.env.API_PREFIX}/ticket-transition-setup`,
  adminProtecter,
  ticketStatusTransitionRouter,
);

//master data routes 08-01-2026
app.use(
  `${process.env.API_PREFIX}/ticket-reference-types`,
  adminProtecter,
  ticketReferenceTypesRouter,
);

//master data routes 09-01-2026
app.use(
  `${process.env.API_PREFIX}/document-types`,
  adminProtecter,
  documentTypesRouter,
);
app.use(`${process.env.API_PREFIX}/job-types`, adminProtecter, jobTypesRouter);

//vehicle register api 13-01-2026
app.use(
  `${process.env.API_PREFIX}/customer-vehicle-register`,
  adminProtecter,
  customerVehicleRouter,
);

//ticket generate routes 14-01-2026

app.use(
  `${process.env.API_PREFIX}/customer-tickets`,
  adminProtecter,
  customerTicketBaseRouter,
);

app.use(
  `${process.env.API_PREFIX}/business-types`,
  adminProtecter,
  businessTypeRouter,
);

app.use(
  `${process.env.API_PREFIX}/payment-method`,
  adminProtecter,
  paymentMethodRouter,
);

app.use(
  `${process.env.API_PREFIX}/pricing-agreement`,
  adminProtecter,
  pricingAgreementRouter,
);

app.use(
  `${process.env.API_PREFIX}/product-services`,
  adminProtecter,
  productServicesRouter,
);
// 15-01-2026 Muhammad Imran
app.use(`${process.env.API_PREFIX}/job-titles`, adminProtecter, jobTitleRouter);

app.use(`${process.env.API_PREFIX}/icons`, iconsRouter);

//16-02-2026
app.use(`${process.env.API_PREFIX}/suppliers`, SupplierRouters);

//20-01-2026
app.use(
  `${process.env.API_PREFIX}/contract-types`,
  adminProtecter,
  contractTypeRouter,
);

//23-01-2026 
app.use(
  `${process.env.API_PREFIX}/technician-service-types`,
  adminProtecter,
  technicianServiceTypeRouter,
);

app.use(
  `${process.env.API_PREFIX}/technician-inspection`,
  adminProtecter,
  technicianInspectionListRouter,
);


app.use(
  `${process.env.API_PREFIX}/technician-job-status`,
  adminProtecter,
  technicianJobStatusRouter,
);

app.use(
  `${process.env.API_PREFIX}/technician-jobs`,
  adminProtecter,
  technicianJobsRouter,
);

//26-01-2026 
app.use(
  `${process.env.API_PREFIX}/auto-generate-codes`,
  adminProtecter,
  autoCodeGeneratorRouter,

);

app.use(
  `${process.env.API_PREFIX}/register-driver`,
  // adminProtecter,
  driverRouter,

);

//27-01-2026 
app.use(
  `${process.env.API_PREFIX}/forget-password`,
  //adminProtecter,
  otpRouter,

);

//29-01-2026
app.use(
  `${process.env.API_PREFIX}/ticket-decision`,
  adminProtecter,
  ticketDecisionRouter,

);

app.use(
  `${process.env.API_PREFIX}/mobility-parts`,
  adminProtecter,
  partsRouter,
);

//30-01-2026
app.use(
  `${process.env.API_PREFIX}/insurance-companies`,
  adminProtecter,
  insuranceCompaniesRouter,

);

//03-02-2026 
app.use(
  `${process.env.API_PREFIX}/technician-dashboard`,
  technicianProtecter,
  technicianDashboardRouter,

);

//04-02-2026
app.use(
  `${process.env.API_PREFIX}/master-ticket-status-technician-dashboard`,
  technicianMasterProtector,
  ticketStatusRouter,
);

app.use(
  `${process.env.API_PREFIX}/master-ticket-urgency-technician-dashboard`,
  technicianMasterProtector,
  ServiceRequestPrioprityRouter,
);


//Muhammad Imran code ended here.

//  Muzmil Hassan 8/1/2026

app.use(
  `${process.env.API_PREFIX}/product-attributes`,
  adminProtecter,
  productAttributesRoutes,
);

app.use(
  `${process.env.API_PREFIX}/products`,
  productRoutes,
);

app.use(
  `${process.env.API_PREFIX}/ai`,

  aiRoutes,
);

app.use(
  `${process.env.API_PREFIX}/purchase-orders`,

  purchaseOrderRoutes,
);


app.use(
  `${process.env.API_PREFIX}/grn`,

  grnRoutes,
);

app.use(
  `${process.env.API_PREFIX}/goods-return-notice`,

  goodsReturnRoutes,
);

app.use(
  `${process.env.API_PREFIX}/marketplace-templates`,
  marketplaceTemplateRoutes,
)

app.use(`${process.env.API_PREFIX}/document-numbers`, documentNumberRoutes);

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
