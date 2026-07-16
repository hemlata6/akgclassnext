export const getServerSideProps = async ({ res }) => {
  const robotsTxt = `# *
User-agent: *
Allow: /

# Disallow admin pages
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/

# Sitemaps
Sitemap: https://nextgencaacademy.com/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 2

User-agent: SemrushBot
Crawl-delay: 2
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

export default function RobotsTxt() {
  // This component will never be rendered
  return null;
}
