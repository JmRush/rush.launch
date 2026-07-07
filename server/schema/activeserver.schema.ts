import z from "zod";

//this definitely needs to be updated
export const ServerSchema = z.object({
  id: z.number(),
  ip: z.ipv4(),
  name: z.string(),
  status: z.string(),
  createdBy: z.number(),
  updatedBy: z.number(),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
  serverTypeId: z.number(),
});

export const ServerPortSchema = z.object({
  id: z.int(),
  serverId: z.int(),
  serverTypePortId: z.int(),
  host_port: z.int(),
  protocol: z.string(),
});

export const ServerVolumeSchema = z.object({
  id: z.int(),
  serverId: z.int(),
  serverTypeVolumeId: z.int(),
  host_path: z.string(),
});

export type ServerSchema = z.infer<typeof ServerSchema>;
export type ServerPortSchema = z.infer<typeof ServerPortSchema>;
export type ServerVolumeSchema = z.infer<typeof ServerVolumeSchema>;
