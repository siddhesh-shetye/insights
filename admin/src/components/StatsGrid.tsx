import React from "react";
import { Box, Typography, Grid, Card, CardHeader, CardBody, Flex, Badge } from "@strapi/design-system";
import { ChartPie, Globe, User, File, TrendUp, ArrowDown } from "@strapi/icons";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    change,
    changeType = 'neutral'
}) => {
    const getChangeVariant = () => {
        switch (changeType) {
            case 'positive': return 'success';
            case 'negative': return 'danger';
            default: return 'neutral';
        }
    };

    const getTrendIcon = () => {
        switch (changeType) {
            case 'positive': return <TrendUp width={12} height={12} />;
            case 'negative': return <ArrowDown width={12} height={12} />;
            default: return <TrendUp width={12} height={12} />;
        }
    };

    return (
        <Card padding={4}>
            <CardHeader paddingBottom={3}>
                <Flex alignItems="center" gap={3}>
                    <Box
                        background="primary100"
                        borderRadius={2}
                        padding={2}
                    >
                        {icon}
                    </Box>
                    <Typography variant="omega" fontWeight="semiBold" textColor="neutral600">
                        {label.toUpperCase()}
                    </Typography>
                </Flex>
            </CardHeader>

            <CardBody paddingTop={0}>
                <Flex direction="column" gap={2}>
                    <Typography variant="alpha" fontWeight="bold">
                        {value}
                    </Typography>

                    {change && (
                        <Flex alignItems="center" gap={2}>
                            {getTrendIcon()}
                            <Badge variant={getChangeVariant()} size="S">
                                {change}
                            </Badge>
                            <Typography variant="pi" textColor="neutral500">
                                vs last week
                            </Typography>
                        </Flex>
                    )}
                </Flex>
            </CardBody>
        </Card>
    );
};

// Helper component for loading state
const LoadingBox = ({ height = "150px" }: { height?: string }) => (
    <Box style={{ minHeight: height }}>
        <Flex justifyContent="center" alignItems="center" style={{ height: "100%" }}>
            <Typography variant="omega" textColor="neutral500">
                Loading...
            </Typography>
        </Flex>
    </Box>
);

// Helper component for error state
const ErrorBox = ({ error, height = "150px" }: { error: string; height?: string }) => (
    <Box style={{ minHeight: height }}>
        <Flex justifyContent="center" alignItems="center" style={{ height: "100%" }}>
            <Typography variant="omega" textColor="danger600">
                {error}
            </Typography>
        </Flex>
    </Box>
);

interface StatsGridProps {
    statsData: any;
    statsLoading: boolean;
    statsError: string | null;
}

const StatsGrid: React.FC<StatsGridProps> = ({
    statsData,
    statsLoading,
    statsError
}) => {
    return (
        <Grid.Root gap={4} marginBottom={8}>
            {statsLoading ? (
                <Grid.Item col={12}>
                    <LoadingBox height="150px" />
                </Grid.Item>
            ) : statsError ? (
                <Grid.Item col={12}>
                    <ErrorBox error={statsError} height="150px" />
                </Grid.Item>
            ) : (
                <>
                    <Grid.Item col={3}>
                        <StatCard
                            icon={<ChartPie />}
                            label="Total Visits"
                            value={statsData?.totalVisits?.value?.toLocaleString() ?? "—"}
                            change={statsData?.totalVisits?.percentage}
                            changeType={statsData?.totalVisits?.mood}
                        />
                    </Grid.Item>

                    <Grid.Item col={3}>
                        <StatCard
                            icon={<Globe />}
                            label="Traffic Sources"
                            value={statsData?.uniqueSources?.value?.toLocaleString() ?? "—"}
                            change={statsData?.uniqueSources?.percentage}
                            changeType={statsData?.uniqueSources?.mood}
                        />
                    </Grid.Item>

                    <Grid.Item col={3}>
                        <StatCard
                            icon={<File />}
                            label="Active Campaigns"
                            value={statsData?.campaigns?.value?.toLocaleString() ?? "—"}
                            change={statsData?.campaigns?.percentage}
                            changeType={statsData?.campaigns?.mood}
                        />
                    </Grid.Item>

                    <Grid.Item col={3}>
                        <StatCard
                            icon={<User />}
                            label="Today's Visitors"
                            value={statsData?.today?.value?.toLocaleString() ?? "—"}
                            change={statsData?.today?.percentage}
                            changeType={statsData?.today?.mood}
                        />
                    </Grid.Item>
                </>
            )}
        </Grid.Root>
    );
};

export default StatsGrid;