import { z } from "zod";

export const createProductSchema = {
  name: z.string().min(3),
  description: z.string().min(50),
  price: z.number().min(0),
  categories: z.array(z.string()),
  supplierId: z.string().uuid(),
  maxGroupSize: z.number().min(1),
  includedItems: z.array(z.string()),
  excludedItems: z.array(z.string()),
  itinerary: z.string(),
  meetingPoint: z.string(),
  endingPoint: z.string(),
  minAge: z.number().min(0).nullable(),
  cancellationPolicy: z.string(),
  b2bAvailable: z.boolean(),
  b2bMinQuantity: z.number().min(1),
  b2bDiscount: z.number().min(0),
  languages: z.array(z.string()),
  workingHours: z.array(
    z.object({
      dayOfWeek: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      isAvailable: z.boolean(),
    })
  ),
};
