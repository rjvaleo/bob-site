#!/bin/bash
# Sets the username and password for the site's sign-in screen.
# Run from the repo folder:  ./set-login.sh
# The password is never stored. Only a one-way fingerprint is written into site/login.html.
set -e
cd "$(dirname "$0")"
FILE="site/login.html"
[ -f "$FILE" ] || { echo "Cannot find $FILE"; exit 1; }
read -r -p "Username: " U
read -r -s -p "Password: " P; echo
read -r -s -p "Password again: " P2; echo
[ "$P" = "$P2" ] || { echo "Passwords do not match. Nothing changed."; exit 1; }
[ -n "$U" ] && [ -n "$P" ] || { echo "Username and password cannot be empty. Nothing changed."; exit 1; }
U=$(printf '%s' "$U" | tr '[:upper:]' '[:lower:]')
if command -v shasum >/dev/null 2>&1; then H=$(printf '%s' "$U:$P" | shasum -a 256 | cut -d' ' -f1); else H=$(printf '%s' "$U:$P" | sha256sum | cut -d' ' -f1); fi
if [ "$(uname)" = "Darwin" ]; then sed -i '' "s/var HASH = '[^']*'/var HASH = '$H'/" "$FILE"; else sed -i "s/var HASH = '[^']*'/var HASH = '$H'/" "$FILE"; fi
grep -q "var HASH = '$H'" "$FILE" && echo "Login updated. Commit and push to publish it." || { echo "Could not update $FILE"; exit 1; }
