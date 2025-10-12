#!/bin/bash

# MindGlow Deployment Script
# A product of Bradley Virtual Solutions, LLC

echo "🧘 MindGlow Deployment Script"
echo "================================"

# Add all changes
echo "📦 Adding changes to Git..."
git add .

# Commit changes
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

# Deploy to Firebase
echo "🔥 Deploying to Firebase Hosting..."
firebase deploy --only hosting --project mindglow-wellness

echo "✅ Deployment complete!"
echo "🌐 GitHub: https://github.com/ronb12/MindGlow"
echo "🔥 Firebase: https://mindglow-wellness.web.app"

