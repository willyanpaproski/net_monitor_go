import { useSnmpMonitor } from "../../hooks/useSnmpMonitor";
import { useEffect, useMemo } from "react";
import StatCard from "../../components/StatCard";
import { Stack, Box, Typography, Paper, Alert } from "@mui/material";
import { useI18n } from "../../hooks/usei18n";
import { useParams } from "react-router-dom";
import { useRouter } from "../../api/Routers";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <Box
                    sx={{
                        bgcolor: 'rgba(30, 30, 30, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 1,
                        p: 1.5,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography variant="body2" sx={{ color: '#999', mb: 0.5 }}>
                        {dataPoint.time}
                    </Typography>
                    <Typography variant="body1" sx={{ color: payload[0].color, fontWeight: 600 }}>
                        {payload[0].value.toFixed(1)}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    if (router.isLoading) {
        return <div>{t("loading")}...</div>;
    }

    if (router.isError) {
        return <div>Erro ao carregar roteador</div>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} mb={3} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Monitor SNMP - {router.data?.name || routerId}
                </Typography>
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: monitor.isConnected ? '#4ade80' : '#ef4444',
                        animation: monitor.isConnected ? 'pulse 2s infinite' : 'none',
                        boxShadow: monitor.isConnected ? '0 0 10px rgba(74, 222, 128, 0.5)' : 'none',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 }
                        }
                    }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {monitor.statusMessage}
                </Typography>
            </Stack>

            {monitor.error && (
                <Alert severity="error" onClose={monitor.clearError} sx={{ mb: 3 }}>
                    {monitor.error}
                </Alert>
            )}

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
                    interval={monthAverageCpuUsage !== 0 ? t("routers.snmpMonitor.dashboard.cpuStatCard.lastMonth") : t('routers.snmpMonitor.dashboard.noDataCollected')}
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

            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Monitoramento em Tempo Real
            </Typography>

            <Stack spacing={3}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3,
                        bgcolor: '#0C1017',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Uso de Memória: <Box component="span" sx={{ color: '#8b5cf6', fontWeight: 600 }}>{currentMemory.toFixed(1)} MB</Box>
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={memoryChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="rgba(255, 255, 255, 0.05)"
                                vertical={false}
                            />
                            <XAxis 
                                dataKey="timestamp" 
                                tick={false}
                                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                label={{ 
                                    value: 'Tempo', 
                                    position: 'insideBottom', 
                                    offset: -5,
                                    style: { fill: '#999', fontSize: 12 }
                                }}
                            />
                            <YAxis 
                                stroke="rgba(255, 255, 255, 0.3)"
                                tick={{ fill: '#999', fontSize: 12 }}
                                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                label={{ 
                                    value: 'MB', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    style: { fill: '#999', fontSize: 12 }
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#8b5cf6" 
                                strokeWidth={3}
                                fill="url(#colorMemory)"
                                activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                                animationDuration={500}
                                isAnimationActive={true}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>

                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3,
                        bgcolor: '#0C1017',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Uso de CPU: <Box component="span" sx={{ color: '#10b981', fontWeight: 600 }}>{currentCpu.toFixed(1)}%</Box>
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={cpuChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="rgba(255, 255, 255, 0.05)"
                                vertical={false}
                            />
                            <XAxis 
                                dataKey="timestamp" 
                                tick={false}
                                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                label={{ 
                                    value: 'Tempo', 
                                    position: 'insideBottom', 
                                    offset: -5,
                                    style: { fill: '#999', fontSize: 12 }
                                }}
                            />
                            <YAxis 
                                domain={[0, 100]}
                                stroke="rgba(255, 255, 255, 0.3)"
                                tick={{ fill: '#999', fontSize: 12 }}
                                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                label={{ 
                                    value: '%', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    style: { fill: '#999', fontSize: 12 }
                                }}
                            />
                            <Tooltip content={<CustomTooltip unit="%" />} />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                animationDuration={300}
                                fill="url(#colorCpu)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>

                {diskChartData.length > 0 && (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3,
                            bgcolor: 'rgba(30, 30, 30, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                            Uso de Disco: <Box component="span" sx={{ color: '#f59e0b', fontWeight: 600 }}>{currentDisk.toFixed(1)} MB</Box>
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={diskChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="rgba(255, 255, 255, 0.05)"
                                    vertical={false}
                                />
                                <XAxis 
                                    dataKey="timestamp" 
                                    tick={false}
                                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                    label={{ 
                                        value: 'Tempo', 
                                        position: 'insideBottom', 
                                        offset: -5,
                                        style: { fill: '#999', fontSize: 12 }
                                    }}
                                />
                                <YAxis 
                                    stroke="rgba(255, 255, 255, 0.3)"
                                    tick={{ fill: '#999', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                    label={{ 
                                        value: 'MB', 
                                        angle: -90, 
                                        position: 'insideLeft',
                                        style: { fill: '#999', fontSize: 12 }
                                    }}
                                />
                                <Tooltip content={<CustomTooltip unit="MB" />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#f59e0b" 
                                    strokeWidth={3}
                                    activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                                    animationDuration={300}
                                    fill="url(#colorDisk)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                )}
            </Stack>
        </Box>
    );
}