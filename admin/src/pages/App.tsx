import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardHeader, CardBody, Flex, Badge, Divider } from "@strapi/design-system";
import { useFetchClient } from "@strapi/strapi/admin";
import { ChartPie, Globe, User, File, TrendUp, ArrowDown, Calendar } from "@strapi/icons";
import StatsChart from '../components/StatsChart';
import StatsTable from '../components/StatsTable';

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

const App = () => {
  const { get } = useFetchClient();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const { data } = await get("/insights-strapi/stats");

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Box padding={8}>
        <Flex justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="beta" textColor="neutral500">
            Loading insights...
          </Typography>
        </Flex>
      </Box>
    );
  }

  return (
    <Box padding={6}>
      {/* Header Section */}
      <Box marginBottom={6}>
        <Flex alignItems="center" gap={3} marginBottom={2}>
          <Box
            background="primary600"
            borderRadius={2}
            padding={2}
          >
            <ChartPie fill="white" width={24} height={24} />
          </Box>
          <Typography variant="alpha" fontWeight="bold">
            Insights Dashboard
          </Typography>
        </Flex>

        <Typography variant="epsilon" textColor="neutral600" marginBottom={3}>
          Monitor your website performance and visitor analytics in real-time
        </Typography>

        <Flex alignItems="center" gap={2}>
          <Calendar width={16} height={16} />
          <Typography variant="pi" textColor="neutral500">
            Last updated: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Flex>
      </Box>

      {/* Stats Grid */}
      <Grid.Root gap={4} marginBottom={8}>
        <Grid.Item col={3}>
          <StatCard
            icon={<ChartPie />}
            label="Total Visits"
            value={stats?.totalVisits?.toLocaleString() ?? "—"}
            change={stats?.trends?.totalVisits}
            changeType="negative"
          />
        </Grid.Item>

        <Grid.Item col={3}>
          <StatCard
            icon={<Globe />}
            label="Traffic Sources"
            value={stats?.uniqueSources ?? "—"}
            change={stats?.trends?.uniqueSources}
            changeType="positive"
          />
        </Grid.Item>

        <Grid.Item col={3}>
          <StatCard
            icon={<File />}
            label="Active Campaigns"
            value={stats?.campaigns ?? "—"}
            change={stats?.trends?.campaigns}
            changeType="positive"
          />
        </Grid.Item>

        <Grid.Item col={3}>
          <StatCard
            icon={<User />}
            label="Today's Visitors"
            value={stats?.today ?? "—"}
            change={stats?.trends?.today}
            changeType="positive"
          />
        </Grid.Item>
      </Grid.Root>

      <Divider marginBottom={6} />

      {/* Chart Section */}
      <Box>
        <StatsChart data={stats?.chartData ?? []} />
      </Box>

      <Divider marginBottom={6} />

      {/* Stats Table */}
      <Box>
        <StatsTable data={stats?.chartData ?? []} />
      </Box>
    </Box>
  );
};

export { App };