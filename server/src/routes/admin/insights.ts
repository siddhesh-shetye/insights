export default [
    {
        method: 'GET',
        path: '/stats',
        handler: 'insights.getStats',
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
    {
        method: 'GET',
        path: '/chart',
        handler: 'insights.getChart',
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
    {
        method: 'GET',
        path: '/source',
        handler: 'insights.getSource',
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