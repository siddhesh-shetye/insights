import React from 'react';
import { Box, Typography, Card, Flex } from "@strapi/design-system";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Define colors for different sources
const COLORS = [
    '#4f46e5', // Primary blue
    '#06b6d4', // Cyan
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#f97316', // Orange
    '#84cc16', // Lime
];

interface PieChartData {
    source: string;
    count: number;
    percentage?: number;
}

interface StatsPieChartProps {
    data: PieChartData[];
    isLoading?: boolean;
    error?: string | null;
}

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <Box
                background="neutral0"
                padding={3}
                borderRadius="4px"
                style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0'
                }}
            >
                <Typography variant="omega" fontWeight="semiBold" marginBottom={3}>
                    {data.payload.source}
                </Typography>
                <Flex direction="column" gap={1}>
                    <Typography variant="pi" textColor="neutral600">
                        Visits: {data.payload.count.toLocaleString()}
                    </Typography>
                    <Typography variant="pi" textColor="neutral600">
                        Share: {data.payload.percentage?.toFixed(1)}%
                    </Typography>
                </Flex>
            </Box>
        );
    }
    return null;
};

// Custom legend component
const CustomLegend = ({ payload }: any) => {
    return (
        <Box paddingTop={4}>
            <Flex direction="column" gap={2}>
                {payload.map((entry: any, index: number) => (
                    <Flex key={index} alignItems="center" gap={2}>
                        <Box
                            width="12px"
                            height="12px"
                            borderRadius="2px"
                            style={{ backgroundColor: entry.color }}
                        />
                        <Typography variant="pi" textColor="neutral600">
                            {entry.value}: {entry.payload.count.toLocaleString()} visits
                        </Typography>
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
};

// Helper component for loading state
const LoadingBox = ({ height = "400px" }: { height?: string }) => (
    <Box style={{ minHeight: height }}>
        <Flex justifyContent="center" alignItems="center" style={{ height: "100%" }}>
            <Typography variant="omega" textColor="neutral500">
                Loading chart...
            </Typography>
        </Flex>
    </Box>
);

// Helper component for error state
const ErrorBox = ({ error, height = "400px" }: { error: string; height?: string }) => (
    <Box style={{ minHeight: height }}>
        <Flex justifyContent="center" alignItems="center" style={{ height: "100%" }}>
            <Typography variant="omega" textColor="danger600">
                {error}
            </Typography>
        </Flex>
    </Box>
);

const StatsPieChart: React.FC<StatsPieChartProps> = ({
    data,
    isLoading = false,
    error = null
}) => {
    // Calculate percentages
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);
    const chartData = data.map(item => ({
        ...item,
        percentage: totalCount > 0 ? (item.count / totalCount) * 100 : 0
    }));

    if (isLoading) {
        return (
            <Card padding={4}>
                <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
                    Traffic Sources Distribution
                </Typography>
                <LoadingBox />
            </Card>
        );
    }

    if (error) {
        return (
            <Card padding={4}>
                <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
                    Traffic Sources Distribution
                </Typography>
                <ErrorBox error={error} />
            </Card>
        );
    }

    if (!data.length) {
        return (
            <Card padding={4}>
                <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
                    Traffic Sources Distribution
                </Typography>
                <Box style={{ minHeight: "400px" }}>
                    <Flex justifyContent="center" alignItems="center" style={{ height: "100%" }}>
                        <Typography variant="omega" textColor="neutral500">
                            No traffic source data available
                        </Typography>
                    </Flex>
                </Box>
            </Card>
        );
    }

    return (
        <Card padding={4}>
            <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
                Traffic Sources Distribution
            </Typography>

            <Flex direction="row" gap={6}>
                {/* Pie Chart */}
                <Box style={{ flex: 1, minHeight: '400px' }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={2}
                                dataKey="count"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

                {/* Legend */}
                <Box style={{ flex: 1, paddingTop: '60px' }}>
                    <Typography variant="delta" fontWeight="semiBold" marginBottom={3}>
                        Source Breakdown
                    </Typography>
                    <Flex direction="column" gap={3}>
                        {chartData.map((entry, index) => (
                            <Flex key={index} alignItems="center" justifyContent="space-between" padding={2} background="neutral100" borderRadius="4px">
                                <Flex alignItems="center" gap={3}>
                                    <Box
                                        width="16px"
                                        height="16px"
                                        borderRadius="4px"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <Typography variant="omega" fontWeight="semiBold">
                                        {entry.source}
                                    </Typography>
                                </Flex>
                                <Flex direction="column" alignItems="flex-end" gap={1}>
                                    <Typography variant="omega" fontWeight="bold">
                                        {entry.count.toLocaleString()}
                                    </Typography>
                                    <Typography variant="pi" textColor="neutral600">
                                        {entry.percentage?.toFixed(1)}%
                                    </Typography>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>

                    {/* Total */}
                    <Box marginTop={4} padding={3} background="primary100" borderRadius="8px">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Typography variant="omega" fontWeight="semiBold" textColor="primary700">
                                Total Visits
                            </Typography>
                            <Typography variant="delta" fontWeight="bold" textColor="primary700">
                                {totalCount.toLocaleString()}
                            </Typography>
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        </Card>
    );
};

export default StatsPieChart;