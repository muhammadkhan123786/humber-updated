// routes/product.routes.ts
import { createProductValidation } from '../schemas/product.schema';
import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { ProductDoc, ProductModal } from '../models/product.models';
import { AdvancedGenericController } from "../controllers/GenericController";
import { createUploader } from "../config/multer";
import { mapUploadedFilesToBody } from "../middleware/mapUploadedFiles";

const productRoutes = Router();

const productsBaseService = new GenericService<ProductDoc>(ProductModal);

// ✅ Configure controller with category population
const productController = new AdvancedGenericController({
    service: productsBaseService,
    populate: [
        "userId",
        {
            path: "categoryId",
            select: "_id categoryName level parentId",
            model: "Category"
        },
        // Populate the entire category path
        {
            path: "categoryPath",
            select: "_id categoryName level parentId",
            model: "Category"
        }
    ],
    validationSchema: createProductValidation,
    searchFields: [
        "productName",
        "sku",
        "barcode",
        "brand",
        "manufacturer",
        "modelNumber",
        "description",
        "shortDescription",
        "tags",
        "keywords"
    ]
});

// ✅ Create uploader for product images
const productUpload = createUploader([
    {
        name: "images", // This should match your frontend field name
        maxCount: 10, // Maximum 10 images per product
        mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    },
    // You can add more fields if needed
    {
        name: "featuredImage",
        maxCount: 1,
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    },
    {
        name: "thumbnail",
        maxCount: 1,
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }
]);

// ✅ Routes with upload middleware
productRoutes.get("/", productController.getAll);

productRoutes.get("/:id", productController.getById);

// ✅ POST route with image upload
productRoutes.post(
    "/",
    productUpload,
    mapUploadedFilesToBody(
        "/uploads", // Base path for uploaded files
        { 
            images: "images", // Map "images" field to "images" in body
            featuredImage: "featuredImage",
            thumbnail: "thumbnail"
        },
        ["featuredImage", "thumbnail"] // These are single fields
    ),
    productController.create
);

// ✅ PUT route with image upload
productRoutes.put(
    "/:id",
    productUpload,
    mapUploadedFilesToBody(
        "/uploads",
        { 
            images: "images",
            featuredImage: "featuredImage",
            thumbnail: "thumbnail"
        },
        ["featuredImage", "thumbnail"]
    ),
    productController.update
);

productRoutes.delete("/:id", productController.delete);

export default productRoutes;