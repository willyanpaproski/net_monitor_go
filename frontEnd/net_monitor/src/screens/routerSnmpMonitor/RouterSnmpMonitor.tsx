import { useSnmpMonitor } from "../../hooks/useSnmpMonitor";
import { useEffect, useMemo } from "react";
import StatCard from "../../components/StatCard";
import { Stack, Box } from "@mui/material";
import { useI18n } from "../../hooks/usei18n";
import { useParams } from "react-router-dom";
import { useRouter } from "../../api/Routers";
import MemoryUsageLineChart from "./charts/MemoryUsageLineChart";
import MemoryUsagePieChart from "./charts/MemoryUsagePieChart";
import CpuUsageLineChart from "./charts/CpuUsageLineChart";
import DiskUsageLineChart from "./charts/DiskUsageLineChart";
import DiskUsagePieChart from "./charts/DiskUsagePieChart";

export default function RouterSnmpMonitor() {
    const { t } = useI18n();
    const { routerId } = useParams<{ routerId: string }>();
    const router = useRouter(routerId!);

    const monitor = useSnmpMonitor({
        apiUrl: "http://localhost:9090",
        serverUrl: "ws://localhost:9090/ws/snmp",
        autoReconnect: true,
        reconnectInterval: 5000,
        maxDataPoints: 10
    });

    useEffect(() => {
        const initCollection = async () => {
            if (routerId) {
                console.log('🔌 Conectando ao router:', routerId);
                const connected = await monitor.connect(routerId, 'mikrotik');
                
                if (connected) {
                    console.log('🚀 Iniciando coleta automática');
                    await monitor.startCollection(routerId);
                }
            }
        };

        initCollection();

        return () => {
            if (routerId) {
                monitor.stopCollection(routerId);
                monitor.disconnect();
            }
        };
    }, [routerId]);

    const monthAverageMemoryUsage = useMemo(() => {
        if (!router.data?.monthAvarageMemoryUsage?.length) return 0;
        const validRecords = router.data.monthAvarageMemoryUsage.filter(record => record?.value != null);
        if (validRecords.length === 0) return 0;
        const soma = validRecords.reduce((acc, record) => acc + record.value, 0);
        return soma / validRecords.length;
    }, [router.data]);

    const monthAverageCpuUsage = useMemo(() => {
        if (!router.data?.monthAverageCpuUsage?.length) return 0;
        const validRecords = router.data.monthAverageCpuUsage.filter(record => record?.value != null);
        if (validRecords.length === 0) return 0;
        const soma = validRecords.reduce((acc, record) => acc + record.value, 0);
        return soma / validRecords.length;
    }, [router.data]);

    const monthAverageDiskUsage = useMemo(() => {
        if (!router.data?.monthAverageDiskUsage?.length) return 0;
        const validRecords = router.data.monthAverageDiskUsage.filter(record => record?.value != null);
        if (validRecords.length === 0) return 0;
        const soma = validRecords.reduce((acc, record) => acc + record.value, 0);
        return soma / validRecords.length;
    }, [router.data]);

    const memoryChartData = useMemo(() => {
        const data = monitor.getMetricData(routerId!, 'memory_usage');
        const uniqueData = data.reduce((acc, item) => {
            const exists = acc.find(d => d.timestamp === item.timestamp);
            if (!exists) {
                acc.push(item);
            }
            return acc;
        }, [] as typeof data);
        
        return uniqueData.map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            timestamp: item.timestamp,
            value: item.value,
        }));
    }, [monitor.routerData, routerId]);

    const cpuChartData = useMemo(() => {
        const data = monitor.getMetricData(routerId!, 'cpu_usage');
        const uniqueData = data.reduce((acc, item) => {
            const exists = acc.find(d => d.timestamp === item.timestamp);
            if (!exists) {
                acc.push(item);
            }
            return acc;
        }, [] as typeof data);
        
        return uniqueData.map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            timestamp: item.timestamp,
            value: item.value,
        }));
    }, [monitor.routerData, routerId]);

    const diskChartData = useMemo(() => {
        const data = monitor.getMetricData(routerId!, 'disk_usage');
        const uniqueData = data.reduce((acc, item) => {
            const exists = acc.find(d => d.timestamp === item.timestamp);
            if (!exists) {
                acc.push(item);
            }
            return acc;
        }, [] as typeof data);
        
        return uniqueData.map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            timestamp: item.timestamp,
            value: item.value,
        }));
    }, [monitor.routerData, routerId]);

    const currentMemory = memoryChartData[memoryChartData.length - 1]?.value || 0;
    const currentCpu = cpuChartData[cpuChartData.length - 1]?.value || 0;
    const currentDisk = diskChartData[diskChartData.length - 1]?.value || 0;

    const totalMemory = useMemo(() => {
        const [data] = monitor.getMetricData(routerId!, 'total_memory');
        return data ? data.value : 0;
    }, [monitor.routerData, routerId]);

    const totalDisk = useMemo(() => {
        const [data] = monitor.getMetricData(routerId!, 'total_disk');
        return data ? data.value : 0;
    }, [monitor.routerData, routerId]);

    if (router.isLoading) {
        return <div>{t("loading")}...</div>;
    }

    if (router.isError) {
        return <div>Erro ao carregar roteador</div>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction={"row"} spacing={2} mb={4}>
                <StatCard
                    title={t("routers.snmpMonitor.dashboard.memoryStatCard.averageMemoryUsage")}
                    value={monthAverageMemoryUsage.toFixed(1) + "MB"}
                    interval={monthAverageMemoryUsage !== 0 ? t("routers.snmpMonitor.dashboard.memoryStatCard.lastMonth") : t('routers.snmpMonitor.dashboard.noDataCollected')}
                    trend="up"
                    data={router.data?.monthAvarageMemoryUsage
                        ?.filter(record => record?.value != null)
                        .map((record) => Number(record.value.toFixed(1))) || []}
                />
                <StatCard
                    title={t("routers.snmpMonitor.dashboard.cpuStatCard.averageCpuUsage")}
                    value={monthAverageCpuUsage + "%"}
                    interval={(monthAverageCpuUsage !== undefined || monthAverageCpuUsage !== null) ? t("routers.snmpMonitor.dashboard.cpuStatCard.lastMonth") : t('routers.snmpMonitor.dashboard.noDataCollected')}
                    trend="up"
                    data={router.data?.monthAverageCpuUsage
                        ?.filter(record => record?.value != null)
                        .map(record => record.value) || []}
                />
                <StatCard
                    title={t("routers.snmpMonitor.dashboard.diskStatCard.averageDiskUsage")}
                    value={monthAverageDiskUsage + "MB"}
                    interval={monthAverageDiskUsage !== 0 ? t("routers.snmpMonitor.dashboard.diskStatCard.lastMonth") : t('routers.snmpMonitor.dashboard.noDataCollected')}
                    trend="up"
                    data={router.data?.monthAverageDiskUsage
                        ?.filter(record => record?.value != null)
                        .map((record) => Number(record.value.toFixed(1))) || []}
                />
            </Stack>

            <Stack spacing={3}>
                <Stack 
                    direction={{ xs: 'column', lg: 'row' }} 
                    spacing={3}
                >
                    <Box sx={{ flex: { xs: 1, lg: 2 } }}>
                        <MemoryUsageLineChart 
                            currentMemory={currentMemory}
                            memoryChartData={memoryChartData}
                        />
                    </Box>
                    <Box sx={{ flex: { xs: 1, lg: 1 } }}>
                        <MemoryUsagePieChart 
                            currentMemory={currentMemory}
                            totalMemory={totalMemory}
                        />
                    </Box>
                </Stack>

                <CpuUsageLineChart 
                    currentCpu={currentCpu}
                    cpuChartData={cpuChartData}
                />

                <Stack
                    direction={{ xs: 'column', lg: 'row' }} 
                    spacing={3}
                >
                    <Box sx={{ flex: { xs: 1, lg: 2 } }}>
                        <DiskUsageLineChart 
                            currentDisk={currentDisk}
                            diskChartData={diskChartData}
                        />
                    </Box>
                    <Box sx={{ flex: { xs: 1, lg: 1 } }}>
                        <DiskUsagePieChart 
                            currentDisk={currentDisk}
                            totalDisk={totalDisk}
                        />
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}