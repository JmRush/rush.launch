import Carousel from "@/components/ui/carousel";
import { getAllServerTypes } from "@/server/db/queries/serverTypes";
import { ServerType} from "@/server/db/schema";
import { InternalServerError } from "@/server/types/types_error";

export default async function AdminDashboard() {
    const getServerTypes = async () => {
        try {
            const serverTypes: ServerType[] = await getAllServerTypes();
            if(!serverTypes) {
                throw new Error("No server types found");
            }
            return serverTypes;
        } catch(error) {
            throw new InternalServerError((error as Error).message);
        }

    }
    const serverTypes = await getServerTypes();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard</p>
            <Carousel serverTypes={serverTypes} />
        </div>
    );
}