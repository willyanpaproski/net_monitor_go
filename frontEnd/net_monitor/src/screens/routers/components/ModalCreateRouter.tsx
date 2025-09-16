import { Box, Button, FormLabel, Grid, MenuItem, OutlinedInput, Select, styled, Switch, TextField } from "@mui/material";
import AddBox from "@mui/icons-material/AddBox";
import Close from "@mui/icons-material/Close";
import { useI18n } from "../../../hooks/usei18n";
import { useState } from "react";

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export function ModalCreateRouter() {
    const { t } = useI18n();
    const [routerIntegration, setRouterIntegration] = useState('mikrotik');
    const [activeRouter, setActiveRouter] = useState(true);

    return (
        <Box
        sx={{
            backgroundColor: "#0C1017",
            width: "100%",
            maxWidth: "800px",
            borderRadius: "5px",
            p: 2,
            position: "relative"
        }}
        >
        <AddBox sx={{ fontSize: "2.5rem" }} />
        <Button sx={{
            minWidth: "auto",
            p: 1,
            position: "absolute",
            top: 8,
            right: 8
        }}>
            <Close sx={{ fontSize: "1.5rem" }} />
        </Button>
        <Grid container spacing={3} sx={{  
            marginTop: 5
        }}>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="active">{t('routers.createForm.fields.active')}</FormLabel>
                <Switch 
                    checked={activeRouter}
                    onChange={(e) => {setActiveRouter(e.target.checked)}}
                />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="integration">{t('routers.createForm.fields.integration')}</FormLabel>
                <Select 
                    id="integration"
                    name="integration"
                    size="small"
                    value={routerIntegration}
                    onChange={(e) => setRouterIntegration(e.target.value)}
                >
                    <MenuItem value="mikrotik">Mikrotik</MenuItem>
                    <MenuItem value="huawei">Huawei</MenuItem>
                    <MenuItem value="cisco">Cisco</MenuItem>
                </Select>
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="name">{t('routers.createForm.fields.name')}</FormLabel>
                <OutlinedInput 
                    id="name"
                    name="name"
                    size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="ipAddress">{t('routers.createForm.fields.ipAddress')}</FormLabel>
                <OutlinedInput 
                    id="ipAddress"
                    name="ipAddress"
                    size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="accessUser">{t('routers.createForm.fields.accessUser')}</FormLabel>
                <OutlinedInput 
                    id="accessUser"
                    name="accessUser"
                    size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="accessPassword">{t('routers.createForm.fields.accessPassword')}</FormLabel>
                <OutlinedInput 
                    id="accessPassword"
                    name="accessPassword"
                    size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="snmpCommunity">{t('routers.createForm.fields.snmpCommunity')}</FormLabel>
                <OutlinedInput 
                    id="snmpCommunity"
                    name="snmpCommunity"
                    size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
                <FormLabel htmlFor="snmpPort">{t('routers.createForm.fields.snmpPort')}</FormLabel>
                <OutlinedInput 
                    id="snmpPort"
                    name="snmpPort"
                    size="small"
                />
            </FormGrid>
            <FormGrid size={{ xs: 24, md: 12 }}>
                <FormLabel htmlFor="description">{t('routers.createForm.fields.description')}</FormLabel>
                <TextField
                    id="description"
                    name="description"
                    size="small"
                />
            </FormGrid>
        </Grid>
        </Box>
    );
}
