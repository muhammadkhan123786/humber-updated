import { Router } from "express";
import { technicianTicketsController } from "../../controllers/technician-dashboard-controllers/technician.tickets.controller";


const technicianRouter = Router();

technicianRouter.get('/technician-tickets', technicianTicketsController)

