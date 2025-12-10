# GitHub Pages Deployment

This repository uses GitHub Actions to build and deploy the app to GitHub Pages. The workflow publishes the build to the gh-pages branch.

## How it works

When changes are pushed to the main branch, the GitHub Actions workflow automatically:
1. Checks out the repository
2. Sets up Node.js environment
3. Installs dependencies
4. Runs the build script
5. Deploys the build output to the gh-pages branch

## Configuration

To enable GitHub Pages for this repository:
1. Go to repository Settings → Pages
2. Set the source to the `gh-pages` branch
3. The site will be available at `https://<username>.github.io/<repository-name>/`
