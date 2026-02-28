import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";

const uploadRoot = path.resolve(process.cwd(), env.uploadDir);
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }
});

export const toPublicFilePath = (filename) => `${path.basename(env.uploadDir)}/${filename}`.replace(/\\/g, "/");