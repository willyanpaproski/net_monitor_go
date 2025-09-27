import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';

interface RouterData {
    router_id: string;
    router_name?: string;
    vendor: string;
    timestamp: string;
    data?: Record<string, any>;
    error?: string;
    lastUpdate: string;
}

interface SnmpMonitorConfig {
    serverUrl?: string;
    apiUrl?: string;
    reconnectInterval?: number;
    autoReconnect?: boolean;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface UseSnmpMonitorReturn {
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    routerData: Map<string, RouterData>;
    error: string | null;
    statusMessage: string;

    connect: (routerId: string, vendor?: string) => Promise<boolean>;
    disconnect: () => void;

    startCollection: (routerId: string) => Promise<boolean>;
    stopCollection: (routerId: string) => Promise<boolean>;

    clearData: () => void;
    getRouterData: (routerId: string) => RouterData | null;
    getRoutersList: () => string[];
    getAllRoutersData: () => RouterData[];

    clearError: () => void;

    connectedRoutersCount: number;
    hasError: boolean;
}

/**
 * 
 * @param config
 * @returns
 */
export const useSnmpMonitor = (config: SnmpMonitorConfig = {}): UseSnmpMonitorReturn => {
    const { token } = useAuth();

    const {
        serverUrl,
        apiUrl,
        reconnectInterval,
        autoReconnect
    } = config;

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [routerData, setRouterData] = useState<Map<string, RouterData>>(new Map());
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Desconectado');

    const websocketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);
    const currentRouterRef = useRef<string | null>(null);
    const currentVendorRef = useRef<string | null>(null);

    const updateStatus = useCallback((status: ConnectionStatus, message: string): void => {
        setConnectionStatus(status);
        setStatusMessage(message);
        setIsConnected(status === 'connected');
    }, []);

    const connect = useCallback(async (routerId: string, vendor: string = 'mikrotik'): Promise<boolean> => {
        if (!routerId) {
            setError('ID do roteador é obrigatório');
            return false;
        }

        if (reconnectTimerRef.current) {
            clearInterval(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        if (websocketRef.current) {
            websocketRef.current.close();
        }

        const wsUrl = `${serverUrl}?router_id=${encodeURIComponent(routerId)}&vendor=${encodeURIComponent(vendor)}&token=${token}`;

        updateStatus('connecting', 'Conectando...');
        setError(null);

        try {
            const ws = new WebSocket(wsUrl);
            websocketRef.current = ws;
            currentRouterRef.current = routerId;
            currentVendorRef.current = vendor;

            ws.onopen = (event: Event): void => {
                console.log('Conectado ao WebSocket', event);
                updateStatus('connected', `Conectado - Router: ${routerId} (${vendor})`);
                setError(null);
            };

            ws.onmessage = (event: MessageEvent): void => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Dados recebidos:', data);

                    setRouterData(prevData => {
                        const newData = new Map(prevData);
                        newData.set(data.router_id, {
                            ...data,
                            lastUpdate: new Date().toISOString()
                        });
                        return newData;
                    });
                } catch (parseError) {
                    console.error('Erro ao parsear dados:', parseError);
                    setError('Erro ao processar dados recebidos');
                }
            };

            ws.onclose = (event: CloseEvent): void => {
                console.log('Conexão WebSocket fechada', event);
                updateStatus('disconnected', 'Desconectado');

                if (autoReconnect && currentRouterRef.current) {
                    reconnectTimerRef.current = window.setInterval(() => {
                        if (currentRouterRef.current && (!websocketRef.current || websocketRef.current.readyState === WebSocket.CLOSED)) {
                            console.log('Tentando reconectar...');
                            connect(currentRouterRef.current, currentVendorRef.current || 'mikrotik');
                        }
                    }, reconnectInterval);
                }
            };

            ws.onerror = (error: Event): void => {
                console.error('Erro no WebSocket:', error);
                updateStatus('disconnected', 'Erro na conexão');
                setError('Erro na conexão WebSocket');
            };

            return true;
        } catch (error) {
            console.error('Erro ao criar WebSocket:', error);
            updateStatus('disconnected', 'Erro ao conectar');
            setError('Erro ao estabelecer conexão');
            return false;
        }
    }, [serverUrl, autoReconnect, reconnectInterval, updateStatus]);

    const disconnect = useCallback((): void => {
        if (reconnectTimerRef.current) {
            clearInterval(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        if (websocketRef.current) {
            websocketRef.current.close();
            websocketRef.current = null;
        }

        currentRouterRef.current = null;
        currentVendorRef.current = null;

        updateStatus('disconnected', 'Desconectado');
    }, [updateStatus]);

    const startCollection = useCallback(async (routerId: string): Promise<boolean> => {
        if (!routerId) {
            setError('ID do roteador é obrigatório');
            return false;
        }

        try {
            const response = await fetch(`${apiUrl}/api/snmp/start/${encodeURIComponent(routerId)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Coleta iniciada:', data);
            return true;
        } catch (error) {
            console.error('Erro ao iniciar coleta:', error);
            setError('Erro ao iniciar coleta de dados');
            return false;
        }
    }, [apiUrl]);

    const stopCollection = useCallback(async (routerId: string): Promise<boolean> => {
        if (!routerId) {
            setError('ID do roteador é obrigatório');
            return false;
        }

        try {
            const response = await fetch(`${apiUrl}/api/snmp/stop/${encodeURIComponent(routerId)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Coleta parada:', data);
            return true;
        } catch (error) {
            console.error('Erro ao parar coleta:', error);
            setError('Erro ao parar coleta de dados');
            return false;
        }
    }, [apiUrl]);

    const clearData = useCallback((): void => {
        setRouterData(new Map());
    }, []);

    const getRouterData = useCallback((routerId: string): RouterData | null => {
        return routerData.get(routerId) || null;
    }, [routerData]);

    const getRoutersList = useCallback((): string[] => {
        return Array.from(routerData.keys());
    }, [routerData]);

    const getAllRoutersData = useCallback((): RouterData[] => {
        return Array.from(routerData.values());
    }, [routerData]);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isConnected,
        connectionStatus,
        routerData,
        error,
        statusMessage,

        connect,
        disconnect,

        startCollection,
        stopCollection,

        clearData,
        getRouterData,
        getRoutersList,
        getAllRoutersData,

        clearError,

        connectedRoutersCount: routerData.size,
        hasError: !!error
    };
};