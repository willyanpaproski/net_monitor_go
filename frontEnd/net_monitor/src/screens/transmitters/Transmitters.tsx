import type { GridColDef } from "@mui/x-data-grid";
import type { DataTableItem } from "../../components/DataTable/DataTable";
import { useI18n } from "../../hooks/usei18n";
import * as React from "react";
import { Box, Chip } from "@mui/material";
import GenericDataTable from "../../components/DataTable/DataTable";
import { useDataTableFetch } from "../../api/GenericDataTableFetch";
import { useDeleteTransmitter } from "../../api/Transmitters";
import { toast } from "react-toastify";

interface Transmitter extends DataTableItem {
    id: string;
    accessPassword: string;
    accessUser: string;
    active: boolean;
    description: string;
    integration: string;
    ipAddress: string;
    name: string;
    snmpCommunity: string;
    snmoPort: string;
    updated_at: Date;
    created_at: Date;
}

export default function Transmitters() {
    const { t } = useI18n();
    const deleteTransmitterMutation = useDeleteTransmitter();

    const columns: GridColDef[] = React.useMemo(() => [
        {
            field: 'name',
            headerName: t('transmitters.dataTable.headers.name'),
            width: 180,
            flex: 0
        },
        {
            field: 'description',
            headerName: t('transmitters.dataTable.headers.description'),
            width: 250,
            flex: 0
        },
        {
            field: 'active',
            headerName: t('transmitters.dataTable.headers.status'),
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Ativo': 'Inativo'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                />
            )
        },
        {
            field: 'integration',
            headerName: t('transmitters.dataTable.headers.integration'),
            width: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.value}
                    color="primary"
                    size="small"
                    variant="outlined"
                />
            )
        },
        {
            field: 'ipAddress',
            headerName: t('transmitters.dataTable.headers.ipAddress'),
            width: 140,
            renderCell: (params) => (
                <span style={{ fontFamily: 'monospace' }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'accessUser',
            headerName: t('transmitters.dataTable.headers.user'),
            width: 120
        },
        {
            field: 'snmpCommunity',
            headerName: t('transmitters.dataTable.headers.snmpCommunity'),
            width: 140
        },
        {
            field: 'snmpPort',
            headerName: t('transmitters.dataTable.headers.snmpPort'),
            width: 110,
            renderCell: (params) => (
                <span style={{ fontFamily: 'monospace' }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'created_at',
            headerName: t('transmitters.dataTable.headers.createdAt'),
            type: 'dateTime',
            width: 160,
            valueGetter: (value) => {
                if (!value || value === '1970-01-01T00:00:00Z') {
                    return null;
                }
                return new Date(value);
            },
            renderCell: (params) => {
                if (!params.value) {
                    return <span style={{ color: '#666', fontStyle: 'italic' }}>N/A</span>;
                }
                return params.value.toLocaleString('pt-BR');
            }
        },
        {
            field: 'updated_at',
            headerName: t('transmitters.dataTable.headers.updatedAt'),
            type: 'dateTime',
            width: 160,
            valueGetter: (value) => {
                if (!value || value === '1970-01-01T00:00:00Z') {
                    return null;
                }
                return new Date(value);
            },
            renderCell: (params) => {
                if (!params.value) {
                    return <span style={{ color: '#666', fontStyle: 'italic' }}>N/A</span>;
                }
                return params.value.toLocaleString('pt-BR');
            }
        }
    ], []);

    const deleteTransmitter = React.useCallback(async (id: string) => {
        return deleteTransmitterMutation.mutateAsync(id);
    }, [deleteTransmitterMutation]);

    return (
        <Box sx={{
            mt: 3,
            ml: 2,
            flex: 1,
            width: "calc(100% - 240px)"
        }}>
            <GenericDataTable<Transmitter>
                title="Transmissores"
                columns={columns}
                fetchData={useDataTableFetch<Transmitter>('http://localhost:9090/api/transmitters')}
                deleteItem={deleteTransmitter}
                basePath="/transmitters"
                enableCreate={true}
                enableEdit={true}
                enableDelete={true}
                enableRowClick={true}
                initialPageSize={10}
                pageSizeOptions={[5, 10, 25, 50]}
                onDeleteSuccess={() => toast.success(t('transmitters.dataTable.deleteSuccess'))}
                onDeleteError={() => toast.error(t('transmitters.dataTable.deleteError'))}
            />
        </Box>
    );
}