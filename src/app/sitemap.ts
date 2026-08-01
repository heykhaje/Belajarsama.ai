import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://belajarsamaai.vercel.app';

  // Daftar rute statis di aplikasi kita
  const routes = [
    '',
    '/dashboard',
    '/my-learning',
    '/schedule',
    '/analytics',
    '/donasi',
    '/privacy-policy',
    '/terms-of-service',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'daily',
    priority: route === '' ? 1 : 0.8,
  }));
}
