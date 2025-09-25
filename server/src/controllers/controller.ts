import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('insights-strapi')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },

  async stats(ctx) {

    const data = {
      totalVisits: 2847,
      uniqueSources: 12,
      campaigns: 8,
      today: 34,
      trends: {
        totalVisits: '+12.5%',
        uniqueSources: '+2',
        campaigns: '+1',
        today: '+8.2%'
      },
      chartData: [
        { date: '2025-09-20', count: 12 },
        { date: '2025-09-21', count: 8 },
        { date: '2025-09-22', count: 15 },
        { date: '2025-09-23', count: 22 },
        { date: '2025-09-24', count: 18 },
        { date: '2025-09-25', count: 66 },
        { date: '2025-09-26', count: 88 },
        { date: '2025-09-27', count: 122 },
        { date: '2025-09-28', count: 56 },
        { date: '2025-09-29', count: 32 }
      ]
    };

    return data;
  },
});

export default controller;
