import { useOutletContext } from "react-router-dom";
import { Box } from "@mui/material";
import PhysicalInterfacesDashboard from "./charts/PhysicalInterfaceList";

type RouterDataContext = {
    physicalInterfaces: any[];
};

export default function RouterInterfaces() {
    const { physicalInterfaces } = useOutletContext<RouterDataContext>();

    return (
        <Box sx={{ width: '100%' }}>
            <PhysicalInterfacesDashboard interfaces={physicalInterfaces} />
        </Box>
    );
}