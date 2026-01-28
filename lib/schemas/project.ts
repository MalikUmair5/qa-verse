import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  instructions: z.array(z.string().min(1, 'Instruction cannot be empty'))
    .min(1, 'At least one instruction is required')
    .max(10, 'Maximum 10 instructions allowed'),
  
  technology_stack: z.string()
    .min(3, 'Technology stack is required')
    .max(200, 'Technology stack must be less than 200 characters'),
  
  testing_url: z.string()
    .url('Please enter a valid URL')
    .refine((url) => url.startsWith('http'), 'URL must start with http or https'),
  
  category: z.enum(['web', 'mobile', 'api', 'desktop']),
  
  status: z.enum(['active', 'inactive', 'completed'])
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;