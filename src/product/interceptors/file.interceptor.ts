import { Injectable, UnsupportedMediaTypeException } from "@nestjs/common";
import { MulterOptionsFactory, MulterModuleOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Injectable()
export class UploadFilesInterceptor implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: "./src/uploads/products",
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { files: 5, fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new UnsupportedMediaTypeException("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
    };
  }
}
