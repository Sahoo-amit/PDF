import express from 'express'
import multer from 'multer'
import { mergePdf } from '../controllers/pdf.controller.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/merge", upload.array("pdfs"), mergePdf);

export default router