import { type SchemaTypeDefinition } from "sanity";
import { vehicle } from "../schemas/vehicle";
import { post } from "../schemas/post";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [vehicle, post],
};
