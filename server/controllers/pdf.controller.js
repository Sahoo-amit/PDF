import fs from 'fs'
import { PDFDocument } from 'pdf-lib'
import path from 'path'

export const mergePdf = async(req,res)=>{
    try {
        const files = req.files
        const mergedPdf = await PDFDocument.create()
        for (const file of files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        
        const mergedPdfBytes = await mergedPdf.save();
        const outputPath = `merged/${Date.now()}_merged.pdf`;
        fs.writeFileSync(outputPath, mergedPdfBytes);
        files.forEach((file) => fs.unlinkSync(file.path));

        res.json({ downloadUrl: `/${outputPath}` });
    } catch (error) {
        console.log(error)
    }
}