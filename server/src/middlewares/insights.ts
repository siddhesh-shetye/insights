import type { Middleware } from 'koa';

const insights: Middleware = async (ctx, next) => {
    try {
        // Respect environment flag
        if (process.env.INSIGHTS_ENABLED !== 'true') {
            return await next();
        }
        
        // --- Ignore internal Strapi APIs ---
        const ignoredPrefixes = ['/admin', '/content-manager', '/users-permissions', '/_health'];
        if (ignoredPrefixes.some(prefix => ctx.url.startsWith(prefix))) {
            return await next();
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

            // --- Save to collection ---
            await strapi.documents('plugin::insights-strapi.insight').create({ data: visitData });
        }
    } catch (err: any) {
        strapi.log.error(`[insights] Tracker failed: ${err.message}`);
    }

    // Continue the request chain
    await next();
};

export default insights;