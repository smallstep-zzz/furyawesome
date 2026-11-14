# Contributing to FuryAwesome

The [FuryAwesome Place](https://furyawesome.softandsweet5.chatgpt.site/#request)
prepares a public GitHub issue. Sign in to GitHub and review the draft before submitting.

Maintain releases through the Python catalog command from this repository:

```bash
python scripts/catalog_store.py add /path/to/publication.json
python scripts/catalog_store.py add /path/to/publication.json --category embedding
python scripts/catalog_store.py remove models/RELEASE_ID.json
python scripts/catalog_store.py check
```

Use the release metadata path in the README for removal. The command updates the
categorized source in `model-catalog/` and regenerates the README, `catalog.json`,
per-release metadata and `place-catalog.json`. Commit all changes together.
Furiosa-Hug-Anything calls the same Python function and commits the changes in
one GitHub update. The public site reads `place-catalog.json` from GitHub and uses
its embedded snapshot when GitHub is unavailable. Catalog changes need no Site
redeployment.

Only commit public metadata, source and package licenses, and immutable
Hugging Face artifact URLs. Publish a new version for different model bytes.
The Site source and hosting manifest live in `site/`.
