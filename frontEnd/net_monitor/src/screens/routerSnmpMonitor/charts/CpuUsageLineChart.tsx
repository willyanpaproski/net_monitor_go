import { Box, Paper, Typography } from "@mui/material";
import type { LineChartDataPoint } from "../../../types/LineChartDataPoint";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomChartTooltip from "../../../components/CustomChartTooltip";
import { useState, useEffect } from "react";

type CpuUsageLineChartProps = {
    currentCpu: number;
    cpuChartData: LineChartDataPoint[];
}

export default function CpuUsageLineChart({ currentCpu, cpuChartData }: CpuUsageLineChartProps) {
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        setTimeout(() => setShow(true), 300);
    }, []);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                bgcolor: '#0C1017',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(16px)',
                '&:hover': {
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)',
                    transform: 'translateY(-2px)'
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                    opacity: 0.6
                }
            }}
        >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Uso de CPU: <Box component="span" sx={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>{currentCpu.toFixed(1)}%</Box>
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={cpuChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.5}/>
                            <stop offset="50%" stopColor="#10b981" stopOpacity={0.25}/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.03)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="timestamp"
                        tick={false}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        stroke="rgba(255, 255, 255, 0.2)"
                        tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                        label={{
                            value: '%',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }
                        }}
                    />
                    <Tooltip content={<CustomChartTooltip unit="%" />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#colorCpu)"
                        activeDot={{ r: 8, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1000}
                        animationBegin={400}
                        isAnimationActive={true}
                        animationEasing="ease-out"
                        dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Paper>
    );
}