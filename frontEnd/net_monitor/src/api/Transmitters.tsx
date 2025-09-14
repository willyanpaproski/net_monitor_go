import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "../App";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export type Transmitter = {
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

export function useTransmitters(): UseQueryResult<Transmitter[], AxiosError<APIError>> {
    const { token } = useAuth();

    return useQuery<Transmitter[], AxiosError<APIError>>({
        queryKey: ['transmitters'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:9090/api/transmitters', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data
        },
        staleTime: 1000 * 60 * 5,
        retry: 1
    });
}

export function useDeleteTransmitter() {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation<void, AxiosError<APIError>, string>({
        mutationFn: async (transmitterId: string) => {
            await axios.delete(`http://localhost:9090/api/transmitters/${transmitterId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transmitters"] });
        }
    });
}