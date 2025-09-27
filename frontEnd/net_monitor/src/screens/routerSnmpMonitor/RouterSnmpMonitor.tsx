import { Button } from "@mui/material";
import { useSnmpMonitor } from "../../hooks/useSnmpMonitor";
import { useEffect } from "react";

export default function RouterSnmpMonitor() {
    const monitor = useSnmpMonitor({
        apiUrl: 'http://localhost:9090',
        serverUrl: 'ws://localhost:9090/ws/snmp',
        autoReconnect: true,
        reconnectInterval: 5000
    });

    useEffect(() => {
        const dados = monitor.getRouterData('68d72d87667a3701b497db77');
        if (dados) {
            console.log(dados.data);
        }
    }, [monitor.routerData]);

    return (
        <>
            <Button onClick={async () => {
                await monitor.connect('68d72d87667a3701b497db77', 'mikrotik');
                await monitor.startCollection('68d72d87667a3701b497db77');
            }}>
                teste
            </Button>
        </>
    );
}