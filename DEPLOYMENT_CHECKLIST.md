# Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All console.errors removed or properly handled
- [ ] No hardcoded sensitive data (API keys, passwords)
- [ ] Environment variables properly configured
- [ ] All dependencies up to date (`npm outdated`)
- [ ] No TypeScript/ESLint errors (`npm run lint`)
- [ ] Code is properly formatted

### Testing
- [ ] Application runs locally without errors (`npm run dev`)
- [ ] All pages load correctly
- [ ] Blog posts are fetching dynamically
- [ ] Images are loading from CDN
- [ ] Forms are working (if any)
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing done

### SEO Verification
- [ ] All pages have unique titles
- [ ] Meta descriptions are present and descriptive
- [ ] Open Graph tags configured
- [ ] Twitter cards configured
- [ ] Canonical URLs set correctly
- [ ] Structured data (JSON-LD) implemented
- [ ] Sitemap.xml is accessible
- [ ] Robots.txt is configured
- [ ] Images have alt text
- [ ] Page load time < 3 seconds

### Security
- [ ] HTTPS enabled (SSL certificate installed)
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Environment variables secured
- [ ] No sensitive data in client-side code
- [ ] CORS properly configured
- [ ] XSS protection enabled
- [ ] CSRF protection (if needed)

## Netlify Deployment

### Pre-Flight
- [ ] Create `.env.example` with all required variables
- [ ] Update `netlify.toml` with correct settings
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Login to Netlify: `netlify login`

### Deployment Steps
- [ ] Link repository: `netlify link`
- [ ] Set environment variables in Netlify dashboard
- [ ] Test build locally: `npm run build`
- [ ] Deploy preview: `npm run deploy:preview`
- [ ] Test preview deployment
- [ ] Deploy to production: `npm run deploy:netlify`
- [ ] Verify production deployment

### Post-Deployment
- [ ] Test all routes
- [ ] Verify blog posts load
- [ ] Check images load correctly
- [ ] Test form submissions
- [ ] Check mobile responsiveness
- [ ] Verify HTTPS is working
- [ ] Test social media sharing (OG tags)

## Nginx + PM2 Deployment

### Server Setup
- [ ] Server provisioned (Ubuntu 20.04+ recommended)
- [ ] Node.js 18+ installed
- [ ] Nginx installed
- [ ] PM2 installed globally
- [ ] Git installed
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication setup

### Application Setup
- [ ] Clone repository to `/var/www/akgclass`
- [ ] Create `.env.local` with production values
- [ ] Run `npm install`
- [ ] Create logs directory: `mkdir logs`
- [ ] Set correct permissions: `chown -R $USER:$USER /var/www/akgclass`

### Build & Start
- [ ] Build application: `npm run build`
- [ ] Test build locally: `npm start`
- [ ] Stop test server
- [ ] Start with PM2: `npm run pm2:start`
- [ ] Verify PM2 process: `pm2 status`
- [ ] Save PM2 list: `pm2 save`
- [ ] Setup PM2 startup: `pm2 startup`

### Nginx Configuration
- [ ] Copy `nginx.conf` to `/etc/nginx/sites-available/akgclass`
- [ ] Create symlink: `ln -s /etc/nginx/sites-available/akgclass /etc/nginx/sites-enabled/`
- [ ] Remove default site: `rm /etc/nginx/sites-enabled/default`
- [ ] Test nginx config: `nginx -t`
- [ ] Restart nginx: `systemctl restart nginx`
- [ ] Verify nginx status: `systemctl status nginx`

### SSL Setup (Let's Encrypt)
- [ ] Install certbot: `apt install certbot python3-certbot-nginx`
- [ ] Obtain certificate: `certbot --nginx -d yourdomain.com -d www.yourdomain.com`
- [ ] Test auto-renewal: `certbot renew --dry-run`
- [ ] Verify HTTPS is working
- [ ] Test HTTP to HTTPS redirect

### Post-Deployment Testing
- [ ] Access site via domain
- [ ] Test all pages load
- [ ] Verify blog posts are dynamic
- [ ] Check images load from CDN
- [ ] Test mobile responsiveness
- [ ] Check PM2 logs: `pm2 logs`
- [ ] Check Nginx logs: `tail -f /var/log/nginx/akgclass-*.log`
- [ ] Test health endpoint: `curl http://localhost/health`
- [ ] Load test with Apache Bench (optional)

## Docker Deployment (Optional)

### Setup
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Build image: `docker build -t akgclass .`
- [ ] Test container: `docker run -p 3000:3000 akgclass`
- [ ] Create docker-compose.yml
- [ ] Start services: `docker-compose up -d`
- [ ] Check logs: `docker-compose logs -f`

## SEO & Analytics

### Google Search Console
- [ ] Add property to Search Console
- [ ] Verify ownership
- [ ] Submit sitemap: https://yourdomain.com/sitemap.xml
- [ ] Check for crawl errors
- [ ] Set preferred domain (www vs non-www)
- [ ] Check mobile usability

### Google Analytics (Optional)
- [ ] Create GA4 property
- [ ] Add tracking code to _app.js or _document.js
- [ ] Verify tracking is working
- [ ] Set up goals/conversions

### Other Search Engines
- [ ] Submit to Bing Webmaster Tools
- [ ] Submit to Yandex (if applicable)

### Social Media
- [ ] Test Open Graph tags: https://developers.facebook.com/tools/debug/
- [ ] Test Twitter cards: https://cards-dev.twitter.com/validator
- [ ] Test LinkedIn post preview

## Monitoring & Maintenance

### Setup Monitoring
- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry, if using)
- [ ] Setup log rotation
- [ ] Configure backup strategy
- [ ] Setup alerting for errors

### Performance
- [ ] Run Lighthouse audit
- [ ] Check PageSpeed Insights
- [ ] Optimize images if needed
- [ ] Enable CDN (Cloudflare) if not already
- [ ] Check Core Web Vitals

### Documentation
- [ ] Update README.md
- [ ] Document environment variables
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document API endpoints (if any)

## Regular Maintenance Tasks

### Daily
- [ ] Check PM2 status
- [ ] Check error logs
- [ ] Monitor uptime

### Weekly
- [ ] Review analytics
- [ ] Check for 404 errors in logs
- [ ] Review performance metrics
- [ ] Check SSL certificate expiry

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Security audit: `npm audit`
- [ ] Review and optimize images
- [ ] Check backup integrity
- [ ] Review and update content

### Quarterly
- [ ] Major dependency updates
- [ ] Performance optimization review
- [ ] Security audit and penetration testing
- [ ] Content audit
- [ ] SEO audit

## Rollback Plan

### If Deployment Fails
1. Check error logs: `pm2 logs` or check Netlify logs
2. Roll back to previous version:
   - Netlify: Use dashboard to rollback
   - PM2: `git checkout previous-commit && npm install && npm run build && pm2 restart akgclass`
3. Investigate issue in development
4. Fix and redeploy

### Emergency Contacts
- [ ] Document emergency contact information
- [ ] Document escalation procedures
- [ ] Keep backup admin credentials secure

## Success Criteria

### Performance
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals in green

### Functionality
- [ ] All pages accessible
- [ ] Blog posts loading dynamically
- [ ] Images loading correctly
- [ ] Forms working (if any)
- [ ] No console errors

### SEO
- [ ] All pages indexed in Google (within 1 week)
- [ ] Rich results showing in search
- [ ] Social sharing working correctly
- [ ] Sitemap submitted and processed

### Security
- [ ] SSL A+ rating (ssllabs.com)
- [ ] Security headers present
- [ ] No vulnerabilities in npm audit

---

## Notes

- Keep this checklist updated with any new requirements
- Document any issues encountered and solutions
- Regular backups are crucial
- Monitor logs regularly
- Keep dependencies updated
- Test in staging before production

---

**Last Updated:** $(date)
**Deployment By:** _____________
**Sign-off:** _____________
