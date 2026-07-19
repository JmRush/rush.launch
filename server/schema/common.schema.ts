import {
  ServerTypeSchema,
  ContainerPortSchema,
  ContainerVolumeSchema,
} from "./servertype.schema";
import { z } from "zod";

export const ServerTypeAndMappings = ServerTypeSchema.extend({
  ports: z.array(ContainerPortSchema),
  volumes: z.array(ContainerVolumeSchema),
});

export type ServerTypeAndMappings_T = z.infer<typeof ServerTypeAndMappings>;
