import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export interface Env {
  __STATIC_CONTENT: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // Add logic to serve static assets from KV
      return await getAssetFromKV(
        {
          request,
          waitUntil: () => {}
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          mapRequestToAsset: (req) => {
            // Parse URL
            const url = new URL(req.url);
            let pathname = url.pathname;

            // Handle root path
            if (pathname === '/') {
              pathname = '/index.html';
            }
            // Handle paths without extensions (Next.js static export)
            else if (!pathname.includes('.')) {
              // First try the path as-is with .html
              pathname = pathname + '.html';
            }
            // Handle trailing slashes
            else if (pathname.endsWith('/')) {
              pathname = pathname + 'index.html';
            }

            // Return new request with modified pathname
            url.pathname = pathname;
            return new Request(url.toString(), req);
          }
        }
      );
    } catch (e: any) {
      // If asset not found, try serving 404.html or return basic 404
      if (e.status === 404) {
        // Try to serve custom 404 page
        try {
          const notFoundRequest = new Request(new URL('/404.html', request.url).toString());
          return await getAssetFromKV(
            {
              request: notFoundRequest,
              waitUntil: () => {}
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT
            }
          );
        } catch {
          return new Response('404 - Page Not Found', { status: 404 });
        }
      }
      
      // Log error and return 500
      console.error(e);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};