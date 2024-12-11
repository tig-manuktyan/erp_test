import express from "express";
import fileCtr from "./file.service.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import Upload from "../../../lib/shared/src/uploadFile/index.js";

const upload = new Upload("public/files");
const fileRouter = express.Router();

fileRouter.get("/list", authMiddleware, fileCtr.getFiles);
fileRouter.get("/:id", authMiddleware, fileCtr.getFileById);
fileRouter.get("/download/:id", authMiddleware, fileCtr.downloadFileById);
fileRouter.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  fileCtr.uploadFile
);
fileRouter.put(
  "/update/:id",
  authMiddleware,
  upload.single("file"),

  fileCtr.updateFileById
);
// fileRouter.delete("/delete/:id", authMiddleware, fileCtr.deleteFileById);

export default fileRouter;
