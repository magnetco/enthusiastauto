import { type SchemaTypeDefinition } from "sanity";
import { vehicle } from "../schemas/vehicle";
import { post } from "../schemas/post";
import { service } from "../schemas/service";
import { page } from "../schemas/page";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [vehicle, post, service, page],
};
