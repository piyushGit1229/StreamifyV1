// src/middleware/multer.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/*
 * ORIGINAL IMPLEMENTATION – PRESERVED FOR REFERENCE
 * URL pathname slicing is platform-sensitive (especially drive letters on
 * Windows). Storage, filtering, naming, and limits are retained below.
 *
 * let __dirname = path.dirname(new URL(import.meta.url).pathname);
 * if (__dirname.startsWith("/")) {
 *   __dirname = __dirname.slice(1);
 * }
 * const tempDir = path.join(__dirname, "..", "uploads", "temp");
 * if (!fs.existsSync(tempDir)) {
 *   fs.mkdirSync(tempDir, { recursive: true });
 *   console.log("Created upload temp folder:", tempDir);
 * }
 * const storage = multer.diskStorage({
 *   destination: (req, file, cb) => cb(null, tempDir),
 *   filename: (req, file, cb) => {
 *     const ext = path.extname(file.originalname);
 *     const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
 *     cb(null, name);
 *   }
 * });
 * const fileFilter = (req, file, cb) => {
 *   if (file.mimetype.startsWith("video/")) cb(null, true);
 *   else cb(new Error("Only video files allowed"), false);
 * };
 * export const uploadVideo = multer({
 *   storage,
 *   fileFilter,
 *   limits: { fileSize: 200 * 1024 * 1024 }
 * });
 */

// NEW IMPLEMENTATION – CROSS-PLATFORM VERSION
// Convert the ESM module URL to a native filesystem path before joining dirs.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "..", "uploads", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log("Created upload temp folder:", tempDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files allowed"), false);
};

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }
});
