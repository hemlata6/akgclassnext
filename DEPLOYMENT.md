# Dynamic Deployment Guide

This guide covers deploying the AKG Class Next.js application with dynamic content and SEO on Nginx and Netlify.

## Features Implemented

✅ **Dynamic SSR (Server-Side Rendering)** for real-time blog content
✅ **Dynamic SEO** with meta tags, Open Graph, and Twitter Cards
✅ **Structured Data** (JSON-LD) for better search engine understanding
✅ **Image Optimization** for faster page loads
✅ **Security Headers** for protection against common attacks
✅ **Caching Strategy** for optimal performance

---

## Deployment Options

### Option 1: Netlify Deployment (Recommended for Quick Start)

#### Prerequisites
- Netlify account
- GitHub repository connected

#### Steps

1. **Install Netlify CLI** (if deploying from local):
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   npm install
   npm run build
   ```

3. **Deploy to Netlify**:
   ```bash
   # Login to Netlify
   netlify login
   
   # Link to existing site or create new
   netlify link
   
   # Deploy to production
   npm run deploy:netlify
   ```

4. **Configure Environment Variables** in Netlify Dashboard:
   - Go to Site Settings > Environment Variables
   - Add:
     - `NEXT_PUBLIC_API_BASE_URL`: https://prodapi.classiolabs.com/
     - `NEXT_PUBLIC_MEDIA_BASE_URL`: https://classioakg.in-maa-1.linodeobjects.com/

5. **Enable Next.js Plugin**:
   - The `netlify.toml` already configures this
   - Netlify will automatically detect Next.js and enable SSR

#### Netlify Features Enabled
- ✅ Server-Side Rendering
- ✅ Incremental Static Regeneration
- ✅ API Routes
- ✅ Image Optimization
- ✅ Edge Functions
- ✅ Automatic HTTPS

---

### Option 2: Nginx + PM2 Deployment (Production Server)

#### Prerequisites
- Ubuntu/Debian Linux server
- Node.js 18+ installed
- Nginx installed
- PM2 installed globally

#### Steps

1. **Install Dependencies on Server**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Install PM2 globally
   sudo npm install -g pm2
   ```

2. **Clone and Setup Project**:
   ```bash
   # Clone repository
   cd /var/www
   sudo git clone https://github.com/hemlata6/akgclassnext.git akgclass
   cd akgclass
   
   # Install dependencies
   sudo npm install
   
   # Create .env.local file
   sudo nano .env.local
   ```

3. **Add Environment Variables** to `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://prodapi.classiolabs.com/
   NEXT_PUBLIC_MEDIA_BASE_URL=https://classioakg.in-maa-1.linodeobjects.com/
   PORT=3000
   ```

4. **Build the Application**:
   ```bash
   sudo npm run build
   ```

5. **Configure PM2**:
   ```bash
   # Start application with PM2
   sudo npm run pm2:start
   
   # Save PM2 process list
   sudo pm2 save
   
   # Setup PM2 to start on boot
   sudo pm2 startup systemd
   # Run the command that PM2 outputs
   ```

6. **Configure Nginx**:
   ```bash
   # Copy nginx configuration
   sudo cp nginx.conf /etc/nginx/sites-available/akgclass
   
   # Create symbolic link
   sudo ln -s /etc/nginx/sites-available/akgclass /etc/nginx/sites-enabled/
   
   # Test Nginx configuration
   sudo nginx -t
   
   # Restart Nginx
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt** (Optional but Recommended):
   ```bash
   # Install Certbot
   sudo apt install -y certbot python3-certbot-nginx
   
   # Obtain SSL certificate
   sudo certbot --nginx -d lecturedekho.in -d www.lecturedekho.in
   
   # Auto-renewal is set up automatically
   sudo certbot renew --dry-run
   ```

8. **Configure Firewall**:
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow OpenSSH
   sudo ufw enable
   ```

#### PM2 Management Commands
```bash
# View logs
npm run pm2:logs

# Restart application
npm run pm2:restart

# Stop application
npm run pm2:stop

# Monitor
pm2 monit

# Status
pm2 status
```

---

## Dynamic Blog SEO Features

### Implemented SEO Elements

1. **Dynamic Meta Tags**:
   - Title: Unique for each blog post
   - Description: Auto-generated from blog content (30 words)
   - Keywords: Contextual keywords

2. **Open Graph Tags** (Facebook/LinkedIn):
   - og:title
   - og:description
   - og:image (1200x630)
   - og:url
   - og:type (article)
   - article:published_time
   - article:author

3. **Twitter Card Tags**:
   - twitter:card (summary_large_image)
   - twitter:title
   - twitter:description
   - twitter:image

4. **Structured Data (JSON-LD)**:
   - BlogPosting schema
   - Author information
   - Publisher details
   - Publication dates

5. **Canonical URLs**: Prevent duplicate content issues

6. **Image Optimization**: 
   - Dynamic image URLs from CDN
   - Proper alt text
   - Dimensions specified

### Testing SEO

1. **Google Rich Results Test**:
   - https://search.google.com/test/rich-results
   - Test your blog URLs

2. **Facebook Sharing Debugger**:
   - https://developers.facebook.com/tools/debug/
   - Check Open Graph tags

3. **Twitter Card Validator**:
   - https://cards-dev.twitter.com/validator
   - Verify Twitter cards

4. **Lighthouse SEO Audit**:
   ```bash
   # Install Lighthouse CLI
   npm install -g lighthouse
   
   # Run audit
   lighthouse https://akgclass.netlify.app/blog/your-blog-post --view
   ```

---

## Performance Optimization

### Caching Strategy

1. **Server-Side (Nginx)**:
   - Static assets: 1 year cache
   - Images: 1 year cache
   - API responses: 60 seconds with stale-while-revalidate

2. **Next.js Cache**:
   - Page cache: 60 seconds
   - Stale-while-revalidate: 120 seconds

### Image Optimization
- Next.js Image component for automatic optimization
- WebP format support
- Lazy loading enabled
- CDN integration

---

## Monitoring & Maintenance

### Logs

**PM2 Logs**:
```bash
pm2 logs akgclass --lines 200
```

**Nginx Logs**:
```bash
sudo tail -f /var/log/nginx/akgclass-access.log
sudo tail -f /var/log/nginx/akgclass-error.log
```

### Health Check
```bash
curl http://localhost/health
```

### Update Deployment

**Netlify**:
```bash
git pull origin akgclass
npm run deploy:netlify
```

**Nginx + PM2**:
```bash
cd /var/www/akgclass
sudo git pull origin akgclass
sudo npm install
sudo npm run build
sudo npm run pm2:restart
```

---

## Troubleshooting

### Issue: Build fails on Netlify
**Solution**: Check build logs, ensure all dependencies are in `package.json`, not just `devDependencies`

### Issue: PM2 app crashes
**Solution**: 
```bash
pm2 logs akgclass --err --lines 100
sudo npm run pm2:restart
```

### Issue: Nginx 502 Bad Gateway
**Solution**: Ensure Next.js is running on port 3000
```bash
pm2 status
sudo systemctl restart nginx
```

### Issue: Images not loading
**Solution**: Check CORS settings, ensure CDN URLs are in `next.config.js` domains

### Issue: SEO tags not showing
**Solution**: View page source (Ctrl+U), ensure tags are server-rendered, not client-side

---

## Support & Documentation

- Next.js Docs: https://nextjs.org/docs
- Netlify Docs: https://docs.netlify.com
- PM2 Docs: https://pm2.keymetrics.io/docs
- Nginx Docs: https://nginx.org/en/docs

---

## Project Structure

```
akgclass/
├── pages/
│   ├── blog/
│   │   ├── [slug].js          # Dynamic blog post (SSR)
│   │   └── index.js           # Blog listing
│   ├── _app.js                # App wrapper
│   └── _document.js           # HTML document
├── components/                # React components
├── page-components/           # Page-specific components
├── config/                    # Configuration files
├── utils/                     # Utility functions
├── public/                    # Static assets
├── styles/                    # CSS files
├── next.config.js             # Next.js configuration
├── nginx.conf                 # Nginx configuration
├── ecosystem.config.js        # PM2 configuration
├── netlify.toml              # Netlify configuration
└── package.json              # Dependencies
```

---

## Security Checklist

- ✅ Security headers configured
- ✅ HTTPS/SSL enabled
- ✅ Rate limiting implemented
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Environment variables secured
- ✅ API endpoints validated
- ✅ Input sanitization

---

## Next Steps After Deployment

1. Submit sitemap to Google Search Console
2. Configure Google Analytics
3. Setup monitoring (Uptime Robot, Pingdom)
4. Configure CDN (Cloudflare) for additional caching
5. Setup backup strategy
6. Configure email alerts for errors
7. Regular security updates

---

For questions or issues, check the documentation or create an issue in the GitHub repository.
