const { z } = require('zod');

const ratingsQuerySchema = z.object({
  city: z.string().optional(),
  season: z.string().regex(/^\d{4}$/).optional(),
  search: z.string().max(50).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  offset: z.string().regex(/^\d+$/).optional(),
});

module.exports = { ratingsQuerySchema };
