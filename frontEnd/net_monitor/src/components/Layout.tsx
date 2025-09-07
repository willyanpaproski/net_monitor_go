import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu/SideMenu";
import Box from "@mui/material/Box";

export default function Layout() {
    return(
        <Box sx={{ display: 'flex' }}>
            <SideMenu />
            <Box>
                <Outlet />
            </Box>
        </Box>
    );
}