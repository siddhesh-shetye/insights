import { factories } from '@strapi/strapi';

const modelName = "plugin::insights-strapi.insight";

export default factories.createCoreController(modelName, ({ strapi }) => ({
    /**
     * GET /api/insights-strapi/stats
     * Returns summary statistics for the dashboard cards
     */
    async getStats(ctx) {
        try {
            let knex = strapi.db.connection;

            // Get current date ranges
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);
            const startOfLastWeek = new Date(now);
            startOfLastWeek.setDate(now.getDate() - 14);

            // Total insights (all time)
            const totalVisits = await strapi.db.query(modelName).count();

            // Total insights last week (for comparison)
            const totalVisitsLastWeek = await strapi.db.query(modelName).count({
                where: {
                    createdAt: {
                        $gte: startOfLastWeek,
                        $lt: startOfWeek
                    }
                }
            });

            // Get unique sources using Knex
            const uniqueSourcesResult = await knex('insights')
                .countDistinct('source as count')
                .whereNotNull('source')
                .andWhere('source', '!=', '')
                .first();

            const uniqueSourcesLastWeekResult = await knex('insights')
                .countDistinct('source as count')
                .whereNotNull('source')
                .andWhere('source', '!=', '')
                .andWhere('created_at', '>=', startOfLastWeek.toISOString())
                .andWhere('created_at', '<', startOfWeek.toISOString())
                .first();

            const campaignsResult = await knex('insights')
                .countDistinct('campaign as count')
                .whereNotNull('campaign')
                .andWhere('campaign', '!=', '')
                .first();

            const campaignsLastWeekResult = await knex('insights')
                .countDistinct('campaign as count')
                .whereNotNull('campaign')
                .andWhere('campaign', '!=', '')
                .andWhere('created_at', '>=', startOfLastWeek.toISOString())
                .andWhere('created_at', '<', startOfWeek.toISOString())
                .first();

            // Extract counts from query results
            const uniqueSources = Number(uniqueSourcesResult.count) || 0;
            const uniqueSourcesLastWeek = Number(uniqueSourcesLastWeekResult.count) || 0;
            const campaigns = Number(campaignsResult.count) || 0;
            const campaignsLastWeek = Number(campaignsLastWeekResult.count) || 0;

            // Today's visitors
            const todayVisitors = await strapi.db.query(modelName).count({
                where: {
                    createdAt: {
                        $gte: startOfToday
                    }
                }
            });

            // Yesterday's visitors (for comparison)
            const startOfYesterday = new Date(startOfToday);
            startOfYesterday.setDate(startOfToday.getDate() - 1);
            const yesterdayVisitors = await strapi.db.query(modelName).count({
                where: {
                    createdAt: {
                        $gte: startOfYesterday,
                        $lt: startOfToday
                    }
                }
            });

            // Calculate percentage changes with mood
            const calculateChangeWithMood = (current, previous) => {
                if (previous === 0) {
                    return {
                        percentage: current > 0 ? '+100%' : '0%',
                        mood: current > 0 ? 'positive' : 'neutral'
                    };
                }
                const change = ((current - previous) / previous) * 100;
                const percentage = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
                const mood = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
                return { percentage, mood };
            };

            const totalVisitsChange = calculateChangeWithMood(totalVisits, totalVisitsLastWeek);
            const uniqueSourcesChange = calculateChangeWithMood(uniqueSources, uniqueSourcesLastWeek);
            const campaignsChange = calculateChangeWithMood(campaigns, campaignsLastWeek);
            const todayChange = calculateChangeWithMood(todayVisitors, yesterdayVisitors);

            const response = {
                totalVisits: {
                    value: totalVisits,
                    percentage: totalVisitsChange.percentage,
                    mood: totalVisitsChange.mood
                },
                uniqueSources: {
                    value: uniqueSources,
                    percentage: uniqueSourcesChange.percentage,
                    mood: uniqueSourcesChange.mood
                },
                campaigns: {
                    value: campaigns,
                    percentage: campaignsChange.percentage,
                    mood: campaignsChange.mood
                },
                today: {
                    value: todayVisitors,
                    percentage: todayChange.percentage,
                    mood: todayChange.mood
                }
            };

            ctx.body = response;
        } catch (err) {
            ctx.throw(500, `Failed to fetch stats: ${err.message}`);
        }
    },

    /**
     * GET /api/insights-strapi/chart
     * Returns time-series data for the line chart
     */
    async getChart(ctx) {
        try {
            // Get last 10 days of data
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - 10);

            // Format date as YYYY-MM-DD for SQL query
            const formattedDate = daysAgo.toISOString().split('T')[0];

            // Raw query to get daily visit counts
            const dailyVisitsResult = await strapi.db.connection.raw(`
                SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
                FROM insights 
                WHERE created_at >= ?
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `, [formattedDate]);

            let dailyVisits = [];
            if (dailyVisitsResult.rows) {
                // PostgreSQL returns { rows: [...] }
                dailyVisits = dailyVisitsResult.rows;
            }

            // Format data for the chart
            let chartData = dailyVisits.map(row => {
                return {
                    date: row.date,
                    count: Number(row.count)
                };
            });

            ctx.body = chartData;
        } catch (err) {
            ctx.throw(500, `Failed to fetch chart: ${err.message}`);
        }
    },

    async getSource(ctx) {
        try {
            // Get last 30 days timestamp
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const timestampThirtyDaysAgo = thirtyDaysAgo.toISOString().split('T')[0];

            // Get traffic sources with counts for last 30 days using timestamp
            const sourcesResult = await strapi.db.connection.raw(`
                SELECT 
                COALESCE(NULLIF(source, ''), 'Direct') as source,
                COUNT(*) as count
                FROM insights 
                WHERE created_at >= ?
                GROUP BY COALESCE(NULLIF(source, ''), 'Direct')
                ORDER BY count DESC
                LIMIT 10
            `, [timestampThirtyDaysAgo]);

            // PostgreSQL returns { rows: [...] }
            const sourcesData = sourcesResult.rows || [];

            // Format data for the pie chart
            let pieChartData = sourcesData.map(row => {
                return {
                    source: row.source,
                    count: Number(row.count)
                };
            });

            ctx.body = pieChartData;
        } catch (err) {
            ctx.throw(500, `Failed to fetch source: ${err.message}`);
        }
    },
}));