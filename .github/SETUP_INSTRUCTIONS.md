# GitHub Actions Mirror Setup Instructions

## Overview
This repository is configured to automatically sync with the public mirror repository at [https://github.com/Maximus-Technologies-Uganda/training-prince-mirror](https://github.com/Maximus-Technologies-Uganda/training-prince-mirror) whenever changes are pushed to the `main` or `development` branches.

## Required GitHub Repository Secrets

To enable the automatic syncing, you need to configure the following secret in your private repository:

### 1. MIRROR_TOKEN
- **Purpose**: Personal Access Token (PAT) with permissions to push to the public mirror repository
- **How to create**:
  1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Click "Generate new token (classic)"
  3. Give it a descriptive name like "Mirror Sync Token"
  4. Select scopes:
     - `repo` (Full control of private repositories)
     - `public_repo` (Access public repositories)
  5. Click "Generate token"
  6. Copy the token immediately (you won't be able to see it again)

### 2. Adding the Secret to Your Repository
1. Go to your private repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `MIRROR_TOKEN`
5. Value: Paste the personal access token you generated
6. Click "Add secret"

## How It Works

The workflow (`sync-to-public-mirror.yml`) will:
- Trigger on pushes to `main` and `development` branches
- Trigger on merged pull requests to `main` and `development` branches
- Check out the latest code from your private repository
- Push the changes to the corresponding branch on the public mirror
- Force push to ensure the mirror is always up-to-date

## Security Notes

- The `GITHUB_TOKEN` is automatically provided by GitHub Actions and has limited permissions
- The `MIRROR_TOKEN` should be a personal access token with minimal required permissions
- The mirror repository should be public and used only for sharing code, not for sensitive information

## Troubleshooting

If the sync fails:
1. Check that the `MIRROR_TOKEN` secret is properly configured
2. Verify that the token has the correct permissions
3. Ensure the mirror repository exists and is accessible
4. Check the Actions tab in your repository for detailed error logs

## Manual Sync

If you need to manually trigger a sync:
1. Go to the Actions tab in your repository
2. Find the "Sync to Public Mirror" workflow
3. Click "Run workflow"
4. Select the branch you want to sync
