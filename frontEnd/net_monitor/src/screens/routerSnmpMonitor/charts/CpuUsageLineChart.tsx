import { Box, Paper, Typography } from "@mui/material";
import type { LineChartDataPoint } from "../../../types/LineChartDataPoint";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomChartTooltip from "../../../components/CustomChartTooltip";

type CpuUsageLineChartProps = {
    currentCpu: number;
    cpuChartData: LineChartDataPoint[];
}

export default function CpuUsageLineChart({ currentCpu, cpuChartData }: CpuUsageLineChartProps) {
    return (
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
                <AreaChart data={cpuChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                    <Tooltip content={<CustomChartTooltip unit="%" />} />
                    <Area 
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#colorCpu)"
                        activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
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