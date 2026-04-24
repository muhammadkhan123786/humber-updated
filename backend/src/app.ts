import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import "dotenv/config"; // load env variables

// Import routes
import shopRouter from "./routes/shop.routes";
import authRouter from "./routes/auth.routes";
import {
  adminProtecter,
  technicianProtecter,
} from "./middleware/auth.middleware";
import vehicleBrandRouter from "./routes/vehicleBrand.routes";
import modelRouter from "./routes/vehicleModel.routes";
import aiRoutes from "./routes/ai.routes";
import emailTestRoutes from "./routes/emailTest.routes";

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
import supplierPriceHistoryRoutes from "./routes/supplierPriceHistory.routes";

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

//  Muzamil Hassan start
import purchaseOrderRoutes from "./routes/purchaseOrder.routes";
import grnRoutes from "./routes/grn.routes";
import goodsReturnRoutes from "./routes/goodsReturn.routes";
import documentNumberRoutes from "./routes/document-numbers.routes";
import productRoutes from "./routes/product.routes";
import marketplaceTemplateRoutes from "./routes/marketplace.template.routes";
import marketplaceRoute from "./routes/marketplace-routes/marketplace.routes";
import supplierLedgrRoutes from "./routes/ledger.routes";
import paymentRoutes from "./routes/payment.routes";

import aiTemplateRoutes from "./routes/aiTemplate.routes"

// Muzamil Hassan End
import uploadRoutes from "./routes/upload.routes";
import technicianRouter from "./routes/technician.routes";
import technicianDashboardRouter from "./routes/technician-dashboard/technician.tickets.routes";
import ticketQuotationStatusRouter from "./routes/ticket-quotations/ticket.quotation.status.routes";
import ticketQuotationRouter from "./routes/ticket-quotations/ticket.quotations.routes";
import {
  getDefaultQuotationStatusController,
  getDefaultTaxPercentageController,
} from "./controllers/technician-dashboard-controllers/technician.tickets.controller";
import technicianJobsStatisticsRouter from "./routes/technician-jobs/technician.jobs.statistics";
import technicianDashboardJobsRouter from "./routes/technician-dashboard/technician-jobs/technician.jobs.routes";
import {
  TechnicianCompletedJobCountController,
  technicianDashboardJobsStatisticsController,
  TechnicianProfileController,
  updateTechnicianJobStatusController,
  UpdateTechnicianProfileController,
  updateTechnicianQuotationStatusController,
} from "./controllers/technician-job-statistics/technician.jobs.statistics.controller";
import customerInvoiceRouter from "./routes/customer-job-invoices/customer.invoices.routes";
import { customerInvoiceStatisticsController } from "./controllers/customer-invoice-statistics/customer.invoice.statistics.controller";
import techncianJobsByAdminRouter from "./routes/technician-jobs-by-admin-routes/technician.jobs.by.admin.routes";
import vehicleInspectionsRouter from "./routes/technician-vehicle-inspections-routes/technician.vehicle.inspections.routes";
import jobAssignmentRouter from "./routes/technician-job-assignments/technician.jobs.assignment.routes";
import techncianJobsActivityRouter from "./routes/technician-jobs-activities/technician.jobs.activities.routes";
import riderAvailabilitiesRouter from "./routes/master-data-routes/rider.availabilities.routes";
import technicianActivityMasterRouter from "./routes/technician-jobs-activities-master-routes/technician.jobs.activities.master.routes";
import vehicleTypesRouter from "./routes/master-data-routes/rider.vehicle.types.routes";
import riderRouter from "./routes/rider/rider.routes";
import technicianActionsrouter from "./routes/technician-activities-operations-routes/technicianActivity.routes";
import mobilecustomerSourceRouter from "./routes/mobile-development/customer-source-routes/customer.source.routes";
import MobileCustomerBaseRouter from "./routes/mobile-development/customer-routes/customre.register.mobile.routes";
import labourRateRouter from "./routes/master-data-routes/labour.routes";
import channelRouter from "./routes/communication-channels-integration-routes/channels.routes";
import channelProviderRouter from "./routes/communication-channels-integration-routes/communication.channel.provider.routes";
import channelProviderConfigFieldsRouter from "./routes/communication-channels-integration-routes/channel.provider.config.fields.route";
import clientChannelConfigurationDataRouter from "./routes/communication-channels-integration-routes/client.channel.config.data.routes";
import eventActionRouter from "./routes/communication-channels-integration-routes/Notifications-Setting-Routes/event.action.master.routes";
import notificationTemplateRouter from "./routes/communication-channels-integration-routes/Notifications-Setting-Routes/notification.templates.routes";
import moduleRouter from "./routes/communication-channels-integration-routes/modules.routes";
import notificationRulesRouter from "./routes/communication-channels-integration-routes/Notifications-Setting-Routes/notification.rules.routes";
import moduleActionsRouter from "./routes/communication-channels-integration-routes/actions.routes";
import callTypeRouter from "./routes/call-logs-modules-routes/call.type.routes";
import callStatusRouter from "./routes/call-logs-modules-routes/call.status.routes";
import callLogsRouter from "./routes/call-logs-modules-routes/call.logs.routes";
import inventoryReportsRoutes from "./routes/reports/inventoryReports.routes";
import purchaseReportRoutes from "./routes/reports/purchaseReport.routes";
import supplierReportsRoutes from "./routes/reports/supplierReport.routes"

// Create express app
const app: Application = express();

// Middlewares
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(cors());

// Static files (for uploads/public folder)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static(path.join(__dirname, "../public")));
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
  technicianProtecter,
  ServiceRequestPrioprityRouter,
);
app.use(
  `${process.env.API_PREFIX}/service-request-type`,
  adminProtecter,
  serviceRequestTypeRouter,
);
app.use(
  `${process.env.API_PREFIX}/customers`,
  adminProtecter,
  CustomerBaseRouter,
);
app.use(
  `${process.env.API_PREFIX}/technicians`,
  technicianProtecter,
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
  technicianProtecter,
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

app.use(`${process.env.API_PREFIX}/icons`, adminProtecter, iconsRouter);

//16-02-2026
app.use(`${process.env.API_PREFIX}/suppliers`, adminProtecter, SupplierRouters);

//20-01-2026
app.use(
  `${process.env.API_PREFIX}/contract-types`,
  adminProtecter,
  contractTypeRouter,
);

//23-01-2026
app.use(
  `${process.env.API_PREFIX}/technician-service-types`,
  technicianProtecter,
  technicianServiceTypeRouter,
);

app.use(
  `${process.env.API_PREFIX}/technician-inspection`,
  technicianProtecter,
  technicianInspectionListRouter,
);

app.use(
  `${process.env.API_PREFIX}/technician-job-status`,
  technicianProtecter,
  technicianJobStatusRouter,
);

app.use(
  `${process.env.API_PREFIX}/technician-jobs`,
  technicianProtecter,
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
  technicianProtecter,
  ticketStatusRouter,
);

app.use(
  `${process.env.API_PREFIX}/master-ticket-urgency-technician-dashboard`,
  technicianProtecter,
  ServiceRequestPrioprityRouter,
);

//05-02-2026
app.use(
  `${process.env.API_PREFIX}/ticket-quotation-status`,
  technicianProtecter,
  ticketQuotationStatusRouter,
);

app.use(
  `${process.env.API_PREFIX}/quotations`,
  technicianProtecter,
  autoCodeGeneratorRouter,
);

app.use(
  `${process.env.API_PREFIX}/technician-ticket-quotation`,
  ticketQuotationRouter,
);

//09-02-2026
app.use(
  `${process.env.API_PREFIX}/master-parts-technician-dashboard`,
  technicianProtecter,
  partsRouter,
);

//10-02-2026
app.get(
  `${process.env.API_PREFIX}/default-tax`,
  technicianProtecter,
  getDefaultTaxPercentageController,
);

//default quotation api
app.get(
  `${process.env.API_PREFIX}/default-quotation-status`,
  technicianProtecter,
  getDefaultQuotationStatusController,
);

app.get(
  `${process.env.API_PREFIX}/test-mobile-access`,
  adminProtecter,
  (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ status: true, message: "Mobile Access Successfully." });
  },
);

// 11-02-2026
app.use(
  `${process.env.API_PREFIX}/job-statistics`,
  adminProtecter,
  technicianJobsStatisticsRouter,
);

//12-02-2026
app.use(
  `${process.env.API_PREFIX}/technician-dashboard-jobs`,
  technicianProtecter,
  technicianDashboardJobsRouter,
);

//13-02-2026
app.get(
  `${process.env.API_PREFIX}/technician-dashboard-jobs-statistics`,
  technicianProtecter,
  technicianDashboardJobsStatisticsController,
);

app.put(
  `${process.env.API_PREFIX}/update-technician-quotation-status`,
  technicianProtecter,
  updateTechnicianQuotationStatusController,
);

//16-02-2026
app.use(
  `${process.env.API_PREFIX}/customer-invoices`,
  adminProtecter,
  customerInvoiceRouter,
);

app.put(
  `${process.env.API_PREFIX}/update-technician-job-status`,
  technicianProtecter,
  updateTechnicianJobStatusController,
);

//total technician completed jobs.
app.put(
  `${process.env.API_PREFIX}/technician-job-completed-count`,
  technicianProtecter,
  TechnicianCompletedJobCountController,
);

//17-02-2026
app.get(
  `${process.env.API_PREFIX}/technician-profile`,
  technicianProtecter,
  TechnicianProfileController,
);

app.put(
  `${process.env.API_PREFIX}/update-technician-profile`,
  technicianProtecter,
  UpdateTechnicianProfileController,
);

//18-02-2026
app.get(
  `${process.env.API_PREFIX}/customer-invoices-statistics`,
  adminProtecter,
  customerInvoiceStatisticsController,
);

//20-02-2026
app.use(
  `${process.env.API_PREFIX}/technician-job-by-admin`,
  techncianJobsByAdminRouter,
);

app.use(
  `${process.env.API_PREFIX}/technician-vehicle-inspections`,
  technicianProtecter,
  vehicleInspectionsRouter,
);

//24-02-2026
app.use(
  `${process.env.API_PREFIX}/technician-job-assignments`,
  technicianProtecter,
  jobAssignmentRouter,
);

//25-02-2026
app.use(
  `${process.env.API_PREFIX}/technician-parts-installation`,
  technicianProtecter,
  techncianJobsActivityRouter,
);

//27-02-2026
app.use(
  `${process.env.API_PREFIX}/rider-availabilities`,
  adminProtecter,
  riderAvailabilitiesRouter,
);

app.use(
  `${process.env.API_PREFIX}/technician-job-activities`,
  technicianProtecter,
  technicianActivityMasterRouter,
);

//02-03-2026
app.use(
  `${process.env.API_PREFIX}/rider-vehicle-types`,
  adminProtecter,
  vehicleTypesRouter,
);

app.use(`${process.env.API_PREFIX}/riders`, adminProtecter, riderRouter);

app.use(
  `${process.env.API_PREFIX}/technician-work`,
  technicianProtecter,
  technicianActionsrouter,
);

//03-03-2026
app.use(
  `${process.env.API_PREFIX}/mobile-customer-sources`,
  mobilecustomerSourceRouter,
);

app.use(
  `${process.env.API_PREFIX}/mobile-customer-register`,
  MobileCustomerBaseRouter,
);

//09-03-2026
app.use(
  `${process.env.API_PREFIX}/labour`,
  technicianProtecter,
  labourRateRouter,
);

//11-03-2026
app.use(`${process.env.API_PREFIX}/channels`, channelRouter);

app.use(
  `${process.env.API_PREFIX}/channel-providers`,
  // adminProtecter,
  channelProviderRouter,
);

app.use(
  `${process.env.API_PREFIX}/channel-providers-fields`,
  // adminProtecter,
  channelProviderConfigFieldsRouter,
);

// 12-03-2026
app.use(
  `${process.env.API_PREFIX}/client-channel-config-data`,
  adminProtecter,
  clientChannelConfigurationDataRouter,
);

//16-03-2026
app.use(
  `${process.env.API_PREFIX}/event-action`,
  // adminProtecter,
  eventActionRouter,
);

app.use(
  `${process.env.API_PREFIX}/notification-templates`,
  adminProtecter,
  notificationTemplateRouter,
);

//17-03-2026
app.use(
  `${process.env.API_PREFIX}/modules`,
  // adminProtecter,
  moduleRouter,
);

app.use(
  `${process.env.API_PREFIX}/notification-rules`,
  adminProtecter,
  notificationRulesRouter,
);

//26-03-2026
app.use(
  `${process.env.API_PREFIX}/module-actions`,
  //adminProtecter,
  moduleActionsRouter,
);

// 01-04-2026 
app.use(
  `${process.env.API_PREFIX}/call-types`,
  adminProtecter,
  callTypeRouter,
);

app.use(
  `${process.env.API_PREFIX}/call-status`,
  adminProtecter,
  callStatusRouter,
);

app.use(
  `${process.env.API_PREFIX}/call-logs`,
  adminProtecter,
  callLogsRouter,
);



//Muhammad Imran code ended here.

//  Muzmil Hassan 8/1/2026

app.use(
  `${process.env.API_PREFIX}/product-attributes`,
  adminProtecter,
  productAttributesRoutes,
);

app.use(`${process.env.API_PREFIX}/products`, adminProtecter, productRoutes);

app.use(`${process.env.API_PREFIX}/ai`, adminProtecter, aiRoutes);

app.use(
  `${process.env.API_PREFIX}/purchase-orders`,
  adminProtecter,
  purchaseOrderRoutes,
);

app.use(`${process.env.API_PREFIX}/grn`, adminProtecter, grnRoutes);

app.use(
  `${process.env.API_PREFIX}/goods-return-notice`,
  adminProtecter,
  goodsReturnRoutes,
);

app.use(
  `${process.env.API_PREFIX}/marketplace-templates`,
  adminProtecter,
  marketplaceTemplateRoutes,
);

// app.use(`${process.env.API_PREFIX}/marketplace`, marketplaceRoute);
app.use(
  `${process.env.API_PREFIX}/document-numbers`,
  adminProtecter,
  documentNumberRoutes,
);
app.use(`${process.env.API_PREFIX}/upload`, adminProtecter, uploadRoutes);
app.use(
  `${process.env.API_PREFIX}/marketplace`,
  adminProtecter,
  marketplaceRoute,
);
app.use(
  `${process.env.API_PREFIX}/test/email`,
  adminProtecter,
  emailTestRoutes,
);
app.use(
  `${process.env.API_PREFIX}/supplier-price-history`,
  adminProtecter,
  supplierPriceHistoryRoutes,
);
app.use(
  `${process.env.API_PREFIX}/supplier-ledger`,
  adminProtecter,
  supplierLedgrRoutes,
);

app.use(
  `${process.env.API_PREFIX}/supplier-payment`,
  adminProtecter,
  paymentRoutes,
);


app.use(
  `${process.env.API_PREFIX}/ai-templates`,
    aiTemplateRoutes,
);

app.use(`${process.env.API_PREFIX}/reports/inventory`, inventoryReportsRoutes);
app.use(`${process.env.API_PREFIX}/reports/purchase`, purchaseReportRoutes);
app.use(`${process.env.API_PREFIX}/reports/supplier`, supplierReportsRoutes);


// Muzamil Hassan end
// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});


app.get("/api/ai-test", (req, res) => {
  res.json({ message: "AI test working" });
});




export default app;

