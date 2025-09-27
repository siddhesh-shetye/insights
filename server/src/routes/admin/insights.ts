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
    // {
    //     method: 'GET',
    //     path: '/chart',
    //     handler: 'insights.chart',
    //     config: {
    //         policies: [
    //             'admin::isAuthenticatedAdmin',
    //             {
    //                 name: 'admin::hasPermissions',
    //                 config: {
    //                     actions: ['plugin::insights-strapi.insights.read'],
    //                 },
    //             },
    //         ],
    //     },
    // },
    // {
    //     method: 'GET',
    //     path: '/table',
    //     handler: 'insights.table',
    //     config: {
    //         policies: [
    //             'admin::isAuthenticatedAdmin',
    //             {
    //                 name: 'admin::hasPermissions',
    //                 config: {
    //                     actions: ['plugin::insights-strapi.insights.read'],
    //                 },
    //             },
    //         ],
    //     },
    // },
    // {
    //     method: 'GET',
    //     path: '/source',
    //     handler: 'insights.source',
    //     config: {
    //         policies: [
    //             'admin::isAuthenticatedAdmin',
    //             {
    //                 name: 'admin::hasPermissions',
    //                 config: {
    //                     actions: ['plugin::insights-strapi.insights.read'],
    //                 },
    //             },
    //         ],
    //     },
    // },
];