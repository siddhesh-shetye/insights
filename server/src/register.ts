import type { Core } from '@strapi/strapi';
import insights from './middlewares/insights';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.server.use(insights);
};

export default register;