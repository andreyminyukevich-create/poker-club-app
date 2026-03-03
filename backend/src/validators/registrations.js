const { z } = require('zod');

const registerSchema = z.object({
  tournament_id: z.number().int().positive(),
});

const cancelSchema = z.object({
  tournament_id: z.number().int().positive(),
});

module.exports = { registerSchema, cancelSchema };
