# ethanjschreiber.com

Ethan Schreiber's personal site. Plain static HTML/CSS, deployed via GitHub Pages with a custom domain.

## Deploy

The repo is set up to deploy as a **user-pages site** from Ethan's GitHub account.

1. Create a new repo on Ethan's account named `ethanschreiber.github.io` (public).
2. From this directory:
   ```sh
   git init
   git add -A
   git commit -m "Initial site"
   git branch -M main
   git remote add origin git@github.com:ethanschreiber/ethanschreiber.github.io.git
   git push -u origin main
   ```
3. In the repo's **Settings → Pages**, confirm:
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
4. Custom domain (`ethanjschreiber.com`) is wired via the `CNAME` file in this repo. After the first push, in **Settings → Pages**, the field should auto-populate. Tick **Enforce HTTPS** once the cert provisions (a few minutes).
5. DNS — at the domain registrar for `ethanjschreiber.com`, set:
   - Apex `A` records → GitHub Pages IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` `CNAME` → `ethanschreiber.github.io`

## Structure

- `index.html` — home
- `work.html` — selected work
- `projects.html` — personal projects
- `about.html` — bio
- `contact.html` — email + LinkedIn
- `404.html` — not-found page
- `styles.css` — single shared stylesheet
- `images/` — site imagery
- `CNAME` — custom domain
- `.nojekyll` — skip Jekyll processing on Pages

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```
