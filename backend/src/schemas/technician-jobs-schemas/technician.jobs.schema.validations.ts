import { z } from 'zod';
import { objectIdSchema } from '../../validators/objectId.schema';
import { commonSchemaValidation } from '../shared/common.schema';

export const serviceSchemaValidation = z.object({
    activityId: objectIdSchema,
    duration: z.string().min(1, "Please enter approxmate time for this service."),
    description: z.string().min(1, "Please write some description."),
    additionalNotes: z.string().optional(),
<<<<<<< HEAD
=======
    ...commonSchemaValidation
>>>>>>> c3ca1b9beb1f13d64db2aee53cd79912eea4d1ce
});

export const partSchemaValidation = z.object({
    productId: objectIdSchema,
    oldPartConditionDescription: z.string().min(1, "Please enter old part condition."),
    newSerialNumber: z.string().optional(),
    quantity: z.number().min(1),
    unitCost: z.number().min(0),
    totalCost: z.number().min(0),
    reasonForChange: z.string().optional(),
<<<<<<< HEAD
=======
    ...commonSchemaValidation
>>>>>>> c3ca1b9beb1f13d64db2aee53cd79912eea4d1ce

});

export const inspectionSchemaValidation = z.object({
    inspectionTypeId: objectIdSchema,
    status: z.enum(["PASS", "FAIL", "N/A"]),
    notes: z.string().optional(),
<<<<<<< HEAD
=======
    ...commonSchemaValidation
>>>>>>> c3ca1b9beb1f13d64db2aee53cd79912eea4d1ce
});


export const jobNotesSchemaValidation = z.object({
    messages: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]), // uploaded URLs
    videos: z.array(z.string()).default([]), // uploaded URLs
<<<<<<< HEAD
=======
    ...commonSchemaValidation
>>>>>>> c3ca1b9beb1f13d64db2aee53cd79912eea4d1ce
});

export const technicianJobSchemaValidation = z.object({
    jobId: z.string().min(1),

    ticketId: objectIdSchema,
    technicianId: objectIdSchema,
    jobStatusId: objectIdSchema,

    services: z.array(serviceSchemaValidation).default([]),
    parts: z.array(partSchemaValidation).default([]),
    inspections: z.array(inspectionSchemaValidation).default([]),

    generalNotes: z.string().optional(),
    completionSummary: z.string().optional(),

    jobNotes: jobNotesSchemaValidation,

    ...commonSchemaValidation
});

