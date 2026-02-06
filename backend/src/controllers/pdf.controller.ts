import { GrnModel } from "../models/grn.models";
import { generatePdfFromTemplate } from '../utils/pdfGenerator';
import { Request, Response } from "express";

export const exportGRNToPDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const grn = await GrnModel.findById(id)
      .populate({
        path: "purchaseOrderId",
        populate: { path: "supplier" }
      })
      .lean();

    if (!grn) return res.status(404).json({ message: "GRN not found" });

    // SAFE DATE FORMATTING
    const formattedDate = grn.receivedDate 
      ? new Date(grn.receivedDate).toLocaleDateString('en-GB') 
      : 'N/A';

    const pdfData = {
      companyName: "Humber Mobility Scooter",
      reportTitle: "Goods Received Note",
      generatedAt: new Date().toLocaleDateString('en-GB'),
      grn: {
        ...grn,
        receivedDate: formattedDate 
      }
    };

    // IMPORTANT: Ensure your file is templates/grn-report.hbs
    const pdfBuffer = await generatePdfFromTemplate('grn', pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${grn.grnNumber}.pdf`);
    return res.status(200).send(pdfBuffer);

  } catch (err: any) {
    console.error("CRITICAL BACKEND ERROR:", err.message); // Look at your VS Code terminal!
    return res.status(500).json({ success: false, message: err.message });
  }
};