import imagekit from "../config/imagekit.js";

export const uploadImage = async (file, folder) => {
  if (!file) {
    throw new Error("File is required");
  }

  if (!folder) {
    throw new Error("Upload folder is required");
  }

  const result = await imagekit.files.upload({
    file: file.buffer.toString("base64"),
    fileName: `${Date.now()}-${file.originalname}`,
    folder: `/lab-sync/${folder}`,
  });

  return {
    url: result.url,
    fileId: result.fileId,
  };
};

export const deleteImage = async (fileId) => {
  if (!fileId) {
    throw new Error("File ID is required");
  }

  return await imagekit.files.delete(fileId);
};