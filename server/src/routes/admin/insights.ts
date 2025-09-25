export default [
    {
        method: 'GET',
        path: '/stats',
        handler: 'insights.stats',
        config: {
            policies: [
                'admin::isAuthenticatedAdmin',
                {
                    name: 'admin::hasPermissions',
                    config: {
                        actions: ['plugin::insights-strapi.insights.read'],
                    },
                },
            ],
        },
    },
];