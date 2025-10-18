import { useState, useMemo } from 'react';
import { Box, Card, Typography, Chip, Stack, TextField, InputAdornment } from '@mui/material';
import { Cable, SettingsEthernet, Search as SearchIcon } from '@mui/icons-material';

interface PhysicalInterface {
    index: string;
    name: string;
    type: number;
    mac_address: string;
    ip_address?: string[];
}

interface PhysicalInterfacesDashboardProps {
    interfaces?: PhysicalInterface[];
}

export default function PhysicalInterfacesDashboard({ interfaces = [] }: PhysicalInterfacesDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const getInterfaceTypeLabel = (type: number): string => {
        const types: Record<number, string> = {
            6: 'Ethernet',
            24: 'Loopback',
            131: 'Tunnel',
            135: 'Bridge'
        };
        return types[type] || `Type ${type}`;
    };

    const filteredInterfaces = useMemo(() => {
        if (!searchTerm) return interfaces;
        
        return interfaces.filter(iface => 
            iface.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iface.mac_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iface.ip_address?.some(ip => ip.includes(searchTerm))
        );
    }, [interfaces, searchTerm]);

    if (!interfaces || interfaces.length === 0) {
        return (
            <Card 
                sx={{ 
                    bgcolor: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            >
                <Cable sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                    Nenhuma interface encontrada
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Aguardando coleta de dados das interfaces físicas
                </Typography>
            </Card>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ 
                mb: 3, 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2
            }}>
                <Box>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            color: '#e2e8f0',
                            fontWeight: 600,
                            mb: 0.5
                        }}
                    >
                        Interfaces Físicas
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {filteredInterfaces.length} {filteredInterfaces.length === 1 ? 'interface detectada' : 'interfaces detectadas'}
                    </Typography>
                </Box>
                
                <TextField
                    placeholder="Buscar interfaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    sx={{
                        width: { xs: '100%', sm: 300 },
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(15, 23, 42, 0.6)',
                            color: '#e2e8f0',
                            '& fieldset': {
                                borderColor: 'rgba(148, 163, 184, 0.2)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(148, 163, 184, 0.3)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#8b5cf6',
                            },
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: '#64748b',
                            opacity: 1,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 18, color: '#64748b' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Stack spacing={2} sx={{ width: '100%' }}>
                {filteredInterfaces.map((iface) => (
                    <Card
                        key={iface.index}
                        sx={{
                            bgcolor: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                            borderRadius: 2,
                            p: 3,
                            transition: 'all 0.2s ease',
                            width: '100%',
                            '&:hover': {
                                borderColor: 'rgba(139, 92, 246, 0.3)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, width: '100%' }}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <SettingsEthernet sx={{ fontSize: 28, color: '#8b5cf6' }} />
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            color: '#e2e8f0',
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {iface.name}
                                    </Typography>
                                    <Chip 
                                        label={getInterfaceTypeLabel(iface.type)}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(139, 92, 246, 0.2)',
                                            color: '#a78bfa',
                                            border: '1px solid rgba(139, 92, 246, 0.3)',
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                    <Chip 
                                        label={`Index: ${iface.index}`}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(71, 85, 105, 0.3)',
                                            color: '#94a3b8',
                                            border: '1px solid rgba(148, 163, 184, 0.2)',
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                </Box>

                                <Box sx={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr' }, 
                                    gap: 3,
                                    width: '100%'
                                }}>
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: '#64748b',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontWeight: 600,
                                                display: 'block',
                                                mb: 0.5
                                            }}
                                        >
                                            Endereço MAC
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#cbd5e1',
                                                fontFamily: 'monospace',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {iface.mac_address || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: '#64748b',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontWeight: 600,
                                                display: 'block',
                                                mb: 0.5
                                            }}
                                        >
                                            Endereços IP
                                        </Typography>
                                        {iface.ip_address && iface.ip_address.length > 0 ? (
                                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                                                {iface.ip_address.map((ip, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={ip}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(34, 197, 94, 0.1)',
                                                            color: '#4ade80',
                                                            border: '1px solid rgba(34, 197, 94, 0.3)',
                                                            fontFamily: 'monospace',
                                                            fontSize: '0.8rem',
                                                            height: 24
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: '#64748b',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                Nenhum IP configurado
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </Stack>

            {filteredInterfaces.length === 0 && searchTerm && (
                <Card 
                    sx={{ 
                        bgcolor: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        mt: 2,
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <SearchIcon sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                        Nenhum resultado encontrado
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Tente ajustar os termos de busca
                    </Typography>
                </Card>
            )}
        </Box>
    );
}