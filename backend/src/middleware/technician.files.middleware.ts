import { NextFunction, Request } from "express";

export const technicianFilesMiddleware = (req: Request, res: Response, next: NextFunction) => {

    try {
        const files = req.files as {
            profilePic?: Express.Multer.File[];
            documents?: Express.Multer.File[];
        };

        req.body.profilePic = files.profilePic?.[0]?.path;
        req.body.documents = files.documents?.map(f => f.path);

        next();

    }
    catch (error: any) {
        console.log(`Upload middleware error. ${error.message}`);
    }

}