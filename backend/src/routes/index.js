import express from "express";
import accountRoute from "./accountRoute.js";
import authRoute from "./authRoute.js";
import categoryRoute from "./categoryRoute.js";
import brandRoute from "./brandRoute.js";
import supplierRoute from "./supplierRoute.js";
import importingRoute from "./importingRoute.js";
import customerRoute from "./customerRoute.js";
import cartRoute from "./cartRoute.js";
import orderRoute from "./orderRoute.js";
import voucherRoute from "./voucherRoute.js";
import shippingRoute from "./shippingRoute.js";
import saleEventRoute from "./saleEventRoute.js";
import productRoute from "./productRoute.js";

const router = express.Router();

router.use("/accounts", accountRoute);
router.use("/auth", authRoute);
router.use("/categories", categoryRoute);
router.use("/brands", brandRoute);
router.use("/suppliers", supplierRoute);
router.use("/importings", importingRoute);
router.use("/customers", customerRoute);
router.use("/carts", cartRoute);
router.use("/orders", orderRoute);
router.use("/vouchers", voucherRoute);
router.use("/shipping", shippingRoute);
router.use("/sale-events", saleEventRoute);
router.use("/products", productRoute);

export default router;
