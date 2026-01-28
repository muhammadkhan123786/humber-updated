
import { Router } from "express";
import { Response, Request } from "express";
import { getCurrentTechnicianJobCode, getCurrentTicketCode, getCustomerInvoiceCurrentCode, getEmployeeCode, getSupplierCurrentCode } from "../../utils/generate.AutoCode.Counter";

const autoCodeGeneratorRouter = Router();

//ticket code.
autoCodeGeneratorRouter.get('/techcian-code', async (req: Request, res: Response) => {
    try {
        const currentTechnicianJobCode = await getCurrentTechnicianJobCode();
        res.json({ technicianJobCode: currentTechnicianJobCode });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to get technician job code" });
    }
});

//technician job code. 
autoCodeGeneratorRouter.get('/ticket-code', async (req: Request, res: Response) => {
    try {
        const currentTicketCode = await getCurrentTicketCode();
        res.json({ ticketCode: currentTicketCode });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to get ticket code." });
    }
})

//employee code 
autoCodeGeneratorRouter.get('/employee-code', async (req: Request, res: Response) => {
    try {
        const employeeCode = await getEmployeeCode();
        res.json({ employeeCode: employeeCode });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to get employee code." });
    }
})

//supplier code 
autoCodeGeneratorRouter.get('/supplier-code', async (req: Request, res: Response) => {
    try {
        const supplierCode = await getSupplierCurrentCode();
        res.json({ supplierCode: supplierCode });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to get supplier code." });
    }
})

//customer invoice code. 
autoCodeGeneratorRouter.get('/customer-invoice-code', async (req: Request, res: Response) => {
    try {
        const customerInvoiceCode = await getCustomerInvoiceCurrentCode();
        res.json({ customerInvoiceCode: customerInvoiceCode });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to get customer invoice code." });
    }
})


export default autoCodeGeneratorRouter;
