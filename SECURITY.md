# SpectraCanvas Security Guide 🔒

**Protecting your API keys, tokens, and sensitive data**

## 🚨 Security Best Practices

### 1. Never Commit Secrets to Git

**NEVER do this:**
```javascript
// ❌ BAD - Hardcoded API key
const API_KEY = 'ghp_EXAMPLE_TOKEN_REMOVED';
```

**ALWAYS do this:**
```javascript
// ✅ GOOD - Use environment variables
const API_KEY = process.env.WATSONX_API_KEY;
```

---

## 📁 Environment Variables Setup

### Local Development (.env.local)

Create `.env.local` in project root (already in .gitignore):

```env
# IBM watsonx API Configuration
WATSONX_API_KEY=your_actual_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Optional: GitHub Token (for deployment automation)
# NEVER commit this file to Git!
GITHUB_TOKEN=your_github_token_here
```

### Verify .gitignore

Check that `.gitignore` includes:

```gitignore
# Environment variables
.env
.env*.local
.env.production
.env.development

# Never commit these
*.key
*.pem
secrets/
```

---

## 🔐 Managing Different Types of Secrets

### 1. API Keys (IBM watsonx, OpenAI, etc.)

**Storage:**
- Local: `.env.local`
- Production: Platform environment variables (Vercel, Netlify)

**Access in Code:**
```typescript
// Server-side only (API routes)
const apiKey = process.env.WATSONX_API_KEY;

// Client-side (prefix with NEXT_PUBLIC_)
const publicKey = process.env.NEXT_PUBLIC_APP_URL;
```

### 2. GitHub Personal Access Tokens

**If you need GitHub API access:**

1. **Create token with minimal permissions:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select ONLY required scopes (e.g., `repo` for private repos)
   - Set expiration date (90 days recommended)

2. **Store securely:**
   ```env
   # .env.local (NEVER commit)
   GITHUB_TOKEN=ghp_your_token_here
   ```

3. **Use in code:**
   ```typescript
   // Only in server-side code
   const octokit = new Octokit({
     auth: process.env.GITHUB_TOKEN
   });
   ```

### 3. Database Credentials

**If using databases:**

```env
# .env.local
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://localhost:6379
```

---

## 🌐 Production Deployment Security

### Vercel

1. **Add environment variables:**
   - Go to Project Settings → Environment Variables
   - Add each variable individually
   - Select environments (Production, Preview, Development)

2. **Access in code:**
   ```typescript
   // Automatically available in production
   const apiKey = process.env.WATSONX_API_KEY;
   ```

### Netlify

1. **Add environment variables:**
   - Go to Site Settings → Environment Variables
   - Add variables with values

2. **Build settings:**
   ```toml
   # netlify.toml
   [build.environment]
     NODE_VERSION = "18"
   ```

### Custom Server (VPS, AWS, etc.)

1. **Use environment files:**
   ```bash
   # Create .env.production on server
   sudo nano /var/www/spectracanvas/.env.production
   ```

2. **Set file permissions:**
   ```bash
   chmod 600 .env.production
   chown www-data:www-data .env.production
   ```

3. **Load with PM2:**
   ```bash
   pm2 start npm --name spectracanvas -- start --env production
   ```

---

## 🛡️ Secret Rotation

### When to Rotate Secrets

- **Immediately** if exposed (like in chat, logs, or commits)
- **Regularly** every 90 days for high-security keys
- **After** team member leaves with access
- **When** suspicious activity detected

### How to Rotate

1. **Generate new secret:**
   - Create new API key/token
   - Test in development first

2. **Update everywhere:**
   - Local `.env.local`
   - Production environment variables
   - CI/CD pipelines
   - Team password manager

3. **Revoke old secret:**
   - Delete old API key
   - Revoke old token
   - Monitor for failed auth attempts

---

## 🔍 Checking for Exposed Secrets

### Before Committing

```bash
# Check for potential secrets in staged files
git diff --cached | grep -i "api_key\|token\|password\|secret"

# Use git-secrets tool
git secrets --scan
```

### In Git History

```bash
# Search entire git history for patterns
git log -p | grep -i "api_key\|token\|password"

# Use truffleHog
trufflehog git file://. --only-verified
```

### If You Accidentally Committed Secrets

1. **Revoke the secret immediately**
2. **Remove from git history:**
   ```bash
   # Use BFG Repo-Cleaner
   bfg --replace-text passwords.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```
3. **Force push (if safe):**
   ```bash
   git push --force
   ```

---

## 📋 Security Checklist

### Before Development
- [ ] Create `.env.local` with all required secrets
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Never hardcode secrets in code
- [ ] Use `process.env.VARIABLE_NAME` for all secrets

### Before Committing
- [ ] Run `git status` to check staged files
- [ ] Ensure no `.env` files are staged
- [ ] Search code for hardcoded secrets
- [ ] Review diff for sensitive data

### Before Deploying
- [ ] Add all environment variables to platform
- [ ] Test with production environment variables
- [ ] Verify secrets are not in build logs
- [ ] Check that `.env.local` is not deployed

### Regular Maintenance
- [ ] Rotate API keys every 90 days
- [ ] Review access logs for suspicious activity
- [ ] Update team on security practices
- [ ] Audit third-party integrations

---

## 🚨 What to Do If Secrets Are Exposed

### Immediate Actions (Within 5 minutes)

1. **Revoke the exposed secret:**
   - GitHub: https://github.com/settings/tokens
   - IBM watsonx: IBM Cloud dashboard
   - Other services: Check their security settings

2. **Generate new secret:**
   - Create replacement immediately
   - Update `.env.local`
   - Update production environment variables

3. **Monitor for abuse:**
   - Check API usage logs
   - Review recent activity
   - Set up alerts for unusual patterns

### Follow-up Actions (Within 24 hours)

1. **Audit all secrets:**
   - Review all API keys and tokens
   - Rotate any that might be compromised
   - Update documentation

2. **Review security practices:**
   - Train team on proper secret handling
   - Implement automated secret scanning
   - Set up pre-commit hooks

3. **Document incident:**
   - What was exposed
   - How it happened
   - Steps taken to remediate
   - Preventive measures implemented

---

## 🔧 Tools for Secret Management

### Development Tools

1. **dotenv** (already included in Next.js)
   ```bash
   npm install dotenv
   ```

2. **git-secrets** (prevent commits with secrets)
   ```bash
   brew install git-secrets
   git secrets --install
   git secrets --register-aws
   ```

3. **truffleHog** (find secrets in git history)
   ```bash
   pip install truffleHog
   trufflehog git file://. --only-verified
   ```

### Production Secret Management

1. **HashiCorp Vault** (enterprise)
2. **AWS Secrets Manager**
3. **Azure Key Vault**
4. **Google Secret Manager**

---

## 📚 Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/best-practices-for-preventing-data-leaks-in-your-organization)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ SpectraCanvas Specific Setup

### Current Configuration

Your SpectraCanvas project is already configured with:
- ✅ `.gitignore` includes `.env*.local`
- ✅ `.env.local` template provided
- ✅ Environment variables used in API routes
- ✅ No hardcoded secrets in codebase

### Required Environment Variables

```env
# Required for IBM watsonx integration
WATSONX_API_KEY=your_key
WATSONX_PROJECT_ID=your_project
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Optional for deployment
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Your project is secure by default!** Just follow the practices in this guide. 🔒
