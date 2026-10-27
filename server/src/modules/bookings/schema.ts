import { z } from "zod";

export const createBookingSchema = z.object({
  facility_id: z.string().uuid(),
  booking_date: z.iso.date(),
  start_time: z.iso.time(),
  end_time: z.iso.time(),
});