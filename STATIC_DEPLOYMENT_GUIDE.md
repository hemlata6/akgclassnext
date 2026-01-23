# 🚀 Static Deployment Guide - AKG Classes Blog

## ✅ Build Completed Successfully!

Your Next.js site has been converted to **Static Site Generation (SSG)** and exported to the `out/` folder.

---

## 📁 Deployment Folder

**Location:** `akgclass/out/`

This folder contains your complete static website ready for drag-and-drop deployment!

---

## 🌐 How Your Blog Works

### Static vs Dynamic:
- **Blog Pages:** Pre-generated at build time with full SEO meta tags
- **SEO Tags:** Open Graph, Twitter Cards, JSON-LD all baked into static HTML
- **CDN URLs:** Automatically fixed to use `classiocafinal.in-maa-1.linodeobjects.com`
- **Performance:** Lightning-fast loading (no server-side rendering needed)

### When to Rebuild:
- After adding new blog posts
- After updating existing blog content
- After changing course structure

**Command:** `npm run build`

---

## 📤 Deployment Options

### Option 1: Drag-and-Drop (Recommended for Quick Deploy)

Upload the entire `out/` folder contents to:

**Netlify Drop:**
1. Go to https://app.netlify.com/drop
2. Drag the `out` folder
3. Done! Your site is live instantly

**Vercel:**
1. Go to https://vercel.com/new
2. Click "Add New" → "Project"
3. Drag the `out` folder
4. Deploy

### Option 2: Static Hosting Services

**GitHub Pages:**
```bash
# Push the out folder to gh-pages branch
cd out
git init
git add .
git commit -m "Deploy static site"
git push origin gh-pages
```

**Cloudflare Pages:**
1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `out`

### Option 3: Your Linode Server (Nginx)

Upload `out` folder to your server:

```bash
# From your local machine
cd akgclass
scp -r out/* root@your-server-ip:/var/www/lecturedekho.in/

# On your server
sudo systemctl reload nginx
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name lecturedekho.in www.lecturedekho.in;
    root /var/www/lecturedekho.in;
    index index.html;

    # Trailing slash redirect (important for static export)
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Cache static assets
    location /_next/static {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### Option 4: FTP/cPanel

1. Login to your hosting control panel
2. Navigate to `public_html` or `www` folder
3. Upload all contents of `out/` folder
4. Ensure `.html` files are readable

---

## 🔍 SEO Features Included

✅ **Dynamic Meta Tags:**
- Unique title, description, and image for each blog post
- Open Graph tags (Facebook, LinkedIn sharing)
- Twitter Card tags
- JSON-LD structured data (BlogPosting schema)

✅ **Performance Optimizations:**
- Pre-connected to CDN domains
- DNS prefetch for faster loading
- Optimized images (unoptimized: true for static export)

✅ **Social Sharing:**
- ShareButtons component on every blog post
- Facebook, Twitter, LinkedIn, WhatsApp, Telegram, Copy Link

---

## 📊 Build Summary

### Generated Pages:
```
✓ /                               (Homepage)
✓ /blog/                          (Blog listing)
✓ /blog/[slug]/                   (1 blog post - pre-rendered)
✓ /404.html                       (404 page)
✓ All other pages (cart, courses, etc.)
```

### Build Statistics:
- **Total Pages:** 16 static pages
- **Blog Posts Found:** 1 blog post discovered
- **Build Time:** ~30 seconds
- **Output Size:** Check `out/` folder

---

## 🔄 Update Workflow

### Adding New Blogs:

1. **Add blog via your admin panel/API**
2. **Rebuild the site:**
   ```bash
   cd akgclass
   npm run build
   ```
3. **Deploy the new `out/` folder**
   - Upload via FTP
   - Or push to Netlify/Vercel
   - Or update Nginx folder

### Updating Existing Content:

Same steps as above - rebuild and redeploy.

---

## ⚙️ Configuration Files Updated

### next.config.js
```javascript
output: 'export',          // Static export enabled
trailingSlash: true,       // URLs end with /
images: {
  unoptimized: true,       // Required for static export
  domains: ['classiocafinal.in-maa-1.linodeobjects.com']
}
```

### pages/blog/[slug].js
- Changed from `getServerSideProps` → `getStaticProps` + `getStaticPaths`
- Automatically discovers all blogs at build time
- Pre-renders each blog page with full SEO

---

## 🐛 Troubleshooting

### "Blog not found" after deployment:
- Ensure trailing slash in URL: `/blog/slug-here/` (not `/blog/slug-here`)
- Check that the blog folder exists in `out/blog/`

### Old CDN URLs still showing:
- Your API data contains full old URLs
- Solution: Update URLs in your database/backend
- Temporary fix: Current code automatically replaces old domain

### Missing blog posts:
- Verify blogs are active in API
- Check console during build for "Total blogs found: X"
- Ensure course IDs are correct

---

## 📈 Next Steps

1. **Test the build locally:**
   ```bash
   cd out
   npx serve
   ```
   Visit http://localhost:3000

2. **Deploy to production:**
   - Choose your preferred method above
   - Upload `out/` folder contents

3. **Set up automation (optional):**
   - Use GitHub Actions to auto-build on blog updates
   - Connect Netlify/Vercel to your repository for auto-deploys

---

## 💡 Benefits of Static Export

✅ **Lightning Fast:** No server rendering, pure HTML/CSS/JS
✅ **SEO Perfect:** All meta tags pre-rendered in HTML
✅ **Cheap Hosting:** Works on any static hosting (even free tiers)
✅ **Reliable:** No Node.js server to crash
✅ **Scalable:** CDN-friendly, handles traffic spikes easily

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify blog URLs match the format: `/blog/courseId-parentId-slug/`
3. Ensure trailing slashes are present
4. Test locally with `npx serve` before deploying

---

**Last Updated:** January 22, 2026  
**Build Version:** Static Export with SSG  
**Next.js Version:** 14.2.35
