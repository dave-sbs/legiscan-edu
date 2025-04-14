import { z } from 'genkit';

export const CarSchema = z.object({
  id: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  engine_fuel_type: z.string(),
  engine_hp: z.number(),
  engine_cylinders: z.number(),
  transmission_type: z.string(),
  driven_wheels: z.string(),
  market_category: z.string(),
  number_of_doors: z.number(),
  vehicle_size: z.string(),
  vehicle_style: z.string(),
  highway_mpg: z.number(),
  city_mpg: z.number(),
  popularity: z.number(),
  msrp: z.number(),
});

// Schema for eduTest.jsonl
export const EduTestSchema = z.object({
  title: z.string(),
  description: z.string(),
  metadata_tags: z.array(z.string()),
  state: z.string(),
  bill_number: z.string(),
  start_date: z.string(), // ISO date string
  latest_update: z.string(), // ISO date string
  sponsors: z.array(z.string()),
  state_link: z.string(),
  url: z.string(),
});

export type _EduTestSchemaResponse = z.infer<typeof EduTestSchema>;


export const TypesenseQuerySchema = z
  .object({
    query: z.string().describe('a full-text search query'),
    filter_by: z.string().describe('a filter query in Typesense format'),
    sort_by: z.string().describe('a sorting query in Typesense format'),
  })
  .partial();

export type _CarSchemaResponse = z.infer<typeof CarSchema>;
export type _TypesenseQuery = z.infer<typeof TypesenseQuerySchema>;

export type TypesenseFieldDescriptionSchema = {
  [fieldName: string]: string;
};
