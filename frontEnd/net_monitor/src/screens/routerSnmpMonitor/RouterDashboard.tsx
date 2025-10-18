import { useOutletContext } from "react-router-dom";
import StatCard from "../../components/StatCard";
import { Stack, Box } from "@mui/material";
import { useI18n } from "../../hooks/usei18n";
import MemoryUsageLineChart from "./charts/MemoryUsageLineChart";
import MemoryUsagePieChart from "./charts/MemoryUsagePieChart";
import CpuUsageLineChart from "./charts/CpuUsageLineChart";
import DiskUsageLineChart from "./charts/DiskUsageLineChart";
import DiskUsagePieChart from "./charts/DiskUsagePieChart";
import UptimeCard from "./charts/UptimeCard";

type RouterDataContext = {
    uptime: string;
    monthlyMemoryData: any;
    monthlyCpuData: any;
    monthlyDiskData: any;
    currentMemory: number;
    memoryChartData: any[];
    totalMemory: number;
    currentCpu: number;
    cpuChartData: any[];
    currentDisk: number;
    diskChartData: any[];
    totalDisk: number;
};

export default function RouterDashboard() {
    const { t } = useI18n();
    const {
        uptime,
        monthlyMemoryData,
        monthlyCpuData,
        monthlyDiskData,
        currentMemory,
        memoryChartData,
        totalMemory,
        currentCpu,
        cpuChartData,
        currentDisk,
        diskChartData,
        totalDisk
    } = useOutletContext<RouterDataContext>();

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <UptimeCard uptime={uptime} />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
                <StatCard
                    title={t("routers.snmpMonitor.dashboard.memoryStatCard.averageMemoryUsage")}
                    value={monthlyMemoryData.average > 0 ? `${monthlyMemoryData.average.toFixed(1)}MB` : "0MB"}
                    interval={
                        monthlyMemoryData.values.length > 0
                            ? t("routers.snmpMonitor.dashboard.memoryStatCard.lastMonth")
                            : t('routers.snmpMonitor.dashboard.noDataCollected')
                    }
                    trend="neutral"
                    data={monthlyMemoryData.values}
                    color="purple"
                />
                <StatCard
                    title={t("routers.snmpMonitor.dashboard.cpuStatCard.averageCpuUsage")}
                    value={monthlyCpuData.average > 0 ? `${monthlyCpuData.average.toFixed(1)}%` : "0%"}
                    interval={
                        monthlyCpuData.values.length > 0
                            ? t("routers.snmpMonitor.dashboard.cpuStatCard.lastMonth")
                            : t('routers.snmpMonitor.dashboard.noDataCollected')
                    }
                    trend="neutral"
                    data={monthlyCpuData.values}
                    color="green"
                />
                <StatCard
                    title={t("routers.snmpMonitor.dashboard.diskStatCard.averageDiskUsage")}
                    value={monthlyDiskData.average > 0 ? `${monthlyDiskData.average.toFixed(1)}MB` : "0MB"}
                    interval={
                        monthlyDiskData.average > 0
                            ? t("routers.snmpMonitor.dashboard.diskStatCard.lastMonth")
                            : t('routers.snmpMonitor.dashboard.noDataCollected')
                    }
                    trend="neutral"
                    data={monthlyDiskData.values}
                    color="amber"
                />
            </Stack>

            <Stack spacing={3}>
                <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={3}
                >
                    <Box sx={{ flex: { xs: 1, lg: 2 }, minWidth: 0 }}>
                        <MemoryUsageLineChart
                            currentMemory={currentMemory}
                            memoryChartData={memoryChartData}
                        />
                    </Box>
                    <Box sx={{ flex: { xs: 1, lg: 1 }, minWidth: 0 }}>
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
                    <Box sx={{ flex: { xs: 1, lg: 2 }, minWidth: 0 }}>
                        <DiskUsageLineChart
                            currentDisk={currentDisk}
                            diskChartData={diskChartData}
                        />
                    </Box>
                    <Box sx={{ flex: { xs: 1, lg: 1 }, minWidth: 0 }}>
                        <DiskUsagePieChart
                            currentDisk={currentDisk}
                            totalDisk={totalDisk}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
}