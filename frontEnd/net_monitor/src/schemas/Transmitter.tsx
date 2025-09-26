import z from "zod";
import { useI18n } from "../hooks/usei18n";

export function useTransmitterSchema() {
    const { t } = useI18n();

    const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$/;

    return z.object({
        active: z.boolean(),
        integration: z.enum([
            "huawei",
            "datacom",
            "zte"
        ]),
        name: z.string(),
        description: z.string(),
        accessUser: z.string(),
        accessPassword: z.string().min(6, t('transmitters.schema.passwordLength')),
        ipAddress: z.string().regex(ipRegex, t('transmitters.schema.invalidIpAddress')),
        snmpCommunity: z.string(),
        snmpPort: z.string()
    });
}

export type TransmitterFields = {
    id?: string;
    accessPassword: string;
    accessUser: string;
    active: boolean;
    description: string;
    integration: string;
    ipAddress: string;
    name: string;
    snmpCommunity: string;
    snmpPort: string;
}