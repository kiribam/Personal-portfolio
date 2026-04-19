# Deploying to Google Cloud (static site)

This project builds to a static `dist/` directory (`npm run build`). Astro is configured with `trailingSlash: 'always'` so paths map cleanly to `index.html` per folder—compatible with [Cloud Storage static website hosting](https://cloud.google.com/storage/docs/hosting-static-website).

## 1. Production build

Set your real domain so canonical and Open Graph URLs are correct:

```bash
export PUBLIC_SITE_URL=https://www.yourdomain.com
npm ci
npm run build
```

Upload the **contents** of `dist/` to your bucket (preserve directory structure).

Example using [`gcloud storage`](https://cloud.google.com/sdk/gcloud/reference/storage):

```bash
BUCKET=gs://YOUR_BUCKET_NAME
gcloud storage rsync -r --delete-unmatched-destination-objects dist/ "$BUCKET"
```

Alternatively, [`gsutil rsync`](https://cloud.google.com/storage/docs/gsutil/commands/rsync):

```bash
gsutil -m rsync -r -d dist/ gs://YOUR_BUCKET_NAME
```

## 2. Bucket website configuration

In the [Cloud Console](https://console.cloud.google.com/storage) or via `gcloud`:

- Set the **main page** suffix to `index.html` and the **not found page** to `404.html` if you use bucket website mode.
- See: [Host a static website](https://cloud.google.com/storage/docs/hosting-static-website).

Ensure objects are world-readable if you serve directly from the bucket, or front the bucket with a load balancer (recommended for HTTPS + custom domain).

## 3. HTTPS and custom domain (recommended)

Cloud Storage’s native website endpoint does not provide HTTPS on a custom domain the way a production portfolio usually needs. The standard pattern is:

1. Create a **global external Application Load Balancer** with an HTTPS frontend.
2. Use a **backend bucket** pointing at your site bucket.
3. Attach a **Google-managed SSL certificate** for your domain.
4. Point DNS **A/AAAA** records at the load balancer’s IP.

Official guide: [Set up a global external Application Load Balancer with Cloud Storage buckets](https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-buckets).

Optional: enable [Cloud CDN](https://cloud.google.com/cdn/docs) on the backend bucket for caching and lower latency.

## 4. GitHub Actions deploy (optional)

The workflow [`.github/workflows/deploy-gcs.yml`](.github/workflows/deploy-gcs.yml) builds on every push to `main` when the right configuration is present. It uses **two different places** in GitHub: **Variables** (non-secret) and **Secrets** (encrypted). The workflow file reads them by **exact name**—typo in the name means the step will fail or be skipped.

### 4a. Repository variables (not secret)

In GitHub: **Settings → Secrets and variables → Actions → Variables** (open the **Variables** tab, not Secrets).

Click **New repository variable** and create each row:

- **`GCP_BUCKET`** — value is only the bucket name, e.g. `my-portfolio-prod` (no `gs://`).
- **`GCP_PROJECT_ID`** — your GCP project ID, e.g. `my-gcp-project`.
- **`PUBLIC_SITE_URL`** (optional but recommended) — your public site URL with scheme, e.g. `https://www.example.com` (no trailing slash). If you omit it, the workflow falls back to `https://example.com` for the build.

Until **`GCP_BUCKET`** and **`GCP_PROJECT_ID`** are both set, the deploy job is **skipped** so forks and local clones are unaffected.

### 4b. Repository secrets (encrypted — this is what people often miss)

In GitHub: **Settings → Secrets and variables → Actions → Secrets** (open the **Secrets** tab).

Click **New repository secret** and create each row. The **name** must match character-for-character:

- **`GCP_WORKLOAD_IDENTITY_PROVIDER`** — paste the full Workload Identity Federation **provider resource name** (one long string from Google Cloud / `gcloud`, usually starting with `projects/`).
- **`GCP_SERVICE_ACCOUNT_EMAIL`** — paste the deployer **service account email**, e.g. `github-deploy@my-gcp-project.iam.gserviceaccount.com`. That account needs permission to write objects to the bucket (for example `roles/storage.objectAdmin` on that bucket).

These two entries are **secrets**, not variables, because they identify your cloud trust configuration. Do **not** put them in `Variables`; the Actions UI keeps Secrets masked in logs.

Optional reading: [google-github-actions/auth — Workload Identity Federation](https://github.com/google-github-actions/auth#setting-up-workload-identity-federation).

The workflow then runs `gcloud storage rsync -r --delete-unmatched-destination-objects dist/ gs://$GCP_BUCKET/`, same idea as section 1. You can also run the workflow manually from the **Actions** tab (**Deploy to GCS → Run workflow**).

Do not commit service account JSON keys to the repository.

### 4c. Run the same deploy steps on your Mac

From the repo root (requires `gcloud` installed and a shell where you are already authenticated to GCP, e.g. `gcloud auth login` and `gcloud config set project YOUR_PROJECT_ID`):

```bash
chmod +x scripts/deploy-gcs-local.sh
export PUBLIC_SITE_URL=https://www.yourdomain.com
export GCP_BUCKET=your-bucket-name
./scripts/deploy-gcs-local.sh
```

That script runs `npm ci`, `npm run build`, then `gcloud storage rsync` to `gs://$GCP_BUCKET/`. If you omit `GCP_BUCKET`, the script exits with a short error telling you to set it.

## References

- [Astro static builds](https://docs.astro.build/en/guides/deploy/)
- [Cloud Storage static sites](https://cloud.google.com/storage/docs/hosting-static-website)
- [HTTPS load balancing to buckets](https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-buckets)
