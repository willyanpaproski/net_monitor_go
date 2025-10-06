import { useSnmpMonitor } from "../../hooks/useSnmpMonitor";
import { useEffect, useMemo } from "react";
import StatCard from "../../components/StatCard";
import { Stack } from "@mui/material";
import { useI18n } from "../../hooks/usei18n";
import { useParams } from "react-router-dom";
import { useRouter } from "../../api/Routers";

export default function RouterSnmpMonitor() {
    const { t } = useI18n();
    const { routerId } = useParams<{ routerId: string }>();
    const router = useRouter(routerId!);

    const monitor = useSnmpMonitor({
        apiUrl: "http://localhost:9090",
        serverUrl: "ws://localhost:9090/ws/snmp",
        autoReconnect: true,
        reconnectInterval: 5000,
    });

    useEffect(() => {
        const dados = monitor.getRouterData(routerId!);
        if (dados) {
            console.log(dados.data);
        }
    }, [monitor.routerData, routerId]);

    const monthAverageMemoryUsage = useMemo(() => {
        if (!router.data?.monthAvarageMemoryUsage?.length) return 0;
        const soma = router.data.monthAvarageMemoryUsage.reduce(
            (acc, record) => acc + record.value,
            0
        );
        return soma / router.data.monthAvarageMemoryUsage.length;
    }, [router.data]);

    const monthAverageCpuUsage = useMemo(() => {
        if (!router.data?.monthAverageCpuUsage?.length) return 0;
        const soma = router.data.monthAverageCpuUsage.reduce(
            (acc, record) => acc + record.value,
            0
        ); 
        return soma / router.data.monthAverageCpuUsage.length;
    }, [router.data]);

    const monthAverageDiskUsage = useMemo(() => {
        if (!router.data?.monthAverageDiskUsage?.length) return 0; 
        const soma = router.data.monthAverageDiskUsage.reduce(
            (acc, record) => acc + record.value,
            0
        );
        return soma / router.data.monthAverageDiskUsage.length;
    }, [router.data]);

    if (router.isLoading) {
        return <div>{t("loading")}...</div>;
    }

    if (router.isError) {
        return <div>Erro ao carregar roteador</div>;
    }

    return (
        <Stack direction={"row"} spacing={2} px={5}>
            <StatCard
                title={t(
                "routers.snmpMonitor.dashboard.memoryStatCard.averageMemoryUsage"
                )}
                value={monthAverageMemoryUsage.toFixed(1) + "MB"}
                interval={monthAverageMemoryUsage !== 0 ? t("routers.snmpMonitor.dashboard.memoryStatCard.lastMonth") : t('routers.snmpMonitor.dashboard.noDataCollected')}
                trend="up"
                data={router.data?.monthAvarageMemoryUsage.map((record) =>
                    Number(record.value.toFixed(1))
                ) || []}
            />
            <StatCard
                title={t("routers.snmpMonitor.dashboard.cpuStatCard.averageCpuUsage")}
                value={monthAverageCpuUsage + "%"}
                interval={monthAverageCpuUsage !== 0 ? t("routers.snmpMonitor.dashboard.cpuStatCard.lastMonth") : t('routers.snmpMonitor.dashboard.noDataCollected')}
                trend="up"
                data={router.data?.monthAverageCpuUsage.map(record => {
                    return record.value
                }) || []}
            />
            <StatCard
                title={t("routers.snmpMonitor.dashboard.diskStatCard.averageDiskUsage")}
                value={monthAverageDiskUsage + "MB"}
                interval={monthAverageDiskUsage !== 0 ? t("routers.snmpMonitor.dashboard.diskStatCard.lastMonth") : t('routers.snmpMonitor.dashboard.noDataCollected')}
                trend="up"
                data={router.data?.monthAverageDiskUsage.map((record) =>
                    Number(record.value.toFixed(1))
                ) || []}
            />
        </Stack>
    );
}
