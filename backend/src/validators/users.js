const { z } = require('zod');

const nicknameSchema = z.object({
  nickname: z.string().trim().min(2).max(30),
});

const citySchema = z.object({
  city: z.string().trim().min(1).max(50),
});

module.exports = { nicknameSchema, citySchema };
