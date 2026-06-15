//api types that we might ened to use in the frontend - (contract between server and frontend)

export interface ServerType {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    namespace: string;
    repository: string;
    tags: string[];
    pullCount: number;
    starCount: number;
    lastUpdated: Date;
    storageSize: number | null;
    createdAt: Date;
    updatedAt: Date;
}