import { Box, Paper, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type DiskUsageDonutChartProps = {
    currentDisk: number;
    totalDisk: number;
}

export default function DiskUsageDonutChart({ currentDisk, totalDisk }: DiskUsageDonutChartProps) {
    const safeTotalDisk = totalDisk || 0;
    const safeCurrentDisk = currentDisk || 0;
    const usedPercentage = safeTotalDisk > 0 ? ((safeCurrentDisk / safeTotalDisk) * 100) : 0;
    const freeDisk = safeTotalDisk - safeCurrentDisk;
    
    const data = [
        { name: 'Usado', value: safeCurrentDisk, color: '#f59e0b' },
        { name: 'Livre', value: freeDisk > 0 ? freeDisk : 0, color: 'rgba(255, 255, 255, 0.05)' }
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                bgcolor: '#0C1017',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                height: 330,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Distribuição de Disco
            </Typography>
            
            <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                minHeight: 0
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            animationDuration={500}
                            animationEasing="ease-in-out"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            color: '#f59e0b', 
                            fontWeight: 700,
                            fontSize: '2.5rem',
                            lineHeight: 1
                        }}
                    >
                        {usedPercentage.toFixed(1)}%
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.5)',
                            mt: 0.5,
                            fontSize: '0.875rem'
                        }}
                    >
                        Em uso
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ 
                mt: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                pt: 2,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                        Usado
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                        {safeCurrentDisk.toFixed(1)} MB
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                        Livre
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                        {freeDisk.toFixed(1)} MB
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                        Total
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                        {safeTotalDisk.toFixed(1)} MB
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}