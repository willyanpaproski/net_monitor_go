import AddBox from "@mui/icons-material/AddBox";
import Close from "@mui/icons-material/Close";
import { useEffect } from "react";
import { useCreateTransmitter } from "../../../api/Transmitters";
import { useForm } from "../../../hooks/useForm";
import { useI18n } from "../../../hooks/usei18n";
import { useTransmitterSchema } from "../../../schemas/Transmitter";
import { ModalOverlay } from "../../../components/ModalOverlay";
import { ModalContainer } from "../../../components/ModalContainer";
import { Button, FormLabel, Grid, MenuItem, OutlinedInput, Select, Switch } from "@mui/material";
import { FormGrid } from "../../../components/FormGrid";

type ModalCreateTransmitterProps = {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}

export function ModalCreateTransmitter({ isVisible, setIsVisible }: ModalCreateTransmitterProps) {
    const { t } = useI18n();
    const createTransmitterMutation = useCreateTransmitter();
    const transmitterSchema = useTransmitterSchema();

    const { formData, handleChange, handleSelectChange, handleSwitchChange, isValid, errors, setDefault } = useForm({
        active: true,
        integration: "huawei",
        name: "",
        ipAddress: "",
        accessUser: "",
        accessPassword: "",
        snmpCommunity: "",
        snmpPort: "",
        description: ""
    }, ["name", "integration", "ipAddress", "snmpCommunity", "snmpPort"], transmitterSchema);

    useEffect(() => {
        if (createTransmitterMutation.isSuccess) {
            setDefault();
            createTransmitterMutation.reset();
            setIsVisible(false);
        }
    }, [createTransmitterMutation.isSuccess]);

    if (!isVisible) return null;

    return (
        <ModalOverlay>
            <ModalContainer
                modalHeight="90vh"
                modalMargin="16px"
                modalPadding="16px"
                modalWidth="800px"
            >
                <AddBox sx={{ fontSize: "2.5rem" }} />
                <Button sx={{
                    minWidth: "auto",
                    p: 1,
                    position: "absolute",
                    top: 8,
                    right: 8
                }} onClick={() => setIsVisible(true)}>
                    <Close sx={{ fontSize: "1.5rem" }} />
                </Button>
                <Grid container spacing={3} sx={{  
                    marginTop: 5
                }}>
                    <FormGrid size={{ xs: 12, md: 6 }}>
                        <FormLabel htmlFor="active">{t('')}</FormLabel>
                        <Switch 
                            name="active"
                            checked={formData.active}
                            onChange={handleSwitchChange}
                        />
                    </FormGrid>
                    <FormGrid size={{ xs: 12, md: 6 }}>
                        <FormLabel htmlFor="integration">{t('')}</FormLabel>
                        <Select 
                            id="integration"
                            name="integration"
                            size="small"
                            value={formData.integration}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="huawei">Huawei</MenuItem>
                            <MenuItem value="datacom">Datacom</MenuItem>
                            <MenuItem value="zte">ZTE</MenuItem>
                        </Select>
                    </FormGrid>
                    <FormGrid size={{ xs: 12, md: 6 }}>
                        <FormLabel htmlFor="name">{t('')}</FormLabel>
                        <OutlinedInput 
                            id="name"
                            name="name"
                            size="small"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </FormGrid>
                </Grid>
            </ModalContainer>
        </ModalOverlay>
    );
}