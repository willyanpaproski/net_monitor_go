import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "../App";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

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