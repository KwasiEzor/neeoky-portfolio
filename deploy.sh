#!/bin/bash

# neeoky-portfolio — Deployment Script
# This script ensures your main branch is synced and pushed.
# Vercel will automatically trigger a redeploy when a push occurs on 'main'.

echo "🚀 Starting deployment process..."

# 1. Sync local main with remote
echo "📥 Syncing main branch..."
git checkout main
git pull origin main

# 2. Final check for any unstaged changes
if [[ -n $(git status -s) ]]; then
  echo "⚠️ Warning: You have unstaged changes. Please commit them before deploying."
  exit 1
fi

# 3. Push to main
echo "📤 Pushing to main branch on GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ Push successful! Vercel is now building your updated portfolio."
  echo "👉 Visit: https://vercel.com/dashboard to track progress."
else
  echo "❌ Error: Failed to push to main. Check your internet connection or git permissions."
  exit 1
fi
