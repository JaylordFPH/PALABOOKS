import path from "path";
import fs from "fs";

export const testUploadMutation = {
    Mutation: {
        singleUpload: async (_: unknown, {file}) => {
            const {createReadStream, filename, mimetype, encoding} = await file;
            const stream = createReadStream();
            const pathName = path.join(__dirname, `../public/images/${filename}`);
            await new Promise((resolver, reject) => {
                stream.pipe(fs.createWriteStream(pathName))
                  .on("finish", resolver)
                  .on("error", reject)
            });
            

            return {
                url: `http://localhost:4000/images/${filename}`,
            }
        }
    }
}