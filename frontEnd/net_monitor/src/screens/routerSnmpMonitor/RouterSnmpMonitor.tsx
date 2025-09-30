import { useSnmpMonitor } from "../../hooks/useSnmpMonitor";
import { useEffect } from "react";
import StatCard from "../../components/StatCard";
import { Stack } from "@mui/material";

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
            <Stack direction={'row'} spacing={2} px={5}>
                <StatCard
                    title="Uso médio de memória"
                    value="14kb"
                    interval="Últimos 30 dias"
                    trend="up"
                    data={[98, 64, 23, 4]}
                />
                <StatCard 
                    title="Uso médio de cpu"
                    value="6%"
                    interval="Últimos 30 dias"
                    trend="up"
                    data={[3, 2, 1, 3]}
                />
                <StatCard 
                    title="Uso médio de disco"
                    value="20mb"
                    interval="Últimos 30 dias"
                    trend="up"
                    data={[20, 20, 20, 20]}
                />
            </Stack>
            {/* <Button onClick={async () => {
                await monitor.connect('68d72d87667a3701b497db77', 'mikrotik');
                await monitor.startCollection('68d72d87667a3701b497db77');
            }}>
                teste
            </Button> */}
        </>
    );
}