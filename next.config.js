/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mnpuwdpibvktzncqudlh.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
