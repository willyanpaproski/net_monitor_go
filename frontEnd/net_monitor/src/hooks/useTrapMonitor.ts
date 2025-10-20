import { useState, useEffect, useCallback, useMemo } from 'react';

export interface InterfaceTrapEvent {
    router_id: string;
    router_name: string;
    router_ip: string;
    interface_index: number;
    interface_name: string;
    event: 'link_up' | 'link_down';
    admin_status: number;
    oper_status: number;
    timestamp: string;
    trap_oid: string;
}

interface UseTrapMonitorOptions {
    maxEvents?: number;
    routerId?: string;
    onEvent?: (event: InterfaceTrapEvent) => void;
    enableNotifications?: boolean;
}

interface TrapStatistics {
    totalEvents: number;
    linkUpCount: number;
    linkDownCount: number;
    interfaceStats: Map<string, { up: number; down: number }>;
    lastEvent?: InterfaceTrapEvent;
}

export function useTrapMonitor(
    websocketRef: React.MutableRefObject<WebSocket | null> | undefined,
    isConnected: boolean,
    options: UseTrapMonitorOptions = {}
) {
    const { maxEvents = 50, routerId, onEvent, enableNotifications = false } = options;

    const [events, setEvents] = useState<InterfaceTrapEvent[]>([]);
    const [statistics, setStatistics] = useState<TrapStatistics>({
        totalEvents: 0,
        linkUpCount: 0,
        linkDownCount: 0,
        interfaceStats: new Map()
    });

    // Solicita permissão de notificação
    useEffect(() => {
        if (enableNotifications && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [enableNotifications]);

    const showNotification = useCallback((event: InterfaceTrapEvent) => {
        if (!enableNotifications || Notification.permission !== 'granted') return;

        const isUp = event.event === 'link_up';
        const title = `Interface ${event.interface_name || event.interface_index}`;
        const body = `${isUp ? '🟢 UP' : '🔴 DOWN'} - ${event.router_name}`;

        new Notification(title, { body, icon: '/favicon.ico', tag: `trap-${event.router_id}-${event.interface_index}` });
    }, [enableNotifications]);

    // Lida com mensagens do WebSocket
    useEffect(() => {
        if (!websocketRef || !websocketRef.current || !isConnected) return;
        const ws = websocketRef.current;

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Trap monitor received message:", data);

                if (data.event && (data.event === 'link_up' || data.event === 'link_down')) {
                    // Filtra por routerId, se fornecido
                    if (routerId && data.router_id !== routerId) return;

                    // Normaliza timestamp para milissegundos
                    let ts = data.timestamp as string;
                    ts = ts.replace(/(\.\d{3})\d+/, '$1'); 

                    const trapEvent: InterfaceTrapEvent = {
                        router_id: data.router_id,
                        router_name: data.router_name,
                        router_ip: data.router_ip,
                        interface_index: data.interface_index,
                        interface_name: data.interface_name || `Interface ${data.interface_index}`,
                        event: data.event,
                        admin_status: data.admin_status,
                        oper_status: data.oper_status,
                        timestamp: ts,
                        trap_oid: data.trap_oid
                    };

                    // Atualiza lista de eventos
                    setEvents(prev => [trapEvent, ...prev].slice(0, maxEvents));

                    // Atualiza estatísticas
                    setStatistics(prev => {
                        const key = `${trapEvent.router_id}-${trapEvent.interface_index}`;
                        const map = new Map(prev.interfaceStats);
                        const stats = map.get(key) || { up: 0, down: 0 };
                        if (trapEvent.event === 'link_up') stats.up += 1;
                        else stats.down += 1;
                        map.set(key, stats);

                        return {
                            totalEvents: prev.totalEvents + 1,
                            linkUpCount: prev.linkUpCount + (trapEvent.event === 'link_up' ? 1 : 0),
                            linkDownCount: prev.linkDownCount + (trapEvent.event === 'link_down' ? 1 : 0),
                            interfaceStats: map,
                            lastEvent: trapEvent
                        };
                    });

                    if (onEvent) onEvent(trapEvent);
                    showNotification(trapEvent);
                }
            } catch (err) {
                console.error('Erro ao processar evento de trap:', err);
            }
        };

        ws.addEventListener('message', handleMessage);
        return () => ws.removeEventListener('message', handleMessage);
    }, [websocketRef, isConnected, routerId, maxEvents, onEvent, showNotification]);

    const clearEvents = useCallback(() => setEvents([]), []);
    const clearStatistics = useCallback(() => setStatistics({
        totalEvents: 0,
        linkUpCount: 0,
        linkDownCount: 0,
        interfaceStats: new Map()
    }), []);
    const clearAll = useCallback(() => { clearEvents(); clearStatistics(); }, [clearEvents, clearStatistics]);

    const filteredEvents = useMemo(() => {
        if (!routerId) return events;
        return events.filter(e => e.router_id === routerId);
    }, [events, routerId]);

    return {
        events: filteredEvents,
        allEvents: events,
        statistics,
        clearEvents,
        clearStatistics,
        clearAll
    };
}
