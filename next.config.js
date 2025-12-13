/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Note: API rewrites won't work on Netlify static export
    // Frontend should call the API directly using NEXT_PUBLIC_API_URL
};

module.exports = nextConfig;

