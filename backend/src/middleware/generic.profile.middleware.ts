import { Request, Response, NextFunction } from 'express';
import { Person } from '../models/person.models';
import { Contact } from '../models/contact.models';
import { Address } from '../models/addresses.models';
import { User } from '../models/user.models';
import { commonProfileDto } from '../../../common/DTOs/profilecommonDto';

export const genericProfileIdsMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = req.body as commonProfileDto;

        /* -------------------------
           1. Prevent duplicate user
        -------------------------- */
        const existingUser = await User.findOne({
            email: body.contact.emailId,
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists with this email',
            });
        }

        /* -------------------------
           2. Create Person
        -------------------------- */
        const person = await Person.create(body.person);

        /* -------------------------
           3. Create Contact
        -------------------------- */
        const contact = await Contact.create({
            ...body.contact,
        });

        /* -------------------------
           4. Create Address
        -------------------------- */
        const address = await Address.create({
            ...body.address
        });

        /* -------------------------
           5. Assign Role (Backend Controlled)
        -------------------------- */
        const role =
            body.role ??
                req.originalUrl.includes('Admin')
                ? 'Admin'
                : req.originalUrl.includes('Technician')
                    ? 'Technician'
                    : 'Customer';

        /* -------------------------
           6. Create User
        -------------------------- */
        const user = await User.create({
            email: body.contact.emailId,
            role,
        });

        /* -------------------------
           7. Attach IDs to req.body
        -------------------------- */
        req.body.personId = person._id;
        req.body.contactId = contact._id;
        req.body.addressId = address._id;
        req.body.accountId = user._id;

        next();
    } catch (error) {
        next(error);
    }
};
