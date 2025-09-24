# Deploying the Seminar Assignments UI

## Local Development

1. Install dependencies:
    ```
    cd docs
    npm install
    ```

2. Run locally:
    ```
    npm run dev
    ```

## Deploy to GitHub Pages

1. Build static files:
    ```
    npm run build
    ```

2. Deploy to GitHub Pages:
    ```
    npm run deploy
    ```

> The site will be available at:  
> `https://rogerjs93.github.io/Seminar-Core-Competences-2025/`

## Automatic Updates

- The UI automatically shows new assignments and notes as they are added to the repository (no need to redeploy for content changes).
