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

            // Calculate percentage changes
            const calculateChange = (current, previous) => {
                if (previous === 0) return current > 0 ? '+100%' : '0%';
                const change = ((current - previous) / previous) * 100;
                return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
            };

            const response = {
                totalVisits,
                uniqueSources,
                campaigns,
                today: todayVisitors,
                trends: {
                    totalVisits: calculateChange(totalVisits, totalVisitsLastWeek),
                    uniqueSources: calculateChange(uniqueSources, uniqueSourcesLastWeek),
                    campaigns: calculateChange(campaigns, campaignsLastWeek),
                    today: calculateChange(todayVisitors, yesterdayVisitors)
                }
            };

            ctx.body = response;
        } catch (err) {
            ctx.throw(500, `Failed to fetch stats: ${err.message}`);
        }
    },
}));