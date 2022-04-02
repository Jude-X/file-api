import Router from "@koa/router";
import { linkController } from "./controllers/linkController";
import { healthCheck } from "./controllers/healthCheckController";
import { uploadController } from "./controllers/uploadController";
import * as multer from "@koa/multer";
const upload = multer.default({
  dest: "uploads/",
});

const router = new Router();

// Health Checks
router.get("/", healthCheck);
// Link Route
router.post("/file/link", linkController);
// Upload Route
// Using Multer to upload files from form-data
router.post("/file/upload", upload.any(), uploadController);

export default router;
