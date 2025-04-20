#!/bin/bash

# Build the project
npm run build

# Create a temporary directory for deployment
mkdir -p tmp_deploy

# Copy the build files to the temporary directory
cp -R docs/* tmp_deploy/

# Switch to the gh-pages branch
git checkout gh-pages || git checkout -b gh-pages

# Remove existing files
rm -rf *

# Copy the build files from the temporary directory
cp -R tmp_deploy/* .

# Remove the temporary directory
rm -rf tmp_deploy

# Add all files
git add .

# Commit
git commit -m "Deploy to GitHub Pages"

# Push to the gh-pages branch
git push origin gh-pages

# Switch back to the main branch
git checkout main

echo "Deployed to GitHub Pages!"
