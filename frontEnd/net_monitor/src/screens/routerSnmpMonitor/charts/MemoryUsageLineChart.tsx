import { Box, Paper, Typography } from "@mui/material";
import type { LineChartDataPoint } from "../../../types/LineChartDataPoint";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomChartTooltip from "../../../components/CustomChartTooltip";
import { useState, useEffect } from "react";

type MemoryUsageLineChartProps = {
    currentMemory: number;
    memoryChartData: LineChartDataPoint[];
}

export default function MemoryUsageLineChart({ currentMemory, memoryChartData }: MemoryUsageLineChartProps) {
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        setTimeout(() => setShow(true), 100);
    }, []);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                bgcolor: '#0C1017',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                height: 330,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(16px)',
                '&:hover': {
                    borderColor: 'rgba(139, 92, 246, 0.4)',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
                    transform: 'translateY(-2px)'
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                    opacity: 0.6
                }
            }}
        >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Uso de Memória: <Box component="span" sx={{ color: '#8b5cf6', fontWeight: 700, fontSize: '1.1rem' }}>{currentMemory.toFixed(1)} MB</Box>
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={memoryChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
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
                        stroke="rgba(255, 255, 255, 0.2)"
                        tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                        label={{
                            value: 'MB',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }
                        }}
                    />
                    <Tooltip content={<CustomChartTooltip unit="MB" />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fill="url(#colorMemory)"
                        activeDot={{ 
                            r: 8, 
                            fill: '#8b5cf6', 
                            stroke: '#fff', 
                            strokeWidth: 2,
                            filter: 'url(#glow)'
                        }}
                        animationDuration={1000}
                        animationBegin={200}
                        isAnimationActive={true}
                        animationEasing="ease-out"
                        dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Paper>
    );
}