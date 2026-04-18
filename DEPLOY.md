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

The workflow [`.github/workflows/deploy-gcs.yml`](.github/workflows/deploy-gcs.yml) builds on every push to `main` **only when** you configure repository **Variables** (Settings → Secrets and variables → Actions → Variables):

| Variable | Example | Purpose |
|----------|---------|---------|
| `GCP_BUCKET` | `my-portfolio-prod` | Bucket name (no `gs://` prefix) |
| `GCP_PROJECT_ID` | `my-gcp-project` | Project for `gcloud` |
| `PUBLIC_SITE_URL` | `https://www.example.com` | Passed to `npm run build` for canonical / Open Graph |

Until `GCP_BUCKET` and `GCP_PROJECT_ID` are set, the deploy job is **skipped** so forks and local clones are unaffected.

Configure these **Secrets** for authentication (prefer **Workload Identity Federation** over JSON keys):

| Secret | Purpose |
|--------|---------|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full WIF provider resource name |
| `GCP_SERVICE_ACCOUNT_EMAIL` | Deployer service account (needs permission to write objects in the bucket, e.g. `roles/storage.objectAdmin` scoped to the bucket) |

Setup guide: [google-github-actions/auth — Workload Identity Federation](https://github.com/google-github-actions/auth#setting-up-workload-identity-federation).

The workflow runs `gcloud storage rsync -r --delete-unmatched-destination-objects dist/ gs://$GCP_BUCKET/`, mirroring the manual sync in section 1. You can also trigger it from the Actions tab (**Run workflow**).

Do not commit service account JSON keys to the repository.

## References

- [Astro static builds](https://docs.astro.build/en/guides/deploy/)
- [Cloud Storage static sites](https://cloud.google.com/storage/docs/hosting-static-website)
- [HTTPS load balancing to buckets](https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-buckets)
