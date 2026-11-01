// src/utils/ffmpegThumbnail.js
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

/*
 * ORIGINAL IMPLEMENTATION – PRESERVED FOR REFERENCE
 * The former implementation selected a machine-specific Windows ffprobe and
 * relied on the temp directory already existing. The metadata and thumbnail
 * logic is retained in the cross-platform implementation below.
 *
 * ffmpeg.setFfmpegPath(ffmpegPath);
 * ffmpeg.setFfprobePath("C:/ffmpeg/ffmpeg-8.0.1-essentials_build/bin/ffprobe.exe");
 *
 * export const generateThumbnailAndMetadata = (filePath) => {
 *   return new Promise((resolve, reject) => {
 *     ffmpeg.ffprobe(filePath, (err, metadata) => {
 *       if (err) return reject(err);
 *       const { duration } = metadata.format;
 *       const stream = metadata.streams.find((s) => s.codec_type === "video");
 *       const width = stream ? stream.width : null;
 *       const height = stream ? stream.height : null;
 *       const thumbName = `${Date.now()}-thumb.png`;
 *       const thumbPath = path.join(process.cwd(), "src", "uploads", "temp", thumbName);
 *       const atTime = Math.min(2, Math.floor(duration / 2) || 1);
 *       ffmpeg(filePath)
 *         .screenshots({ timestamps: [atTime], filename: thumbName,
 *           folder: path.dirname(thumbPath), size: "640x?" })
 *         .on("end", async () => {
 *           try {
 *             await fs.access(thumbPath);
 *             resolve({ thumbnailPath: thumbPath, duration: Math.floor(duration), width, height });
 *           } catch (e) { reject(e); }
 *         })
 *         .on("error", (e) => reject(e));
 *     });
 *   });
 * };
 */

// NEW IMPLEMENTATION – CROSS-PLATFORM VERSION
// Use package binaries and resolve the shared temp directory from this module,
// independent of the process working directory; create it before use.
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(moduleDir, "..", "uploads", "temp");

export const generateThumbnailAndMetadata = async (filePath) => {
  await fs.mkdir(tempDir, { recursive: true });

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);

      const { duration } = metadata.format;
      const stream = metadata.streams.find((s) => s.codec_type === "video");
      const width = stream ? stream.width : null;
      const height = stream ? stream.height : null;
      const thumbName = `${Date.now()}-thumb.png`;
      const thumbPath = path.join(tempDir, thumbName);
      const atTime = Math.min(2, Math.floor(duration / 2) || 1);

      ffmpeg(filePath)
        .screenshots({
          timestamps: [atTime],
          filename: thumbName,
          folder: path.dirname(thumbPath),
          size: "640x?"
        })
        .on("end", async () => {
          try {
            await fs.access(thumbPath);
            resolve({
              thumbnailPath: thumbPath,
              duration: Math.floor(duration),
              width,
              height
            });
          } catch (e) {
            reject(e);
          }
        })
        .on("error", (e) => reject(e));
    });
  });
};
