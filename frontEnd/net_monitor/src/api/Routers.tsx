import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError } from "../App";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export type Router = {
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

export function useRouters(): UseQueryResult<Router[], AxiosError<APIError>> {
    const { token } = useAuth();

    return useQuery<Router[], AxiosError<APIError>>({
        queryKey: ['routers'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:9090/api/roteadores',{
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