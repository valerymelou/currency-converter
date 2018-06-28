#!/bin/sh

git commit -am "Save uncommited changes (WIP)"
git branch --delete --force gh-pages
git checkout --orphan gh-pages
git add -f www
git commit -m "Rebuild GitHub pages"
git filter-branch -f --prune-empty --subdirectory-filter www && git push -f origin gh-pages && git checkout master
