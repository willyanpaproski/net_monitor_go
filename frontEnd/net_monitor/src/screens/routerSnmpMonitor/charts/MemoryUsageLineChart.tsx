import { Box, Paper, Typography } from "@mui/material";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomChartTooltip from "../../../components/CustomChartTooltip";
import type { LineChartDataPoint } from "../../../types/LineChartDataPoint";

type MemoryUsageLineChartProps = {
    currentMemory: number;
    memoryChartData: LineChartDataPoint[];
}

export default function MemoryUsageLineChart({ currentMemory, memoryChartData }: MemoryUsageLineChartProps) {
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
                Uso de Memória <Box component="span" sx={{ color: '#8b5cf6', fontWeight: 600 }}>{currentMemory.toFixed(1)} MB</Box>
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
                    <Tooltip content={<CustomChartTooltip  />} />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        fill="url(#colorMemory)"
                        activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={500}
                        isAnimationActive={true}
                        animationEasing="ease-in"
                        dot={true}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Paper>
    );
}