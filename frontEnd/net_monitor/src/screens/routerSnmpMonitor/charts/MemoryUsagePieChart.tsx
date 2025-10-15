import { Box, Paper, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

type MemoryUsageDonutChartProps = {
    currentMemory: number;
    totalMemory: number;
}

export default function MemoryUsageDonutChart({ currentMemory, totalMemory }: MemoryUsageDonutChartProps) {
    const [show, setShow] = useState(false);
    const [animateText, setAnimateText] = useState(false);
    const usedPercentage = totalMemory > 0 ? ((currentMemory / totalMemory) * 100) : 0;
    const freeMemory = totalMemory - currentMemory;
    
    useEffect(() => {
        setTimeout(() => setShow(true), 200);
        setTimeout(() => setAnimateText(true), 1200);
    }, []);
    
    const data = [
        { name: 'Usado', value: currentMemory, color: '#8b5cf6' },
        { name: 'Livre', value: freeMemory > 0 ? freeMemory : 0, color: 'rgba(255, 255, 255, 0.03)' }
    ];

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
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
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
                Distribuição de Memória
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
                        <defs>
                            <filter id="shadow">
                                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#8b5cf6" floodOpacity="0.3"/>
                            </filter>
                        </defs>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            animationDuration={1200}
                            animationBegin={300}
                            animationEasing="ease-out"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color}
                                    stroke="none"
                                    filter={index === 0 ? "url(#shadow)" : "none"}
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
                            color: '#8b5cf6', 
                            fontWeight: 800,
                            fontSize: '1.8rem',
                            lineHeight: 1,
                            textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: animateText ? 1 : 0,
                            transform: animateText ? 'scale(1)' : 'scale(0.75)'
                        }}
                    >
                        {usedPercentage.toFixed(1)}%
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.5)',
                            mt: 0.5,
                            fontSize: '0.875rem',
                            fontWeight: 500
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
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem', mb: 0.5 }}>
                        Usado
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#8b5cf6', fontWeight: 700, fontSize: '0.95rem' }}>
                        {currentMemory.toFixed(1)} MB
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem', mb: 0.5 }}>
                        Livre
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, fontSize: '0.95rem' }}>
                        {freeMemory.toFixed(1)} MB
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem', mb: 0.5 }}>
                        Total
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, fontSize: '0.95rem' }}>
                        {totalMemory.toFixed(1)} MB
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}