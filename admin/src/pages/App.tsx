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

  // Separate state for each section
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  // Separate loading states
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);

  // Separate error states
  const [statsError, setStatsError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch stats data
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const { data } = await get("/insights-strapi/stats");
        setStatsData(data);
      } catch (err) {
        console.error("Failed to load stats", err);
        setStatsError("Failed to load statistics");
      } finally {
        setStatsLoading(false);
      }
    };

    // Function to fetch chart data
    const fetchChartData = async () => {
      try {
        setChartLoading(true);
        setChartError(null);
        const { data } = await get("/insights-strapi/chart");
        setChartData(data);
      } catch (err) {
        console.error("Failed to load chart data", err);
        setChartError("Failed to load chart data");
      } finally {
        setChartLoading(false);
      }
    };

    // Function to fetch table data
    const fetchTableData = async () => {
      try {
        setTableLoading(true);
        setTableError(null);
        const { data } = await get("/insights-strapi/table");
        setTableData(data);
      } catch (err) {
        console.error("Failed to load table data", err);
        setTableError("Failed to load table data");
      } finally {
        setTableLoading(false);
      }
    };

    // Run all API calls simultaneously
    Promise.allSettled([
      fetchStats(),
      fetchChartData(),
      fetchTableData()
    ]);

  }, [get]);

  // Helper component for loading state
  const LoadingBox = ({ height = "200px" }: { height?: string }) => (
    <Box style={{ minHeight: height }}>
      <Flex justifyContent="center" alignItems="center" style={{ height: "100%" }}>
        <Typography variant="omega" textColor="neutral500">
          Loading...
        </Typography>
      </Flex>
    </Box>
  );

  // Helper component for error state
  const ErrorBox = ({ error, height = "200px" }: { error: string; height?: string }) => (
    <Box style={{ minHeight: height }}>
      <Flex justifyContent="center" alignItems="center" style={{ height: "100%" }}>
        <Typography variant="omega" textColor="danger600">
          {error}
        </Typography>
      </Flex>
    </Box>
  );

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
                value={statsData?.totalVisits?.toLocaleString() ?? "—"}
                change={statsData?.trends?.totalVisits}
                changeType="negative"
              />
            </Grid.Item>

            <Grid.Item col={3}>
              <StatCard
                icon={<Globe />}
                label="Traffic Sources"
                value={statsData?.uniqueSources ?? "—"}
                change={statsData?.trends?.uniqueSources}
                changeType="positive"
              />
            </Grid.Item>

            <Grid.Item col={3}>
              <StatCard
                icon={<File />}
                label="Active Campaigns"
                value={statsData?.campaigns ?? "—"}
                change={statsData?.trends?.campaigns}
                changeType="positive"
              />
            </Grid.Item>

            <Grid.Item col={3}>
              <StatCard
                icon={<User />}
                label="Today's Visitors"
                value={statsData?.today ?? "—"}
                change={statsData?.trends?.today}
                changeType="positive"
              />
            </Grid.Item>
          </>
        )}
      </Grid.Root>

      <Divider marginBottom={6} />

      {/* Chart Section */}
      <Box marginBottom={8}>
        {chartLoading ? (
          <Card padding={4}>
            <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
              Visitor Trends
            </Typography>
            <LoadingBox height="300px" />
          </Card>
        ) : chartError ? (
          <Card padding={4}>
            <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
              Visitor Trends
            </Typography>
            <ErrorBox error={chartError} height="300px" />
          </Card>
        ) : (
          <StatsChart data={chartData} />
        )}
      </Box>

      <Divider marginBottom={6} />

      {/* Stats Table */}
      <Box>
        {tableLoading ? (
          <Card padding={4}>
            <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
              Detailed Analytics
            </Typography>
            <LoadingBox height="400px" />
          </Card>
        ) : tableError ? (
          <Card padding={4}>
            <Typography variant="beta" fontWeight="semiBold" marginBottom={4}>
              Detailed Analytics
            </Typography>
            <ErrorBox error={tableError} height="400px" />
          </Card>
        ) : (
          <StatsTable data={tableData} />
        )}
      </Box>
    </Box>
  );
};

export { App };