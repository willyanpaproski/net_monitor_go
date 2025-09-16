import z from "zod";
import { useI18n } from "../hooks/usei18n";

export function useRouterSchema() {
    const { t } = useI18n();

    return z.object({
               
    });
}