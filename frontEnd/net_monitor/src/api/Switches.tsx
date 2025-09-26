import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "../App";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useI18n } from "../hooks/usei18n";
import { useNavigate } from "react-router-dom";
import type { NetworkSwitchFields } from "../schemas/NetworkSwitch";
import { toast } from "react-toastify";

export type NetworkSwitch = {
    id: string;
    accessPassword: string;
    accessUser: string;
    active: boolean;
    description: string;
    integration: string;
    ipAddress: string;
    name: string;
    snmpCommunity: string;
    snmpPort: string;
    updated_at: Date;
    created_at: Date;
}

export type CreateNetworkSwitchData = NetworkSwitchFields & {
    successEvent?: () => void;
}

export function useSwitch(): UseQueryResult<NetworkSwitch[], AxiosError<APIError>> {
    const { token } = useAuth();

    return useQuery<NetworkSwitch[], AxiosError<APIError>>({
        queryKey: ['switches'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:9090/api/switches', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1
    });
}

export function useDeleteSwitch() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation<void, AxiosError<APIError>, string>({
        mutationFn: async (switchId) => {
            await axios.delete(`http://localhost:9090/api/switches/${switchId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["switches"] })
        }
    });
}

export function useCreateNetworkSwitch() {
    const { t } = useI18n();
    const { token } = useAuth();
    const navigate = useNavigate();

    return useMutation<Partial<NetworkSwitch>, AxiosError<APIError>, CreateNetworkSwitchData>({
        mutationFn: async (data: CreateNetworkSwitchData) => {
            const response = await axios.post('http://localhost:9090/api/switches', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        },
        onSuccess: (_data, variables) => {
            toast.success(t('switches.createForm.successMessages.created'));
            if (variables.successEvent) {
                variables.successEvent();
            }
            navigate('/switches');
        },
        onError: (error: AxiosError<APIError>) => {
            if (error.response?.data.error.code === 'DUPLICATED_SWITCH_NAME') {
                toast.error(t('switches.createForm.errors.duplicatedSwitchName'));
                return
            }
            toast.error(t('switches.createForm.errors.error'));
        }
    });
}