import { Box, Typography, Card } from "@strapi/design-system";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StatsChart = ({ data }: { data: any[] }) => (
    <Card padding={4}>
        <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
            Visitor Trends
        </Typography>

        <Box style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
                    <CartesianGrid stroke="#e2e8f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    </Card>
);

export default StatsChart;