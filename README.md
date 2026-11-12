# bob-site

Website draft for a non-toxic building materials supplier. Flat HTML, hosted on GitHub Pages.

## Layout

- `site/` is the website. Everything in it is published.
- `.github/workflows/deploy.yml` publishes `site/` to GitHub Pages on every push to `main`.
- `set-login.sh` sets the username and password for the sign-in screen.

## First-time setup

1. Run `./set-login.sh` and choose a username and password. Until you do, nobody can sign in.
2. Commit and push to `main`.
3. On GitHub: Settings, then Pages, then set Source to **GitHub Actions**.
4. The site appears at `https://<account>.github.io/<repo>/` a minute or two after the push.

## Everyday changes

Edit the files in `site/`, commit, and push. The Actions tab shows each deploy.

To preview before pushing, open `site/index.html` in a browser.

## About the sign-in screen

The sign-in screen keeps casual visitors out. This repo is public, so the site's files can still be read on GitHub itself.
