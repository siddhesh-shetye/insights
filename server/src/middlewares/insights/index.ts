import type { Core } from '@strapi/strapi';

const tracker: Core.MiddlewareFactory = (config, { strapi }) => {
    return async (ctx, next) => {
        try {
            // --- Ignore internal Strapi APIs ---
            const ignoredPrefixes = ['/admin', '/content-manager', '/users-permissions', '/_health'];
            if (ignoredPrefixes.some(prefix => ctx.url.startsWith(prefix))) {
                return next();
            }

            // --- UTM parameters ---
            const utmParams = ['source', 'medium', 'campaign', 'term', 'content'] as const;
            const query = ctx.request.query as Record<string, string | undefined>;
            const hasUTM = utmParams.some(param => !!query[param]);

            if (hasUTM) {
                const ip =
                    (ctx.request.headers['x-forwarded-for'] as string) ||
                    ctx.request.ip ||
                    ctx.ip;

                const visitData = {
                    source: query.source ?? null,
                    medium: query.medium ?? null,
                    campaign: query.campaign ?? null,
                    term: query.term ?? null,
                    content: query.content ?? null,
                    ip: Array.isArray(ip) ? ip[0] : ip,
                    user_agent: ctx.request.headers['user-agent'] ?? null,
                    path: ctx.request.path,
                    via: query.via ?? 'website',
                };

                // --- Save to DB ---
                await strapi.documents('plugin::insights.insight').create({ data: visitData });
            }
        } catch (err: any) {
            strapi.log.error(`[insights] Tracker failed: ${err.message}`);
        }

        // Continue the request
        await next();
    };
};

export default tracker;