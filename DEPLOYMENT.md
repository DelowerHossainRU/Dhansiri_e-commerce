# DHANSIRI AGRO (ধানসিঁড়ি এগ্রো) - PRODUCTION DEPLOYMENT RUNBOOK

This operational runbook provides production-grade instructions for deploying the **Dhansiri Agro Industries** marketplace and business management platform.

---

## 🏗️ Architecture Overview

- **Frontend**: React 19 + Vite (built with code-splitting into lightweight on-demand chunks). Served statically via Nginx or static host.
- **Backend**: Node.js 20 LTS + Express.js API cluster managed by PM2 or Docker.
- **Database**: MongoDB 7.0 with persistent storage and daily snapshots.
- **Reverse Proxy & Edge**: Nginx handling SSL termination, Gzip/Brotli compression, static caching, and reverse proxying to backend `/api` and `/uploads`.
- **Security**: Strict rate limiting on auth endpoints, Helmet security headers, CORS origin enforcement, sanitized inputs, and RBAC authentication.

---

## 🚀 Deployment Option 1: Docker Compose (Recommended for Containers)

### 1. Prerequisites
- Docker Engine v24+
- Docker Compose v2+
- Open ports `80` (HTTP) and `443` (HTTPS)

### 2. Launch Stack
```bash
# 1. Clone repository
git clone git@github.com:DelowerHossainRU/Dhansiri_e-commerce.git
cd Dhansiri_e-commerce

# 2. Configure production secrets
cp backend/.env.example backend/.env
# Edit backend/.env with your production JWT_SECRET and SMTP credentials:
# nano backend/.env

# 3. Build and launch containers
docker compose up -d --build

# 4. Initialize Database Seed (Cultivars, Admin accounts, Silo inventory)
docker compose exec backend npm run seed

# 5. Verify status and telemetry
docker compose ps
curl http://localhost/api/health
```

---

## 🐧 Deployment Option 2: Ubuntu VPS (Nginx + PM2 + Systemd)

### 1. Install Node.js 20, MongoDB & Nginx
```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install PM2 globally
sudo npm install -g pm2

# Install MongoDB 7.0 Community
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

### 2. Deploy Application Code
```bash
# Clone to /var/www/
sudo git clone git@github.com:DelowerHossainRU/Dhansiri_e-commerce.git /var/www/dhansiri-agro
cd /var/www/dhansiri-agro
sudo chown -R $USER:$USER /var/www/dhansiri-agro

# Install backend dependencies & configure env
cd /var/www/dhansiri-agro/backend
npm ci --omit=dev
cp .env.example .env
# Set secure JWT_SECRET and NODE_ENV=production in .env
npm run seed

# Install frontend dependencies & build optimized bundle
cd /var/www/dhansiri-agro/frontend
npm ci
npm run build
```

### 3. Launch Backend with PM2 Cluster
```bash
cd /var/www/dhansiri-agro
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Configure Production Nginx
Create `/etc/nginx/sites-available/dhansiriagro.com`:

```nginx
server {
    listen 80;
    server_name dhansiriagro.com www.dhansiriagro.com;

    # Redirect all HTTP to HTTPS (after Certbot)
    # return 301 https://$host$request_uri;

    root /var/www/dhansiri-agro/frontend/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Single Page App route fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static Assets Cache (1 Year)
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|cur|gz|svg|woff2|woff)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API Proxy to PM2 cluster
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads Static Directory
    location /uploads/ {
        alias /var/www/dhansiri-agro/backend/src/uploads/;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }
}
```

Enable site and test configuration:
```bash
sudo ln -s /etc/nginx/sites-available/dhansiriagro.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Install Free SSL/TLS with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d dhansiriagro.com -d www.dhansiriagro.com
```

---

## 🔒 Security Hardening Checklist

- [x] **Rate Limiting**: Configured 1000 req/15min globally, 50 req/15min on auth.
- [x] **Strict CORS**: Origin whitelist prevents cross-origin hijacking.
- [x] **Security Headers**: Helmet & Nginx headers set `nosniff`, `SAMEORIGIN`, and XSS protection.
- [x] **Non-Root Execution**: Docker container runs as non-privileged `node` user.
- [x] **Code Splitting**: Dynamic routing chunks reduce attack surface and resource loads.
- [x] **Error Masking**: Internal server error details masked in production responses.
- [x] **Password Protection**: Salted Bcrypt with rounds=10.
- [x] **MongoDB Protection**: UFW firewall blocks port 27017 from external traffic:
  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  ```

---

## 💾 Automated Backup & Recovery

Create `/usr/local/bin/backup-dhansiri-mongo.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb/dhansiri"
DATE=$(date +%Y-%m-%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

mongodump --db dhansiri_agro --archive="$BACKUP_DIR/backup-$DATE.gz" --gzip
# Retain backups for 14 days
find "$BACKUP_DIR" -type f -name "*.gz" -mtime +14 -delete
```

Add daily cron:
```bash
crontab -e
# Add: 0 2 * * * /bin/bash /usr/local/bin/backup-dhansiri-mongo.sh
```

---

## 📊 Health & Telemetry Verification

```bash
# Check API Health
curl https://dhansiriagro.com/api/health
```

Expected Output:
```json
{
  "success": true,
  "status": "Healthy",
  "platform": "Dhansiri Agro Industries Enterprise Platform",
  "version": "1.0.0",
  "environment": "production",
  "database": "connected",
  "uptime": "24h 15m 10s",
  "memory": {
    "rssMB": "85.20",
    "heapUsedMB": "29.40"
  },
  "timestamp": "2026-10-11T12:00:00.000Z",
  "currency": "BDT (৳)"
}
```
