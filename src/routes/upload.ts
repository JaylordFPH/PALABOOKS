// import express from 'express';
// import multer from 'multer';
// import { createClient } from '@supabase/supabase-js'
// import { verifyAccessToken } from '../services/jwtUtils';
// import { prisma } from '../lib/prismaConn';
// import { TokenExpiredError } from 'jsonwebtoken';
// import { slugify } from '../utils/slugify';

// export const uploadRouter = express.Router();
// const supabase =  createClient(process.env.PROJECT_URL!, process.env.ANON_KEY_SECRET!);
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
// });

// uploadRouter.post('/', upload.single('file'), async (req, res) => {
//   const authHeaders = req.headers.authorization;
//   console.log(authHeaders)
//   const token = authHeaders?.split(" ")[1];
//   console.log(token)

//   if(!token) {
//     return res.status(401).json({error: "Unauthenticated."});
//   }

//   if(!req.file){
//     return res.status(400).json({error: "No file uploaded."});
//   }

//   try {
//     const {userId} = verifyAccessToken(token)
//     if(!userId) {
//       return res.status(401).json({error: "Unauthenticated."});
//     }
    
//     const timestamp = Date.now();
//     const supabasePath = `public/book_cover/${userId}-${timestamp}-${req.file.originalname}`;

//     const {data, error} = await supabase.storage.from("testing").upload(supabasePath, req.file.buffer, {
//       contentType: req.file.mimetype,
//     })
//     console.log(`Uploaded Data: ${data?.id} / ${data?.path} / ${data?.fullPath}`)

//     if(error) {
//       console.log(error)
//       return res.status(500).json({error: "Error uploading to Supabase Storage"});
//     }
//     const {data: {publicUrl}} = supabase.storage.from("testing").getPublicUrl(supabasePath)

//     const newUpload = await prisma.upload.create({
//     data: {
//       userId: userId,
//       fileName: slugify(req.file.originalname),
//       fileSize: req.file.size,
//       filePath: supabasePath,
//       publicUrl,
//       uploaded: true,
//       fileType: req.file.mimetype,
//     }
//   })

//   res.status(200).json({success: true, message: `Successfully uploaded ${req.file.originalname}`, data: newUpload})
//   } catch (err) {
//     if(err instanceof TokenExpiredError) {
//       return res.status(401).json({error: "Session Expired"});
//     }
//     console.log(err)
//     res.status(500).json({error: "Internal server error."})
//   }
// });

