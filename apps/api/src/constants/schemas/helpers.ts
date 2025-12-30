import { z } from 'zod';
import type { $ZodType } from 'zod/v4/core';

export const toJsonSchemaSupported = (schema: $ZodType) => z.toJSONSchema(schema, { target: 'draft-07' });

export const statusSchema = z.enum(['SUCCESS', 'ERROR']);

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAnonymous: z.boolean().optional().nullable(),
  email: z.string().optional(),
  emailVerified: z.boolean().optional().nullable(),
});
