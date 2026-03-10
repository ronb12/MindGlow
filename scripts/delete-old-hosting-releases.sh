#!/usr/bin/env bash
# Delete old Firebase Hosting versions for mindglow-wellness (keeps current live only).
# Uses gcloud for auth and Firebase Hosting REST API.
# Run from project root: bash scripts/delete-old-hosting-releases.sh

set -e
PROJECT="mindglow-wellness"
SITE_ID="mindglow-wellness"
API_BASE="https://firebasehosting.googleapis.com/v1beta1"

echo "Getting access token..."
TOKEN=$(gcloud auth application-default print-access-token)

echo "Getting current live version..."
LIVE_JSON=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "$API_BASE/projects/$PROJECT/sites/$SITE_ID/channels/live")
LIVE_VERSION=$(echo "$LIVE_JSON" | jq -r '.release.version.name // empty')
if [ -z "$LIVE_VERSION" ]; then
  echo "Could not determine live version. Response: $LIVE_JSON"
  exit 1
fi
# Extract short id (e.g. 9f5d6ca4bd66cf0d)
LIVE_ID="${LIVE_VERSION##*/}"
echo "Live version (will keep): $LIVE_ID"

echo "Listing and deleting old versions (keeping live: $LIVE_ID)..."
PAGE_TOKEN=""
DELETED=0
while true; do
  URL="$API_BASE/sites/$SITE_ID/versions?pageSize=100"
  [ -n "$PAGE_TOKEN" ] && URL="$URL&pageToken=$PAGE_TOKEN"
  PAGE=$(curl -s -H "Authorization: Bearer $TOKEN" "$URL")
  while read -r name status; do
    [ -z "$name" ] && continue
    id="${name##*/}"
    [ "$id" = "$LIVE_ID" ] && continue
    [ "$status" = "FINALIZED" ] || continue
    echo "Deleting $name..."
    HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$API_BASE/$name")
    if [ "$HTTP" = "200" ] || [ "$HTTP" = "204" ]; then
      echo "  OK"
      DELETED=$((DELETED + 1))
    else
      echo "  HTTP $HTTP"
    fi
  done < <(echo "$PAGE" | jq -r '.versions[]? | "\(.name) \(.status)"')
  PAGE_TOKEN=$(echo "$PAGE" | jq -r '.nextPageToken // empty')
  [ -z "$PAGE_TOKEN" ] && break
done
echo "Deleted $DELETED old version(s)."

echo "Done. You can now run: firebase deploy --only hosting"
