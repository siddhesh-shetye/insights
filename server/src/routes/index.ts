import contentAPIRoutes from './content-api';
import admin from "./admin";

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
  admin: {
    type: "admin",
    routes: [...admin.routes],
  },
};

export default routes;
