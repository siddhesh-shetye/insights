import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Flex, Divider, Grid } from "@strapi/design-system";
import { useFetchClient } from "@strapi/strapi/admin";
import { ChartPie, Calendar } from "@strapi/icons";
import StatsChart from '../components/StatsChart';
import StatsTable from '../components/StatsTable';
import StatsGrid from '../components/StatsGrid';
import StatsPieChart from '../components/StatsPieChart';

const App = () => {
  const { get } = useFetchClient();

  // Separate state for each section
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);

  // Separate loading states
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [pieChartLoading, setPieChartLoading] = useState(true);

  // Separate error states
  const [statsError, setStatsError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [pieChartError, setPieChartError] = useState<string | null>(null);

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

    // Function to fetch pie chart data (traffic sources)
    const fetchPieChartData = async () => {
      try {
        setPieChartLoading(true);
        setPieChartError(null);
        const { data } = await get("/insights-strapi/sources");
        setPieChartData(data);
      } catch (err) {
        console.error("Failed to load pie chart data", err);
        setPieChartError("Failed to load traffic sources data");
      } finally {
        setPieChartLoading(false);
      }
    };

    // Run all API calls simultaneously
    Promise.allSettled([
      fetchStats(),
      fetchChartData(),
      fetchTableData(),
      fetchPieChartData()
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
      </Box>

      {/* Stats Grid */}
      <StatsGrid
        statsData={statsData}
        statsLoading={statsLoading}
        statsError={statsError}
      />

      <Divider marginBottom={6} />

      {/* Charts Section - Side by Side */}
      <Grid.Root gap={2} marginBottom={8}>
        <Grid.Item col={8}>
          {/* Line Chart */}
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
        </Grid.Item>

        <Grid.Item col={4}>
          {/* Pie Chart */}
          <StatsPieChart
            data={pieChartData}
            isLoading={pieChartLoading}
            error={pieChartError}
          />
        </Grid.Item>
      </Grid.Root>

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