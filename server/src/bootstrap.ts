import type { Core } from '@strapi/strapi';

const RBAC_ACTIONS = [
  {
    section: 'plugins',
    subCategory: 'Insights',
    displayName: 'Read',
    uid: 'insights.read',
    pluginName: 'insights-strapi',
  }
];

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  // bootstrap phase
  const res = await strapi.admin?.services.permission.actionProvider.registerMany(RBAC_ACTIONS);
};

export default bootstrap;
