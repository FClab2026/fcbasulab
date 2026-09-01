# FC-BASU Lab Website Deployment Guide

This guide describes the standard deployment workflow for the FC-BASU Lab Next.js website.

The important principle is:

> **Build locally, copy the production archive to the IITD server, and run `deploy-zip.sh`.**

The IITD server should not perform the Next.js production build because the build may fail due to insufficient memory (OOM).

---

## 1. Deployment Architecture

```text
Local development machine
        |
        | npm ci
        | npm run build
        | create fcbasulab-deploy.tar.gz
        v
scp to IITD server
        |
        v
/var/www/fcbasulab/https/
        |
        | ./deploy-zip.sh
        v
fcbasulab-app/
        |
        | PM2
        v
Next.js standalone server :3000
        |
        | Apache reverse proxy
        v
fcbasulab.iitd.ac.in
```

---

# 2. Server Directory Structure

The application is hosted under:

```text
/var/www/fcbasulab/https/
```

Current structure:

```text
https/
├── .env
├── .nvm/
├── .pm2/
├── fcbasulab-app/
├── cgi-bin/
├── html/
├── deploy.sh
├── deploy-zip.sh
├── pm2-alias.sh
└── use-node24.sh
```

### Purpose of important files/directories

| Path | Purpose |
|---|---|
| `.env` | Server-side runtime environment variables |
| `.nvm/` | User-local NVM installation and Node.js 24 |
| `.pm2/` | PM2 runtime state, logs and PIDs |
| `fcbasulab-app/` | Deployed application files only |
| `use-node24.sh` | Loads Node.js 24 |
| `deploy-zip.sh` | Main deployment script |
| `deploy.sh` | Starts/recreates the PM2 application |
| `pm2-alias.sh` | Optional PM2 shell alias |

The `fcbasulab-app` directory should contain only the deployed application and should not contain `.pm2`.

---

# 3. Local Build

## Linux

From the project directory:

```bash
npm ci
npm run build
```

## Windows

If developing on Windows, use **WSL** and perform the production build inside the Linux environment.

Example:

```bash
npm ci
npm run build
```

This keeps the build environment consistent with the Linux server environment.

### Important

Do **not** run:

```bash
npm run build
```

on the IITD server.

The Next.js build can consume significant memory and may fail with an **OOM (Out Of Memory)** error on the server.

---

# 4. Create the Deployment Archive

After a successful local build, create the deployment archive.

The archive must use the exact filename expected by the deployment script:

```text
fcbasulab-deploy.tar.gz
```

For example:

```bash
tar -czf fcbasulab-deploy.tar.gz .next public
```

Use the project's current deployment packaging requirements if additional files need to be included.

Before copying, verify:

```bash
ls -lh fcbasulab-deploy.tar.gz
```

Optionally inspect it:

```bash
tar -tzf fcbasulab-deploy.tar.gz | head -30
```

---

# 5. Copy the Archive to the IITD Server

Copy the archive to:

```text
/var/www/fcbasulab/https/
```

Example:

```bash
scp fcbasulab-deploy.tar.gz \
  ch7230098@vweb213:/var/www/fcbasulab/https/
```

The important requirement is that the file arrives as:

```text
/var/www/fcbasulab/https/fcbasulab-deploy.tar.gz
```

---

# 6. Deploy on the IITD Server

SSH into the server:

```bash
ssh chxxxxxxx@fcbasulab.iitd.ac.in
```

Then:

```bash
cd /var/www/fcbasulab/https
```

Check that the archive exists:

```bash
ls -lh fcbasulab-deploy.tar.gz
```

Then simply run:

```bash
./deploy-zip.sh
```

**This is the only deployment script that should normally need to be run manually after copying a new build.**

The script handles the server-side deployment process, including extracting the archive and restarting the application.

---

# 7. Server Runtime Environment

The server has its own environment file:

```text
/var/www/fcbasulab/https/.env
```

This file should be maintained separately from the local build.

The application is run with:

```text
--env-file=/var/www/fcbasulab/https/.env
```

Therefore, a local `.env` should not replace the server's runtime `.env`.

If a deployment archive contains:

```text
.next/standalone/.env
```

the deployment process should remove that bundled environment file so that the explicitly configured server runtime environment is used.(The deploy-zip.sh handles this)

---

# 8. Node.js 24

Node.js 24 is installed locally for the user under:

```text
/var/www/fcbasulab/https/.nvm
```

Current Node version:

```text
v24.20.0
```

To load it manually:

```bash
source /var/www/fcbasulab/https/use-node24.sh
```

Verify:

```bash
node -v
which node
npm -v
```

Expected Node path:

```text
/var/www/fcbasulab/https/.nvm/versions/node/v24.20.0/bin/node
```

Node.js 24 does not need to be installed system-wide for this deployment setup.

---

# 9. PM2

PM2 stores its runtime data outside the application directory:

```text
/var/www/fcbasulab/https/.pm2
```

This keeps the application directory clean.

The PM2 home is:

```bash
export PM2_HOME="/var/www/fcbasulab/https/.pm2"
```

The application itself is:

```text
/var/www/fcbasulab/https/fcbasulab-app/.next/standalone/server.js
```

## Check PM2

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 list
```

## Check the application

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 show fcbasulab
```

The output should show:

```text
status          online
node.js version 24.20.0
```

## Logs

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 logs fcbasulab
```

Or:

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 logs fcbasulab --lines 100
```

---

# 10. Fresh SSH Login

After a fresh login, load Node 24:

```bash
source /var/www/fcbasulab/https/use-node24.sh
```

Then set the PM2 home:

```bash
export PM2_HOME="/var/www/fcbasulab/https/.pm2"
```

Now PM2 commands can be used:

```bash
pm2 list
pm2 status
pm2 logs fcbasulab
```

If the `pm2f` alias has been configured, it can be used instead.

---

# 11. Optional PM2 Alias

For convenience, an alias can be configured:

```bash
alias pm2f='PM2_HOME=/var/www/fcbasulab/https/.pm2 pm2'
```

Then:

```bash
pm2f list
pm2f status
pm2f logs fcbasulab
pm2f show fcbasulab
```

The alias is only a shell convenience. PM2 itself continues to use:

```text
/var/www/fcbasulab/https/.pm2
```

---

# 12. Testing the Application

Before relying on Apache/domain routing, test the Next.js application directly:

```bash
curl --noproxy "*" http://127.0.0.1:3000
```

A successful response means the Next.js server is running and accepting requests on port `3000`.

If there are API/network errors, check:

```bash
pm2 logs fcbasulab --lines 100
```

---

# 13. Apache / Web Server Routing

The application runs internally on:

```text
127.0.0.1:3000
```

The public domain is:

```text
fcbasulab.iitd.ac.in
```

The expected flow is:

```text
Browser
   |
   v
fcbasulab.iitd.ac.in
   |
   v
IITD server
   |
   v
Apache / web server
   |
   v
127.0.0.1:3000
   |
   v
Next.js
```

The DNS entry points the domain to the IITD server. Apache/web-server configuration then reverse-proxies requests for the domain to the Next.js application on port `3000`.

Conceptually, the Apache configuration is similar to:

```apache
<VirtualHost *:80>
    ServerName fcbasulab.iitd.ac.in

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```

For HTTPS, the administrator will configure the appropriate HTTPS virtual host and certificate.

Port `3000` does not need to be publicly exposed.

---

# 14. Environment vs Apache Proxy

These are two different things.

### Incoming website traffic

```text
Browser
   ↓
Apache
   ↓
127.0.0.1:3000
   ↓
Next.js
```

### Outgoing application traffic

For example, when the Next.js server communicates with an external API:

```text
Next.js
   ↓
network/proxy configuration
   ↓
External API
```

The application's runtime environment is independent of Apache's reverse-proxy configuration.

---

# 15. Normal Deployment — Quick Version

For every new release:

### On local machine

```bash
npm ci
npm run build
tar -czf fcbasulab-deploy.tar.gz .next public
```

Then:

```bash
scp fcbasulab-deploy.tar.gz \
  ch7230098@vweb213:/var/www/fcbasulab/https/
```

### On IITD server

```bash
cd /var/www/fcbasulab/https
./deploy-zip.sh
```

Then verify:

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 show fcbasulab
```

and:

```bash
curl --noproxy "*" http://127.0.0.1:3000
```

Check logs if required:

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 logs fcbasulab --lines 100
```

---

# 16. Deployment Checklist

## Local

- [ ] Code changes completed.
- [ ] Linux environment used for the production build.
- [ ] Windows users use WSL.
- [ ] `npm ci` succeeds.
- [ ] `npm run build` succeeds.
- [ ] `fcbasulab-deploy.tar.gz` created with the exact expected filename.
- [ ] Archive checked with `tar -tzf`.

## Transfer

- [ ] Archive copied to `/var/www/fcbasulab/https/`.
- [ ] Archive filename is exactly `fcbasulab-deploy.tar.gz`.

## Server

- [ ] Run `./deploy-zip.sh`.
- [ ] Server `.env` is preserved.
- [ ] Bundled `.next/standalone/.env` is removed if present.
- [ ] Node 24 is available.
- [ ] PM2 is online.
- [ ] PM2 uses `/var/www/fcbasulab/https/.pm2`.
- [ ] `pm2 show fcbasulab` reports Node 24.
- [ ] `curl --noproxy "*" http://127.0.0.1:3000` works.
- [ ] PM2 logs contain no startup errors.

## Public site

- [ ] Apache/web server reverse proxy is configured.
- [ ] Domain routes to `127.0.0.1:3000`.
- [ ] HTTPS configuration is handled by the administrator.
- [ ] Site is ready for internal security audit.

---

# 17. Troubleshooting

## `node: bad option: --env-file`

The process is likely being started with an older Node version.

Run:

```bash
source /var/www/fcbasulab/https/use-node24.sh
node -v
```

Then verify PM2:

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 show fcbasulab
```

It should report Node 24.

## PM2 shows `errored`

Check:

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 logs fcbasulab --lines 100
```

Also:

```bash
PM2_HOME="/var/www/fcbasulab/https/.pm2" pm2 show fcbasulab
```

Check:

- Node.js version
- script path
- Node arguments
- environment file
- application startup errors

## Localhost works but the domain does not

If:

```bash
curl --noproxy "*" http://127.0.0.1:3000
```

works but:

```text
fcbasulab.iitd.ac.in
```

does not, the Next.js application is probably running correctly.

The issue is likely with:

- Apache/web-server configuration
- reverse proxy configuration
- DNS
- HTTPS/certificate configuration

Contact the Webmaster/sysadmin to check the web-server configuration.

## Build fails with OOM on IITD server

Do not repeatedly attempt the production build on the server.

Build locally in Linux/WSL:

```bash
npm ci
npm run build
```

Then package and transfer the production build.

---

# 18. Final Deployment Pattern

The complete process should remain:

```text
1. Develop locally
        ↓
2. Use Linux / WSL
        ↓
3. npm ci
        ↓
4. npm run build
        ↓
5. Create fcbasulab-deploy.tar.gz
        ↓
6. scp archive to IITD
        ↓
7. SSH into IITD
        ↓
8. cd /var/www/fcbasulab/https
        ↓
9. ./deploy-zip.sh
        ↓
10. Verify PM2
        ↓
11. Test 127.0.0.1:3000
        ↓
12. Apache routes domain → 127.0.0.1:3000
        ↓
13. Site ready for internal audit
```

For normal future deployments, steps 1–6 happen on the local machine and **step 9 is the only deployment command that should normally be required on the server**.

---

# Contact

For further deployment or technical queries:

**Keshav Raj**  
IIT Delhi

Email: **keshavraj09898@gmail.com**
