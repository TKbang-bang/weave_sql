import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const processImage = async (req, res, next) => {
  try {
    // verifying if the file does exist
    if (!req.file) {
      return next();
    }

    // skip if the file is not an image
    if (!req.file.mimetype.startsWith("image/")) {
      return next();
    }

    // getting the path of the emage
    const originalPath = req.file.path;

    const webpPath = path.join(
      path.dirname(originalPath),
      `${path.parse(originalPath).name}.webp`,
    );

    await sharp(originalPath)
      .webp({
        quality: 80,
      })
      .toFile(webpPath);

    // Eliminar el archivo original
    await fs.unlink(originalPath);

    // Actualizar req.file para que el controller
    // tenga la información del nuevo archivo
    req.file.path = webpPath;
    req.file.filename = path.basename(webpPath);
    req.file.mimetype = "image/webp";

    return next();
  } catch (error) {
    next(error);
  }
};

export default processImage;
