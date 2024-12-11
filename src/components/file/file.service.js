import fs from "fs";
import File from "../../../lib/service/src/model/file/file.js";
import response from "../../../lib/shared/src/http/response.js";
import util from "../../../lib/shared/src/util/util.js";
import CommonService from "../../../lib/shared/src/sequelize/common.service.js";
import path from "path";  // Add path module for file handling

class FileService extends CommonService {
  constructor() {
    super({ model: File });
  }

  // Upload a file
  uploadFile = async (req, res, next) => {
    try {
      const { mimetype, filename, size } = req.file;
      const { id } = req.user;
      const file = await this.create({
        userId: id,
        name: req.file.filename,
        extension: util.getExtension(filename),
        mimetype: mimetype,
        size: size,
      });
      return res.json(file);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  // Get all files for the authenticated user
  getFiles = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const files = await this.findAll({ userId });
      return res.json(files);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  // Get a specific file by ID
  getFileById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const file = await this.findOne({ id, userId });

      if (!file) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: "File not found",
          code: responseStatus,
        });
        return res.status(responseStatus).json(data);
      }
      return res.json(file);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  // Download a specific file by ID
  downloadFileById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const file = await this.findOne({ id, userId });

      if (!file) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: "File not found",
          code: responseStatus,
        });
        return res.status(responseStatus).json(data);
      }

      const filePath = path.join(process.cwd(), "public", "files", file.name);
      res.download(filePath, file.name, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: "Error while downloading the file",
          });
        }
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  // Update a file by ID
  updateFileById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const file = await this.findOne({ id, userId });

      if (!file) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: "File not found",
          code: responseStatus,
        });
        return res.status(responseStatus).json(data);
      }

      if (req.file) {
        const filePath = `${process.cwd()}/public/files/${file.name}`;
        await fs.unlink(filePath, async (err) => {
          if (err) {
            const responseStatus = response.status.BAD_REQUEST;
            const data = response.dispatch({
              error: "Error removing old file",
              code: responseStatus,
            });
            return res.status(responseStatus).json(data);
          }
        });
      }

      const { mimetype, filename, size } = req.file;
      const fileUp = await this.update(
        {
          id,
          userId,
        },
        {
          mimetype,
          name: req.file.filename,
          size,
          extension: util.getExtension(filename),
        }
      );
      return res.json(fileUp);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  // Delete a file by ID
  deleteFileById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;

      const file = await this.findOne({ id, userId });
      if (!file) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: "File not found",
          code: responseStatus,
        });
        return res.status(responseStatus).json(data);
      }

      const filePath = `${process.cwd()}/public/files/${file.name}`;
      await this.remove({ id });
      fs.unlink(filePath, async (err) => {
        if (err) {
          const responseStatus = response.status.BAD_REQUEST;
          const data = response.dispatch({
            error: "Error removing file",
            code: responseStatus,
          });
          return res.status(responseStatus).json(data);
        } else {
          const responseStatus = response.status.OK;
          const data = response.dispatch({
            message: "Successfully deleted the file.",
            code: responseStatus,
          });
          return res.status(responseStatus).json(data);
        }
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export default new FileService();
