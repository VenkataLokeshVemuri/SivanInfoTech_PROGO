
export const generateSitemap = () => {
  const baseUrl = 'https://sitcloud.in';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/courses', changefreq: 'weekly', priority: '0.9' },
    { loc: '/login', changefreq: 'monthly', priority: '0.7' },
    { loc: '/signup', changefreq: 'monthly', priority: '0.7' },
    { loc: '/verify', changefreq: 'monthly', priority: '0.6' },
    { loc: '/dashboard', changefreq: 'weekly', priority: '0.8' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const downloadSitemap = () => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
