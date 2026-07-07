import { z } from "zod";

export const ServerTypeSchema = z.object({
  id: z.int(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  namespace: z.string(),
  repository: z.string(),
  tags: z.array(z.string()),
  lastUpdated: z.iso.date(),
  storageSize: z.number() || z.null(),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});

export const CreateServerTypeSchema = ServerTypeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const ContainerPortSchema = z.object({
  id: z.int(),
  serverTypeId: z.int(),
  label: z.string(),
  protocol: z.string(),
  container_port: z.number(),
});

export const CreateContainerPort = ContainerPortSchema.omit({
  id: true,
});

export const ContainerVolumeSchema = z.object({
  id: z.int(),
  serverTypeId: z.int(),
  container_path: z.string(),
  label: z.string(),
});

export const CreateContainerVolume = ContainerVolumeSchema.omit({
  id: true,
});

export type ContainerPort = z.infer<typeof ContainerPortSchema>;
export type ContainerVolume = z.infer<typeof ContainerVolumeSchema>;
export type ServerTypeSchema = z.infer<typeof ServerTypeSchema>;
export type CreateServerType = z.infer<typeof CreateServerTypeSchema>;
export type CreateContainerPortType = z.infer<typeof CreateContainerPort>;
export type CreateContainerVolumeType = z.infer<typeof CreateContainerPort>;
