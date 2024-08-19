/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "firebasestorage.googleapis.com",
                port: '',
                // pathname: '/v0/b/nextjs-firebase-ssr.appspot.com/o/images%2F.*',
            }
        ]
    }
};

export default nextConfig;
