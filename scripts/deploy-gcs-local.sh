#!/usr/bin/env bash
# Run the same build + rsync as .github/workflows/deploy-gcs.yml, on your machine.
#
# Usage:
#   export PUBLIC_SITE_URL=https://www.yourdomain.com   # optional; defaults below
#   export GCP_BUCKET=my-portfolio-prod                 # bucket name only, no gs://
#   ./scripts/deploy-gcs-local.sh
#
# Prerequisites: gcloud CLI installed and logged in (`gcloud auth login` and
# `gcloud config set project YOUR_PROJECT_ID`), and an account that can write objects to the bucket.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-https://example.com}"
export PUBLIC_SITE_URL

if [[ -z "${GCP_BUCKET:-}" ]]; then
	echo "error: set GCP_BUCKET to your bucket name (no gs:// prefix), e.g." >&2
	echo "  export GCP_BUCKET=my-portfolio-prod" >&2
	exit 1
fi

if ! command -v gcloud >/dev/null 2>&1; then
	echo "error: gcloud not found. Install: https://cloud.google.com/sdk/docs/install" >&2
	exit 1
fi

echo "→ npm ci"
npm ci

echo "→ npm run build (PUBLIC_SITE_URL=$PUBLIC_SITE_URL)"
npm run build

echo "→ gcloud storage rsync → gs://${GCP_BUCKET}/"
gcloud storage rsync -r --delete-unmatched-destination-objects dist/ "gs://${GCP_BUCKET}/"

echo "Done. Open your bucket site or load balancer URL to verify."
