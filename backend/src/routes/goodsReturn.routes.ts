import { Router } from "express";
import { AdvancedGenericController } from "../controllers/GenericController";
import { GenericService } from "../services/generic.crud.services";
import { GoodsReturn, GoodsReturnDoc } from "../models/goodsReturn.model";
import { CreateGoodsReturnValidation } from "../schemas/goodsReturn.schema";
import { exportGRTNToPDF } from "../controllers/pdf.controller"

const goodsReturnRoutes = Router();

const goodsReturnService = new GenericService<GoodsReturnDoc>(GoodsReturn);

const goodsReturnController = new AdvancedGenericController({
  service: goodsReturnService,  
  populate: [
    "userId",
    {
      path: "grnId",
      select: "grnNumber items purchaseOrderId", 
      populate: {
        path: "purchaseOrderId",
        select: "items supplier",
        populate: {
          path: "supplier",
          select: "contactInformation", 
        },
      },
    },
  ],
  validationSchema: CreateGoodsReturnValidation,
});

goodsReturnRoutes.get("/export/:id", exportGRTNToPDF);

goodsReturnRoutes.get("/", goodsReturnController.getAll);
goodsReturnRoutes.get("/:id", goodsReturnController.getById);
goodsReturnRoutes.post("/", goodsReturnController.create);
goodsReturnRoutes.put("/:id", goodsReturnController.update);
goodsReturnRoutes.delete("/:id", goodsReturnController.delete);

export default goodsReturnRoutes;
