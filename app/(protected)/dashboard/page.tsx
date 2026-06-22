"use client";
import Carousel from "@/components/ui/carousel";
import { ServerType } from "@/types/api";
import { safeRetry } from "@/lib/global_util";
import { useEffect, useState } from "react";

const getServerTypes = async () => {
  try {
    const response = await safeRetry(
      "http://localhost:3001/api/get-server-types",
      "GET",
      0,
    );
    if (!(response instanceof Response) || !response.ok) {
      throw new Error("Failed to get server types");
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.serverTypes as ServerType[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export default function Dashboard() {
  const [serverTypes, setServerTypes] = useState<ServerType[]>([]);
  useEffect(() => {
    const fetchServerTypes = async () => {
      try {
        const serverTypes = await getServerTypes();
        setServerTypes(serverTypes);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    };
    fetchServerTypes();
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to Rush.Launch</p>
      <Carousel serverTypes={serverTypes} />
    </div>
  );
}
