# Shopify blog export

This folder contains the portfolio's blog posts converted from Markdown into
HTML accepted by Shopify's blog article editor and payloads for Shopify's Admin
GraphQL API.

## Files

- `html/*.html` contains one Shopify-ready article body per post. In Shopify,
  create a blog post, switch the body editor to HTML view, and paste the file's
  contents. Copy the title, excerpt, publication date, and URL handle from
  `articles.json`.
- `articles.json` is a readable manifest containing every article's metadata and
  converted HTML.
- `article-create-payloads.jsonl` contains one complete `articleCreate` GraphQL
  request per line for automated importing.

## Before API import

The generated API payloads use this placeholder blog ID:

`gid://shopify/Blog/REPLACE_WITH_BLOG_ID`

Regenerate the bundle with the destination blog's real GraphQL ID:

```sh
python3 scripts/export_shopify_blog.py \
  --blog-id 'gid://shopify/Blog/123456789'
```

The default export creates drafts so nothing is accidentally published. Add
`--publish` to preserve the original dates and mark the imported articles as
published:

```sh
python3 scripts/export_shopify_blog.py \
  --blog-id 'gid://shopify/Blog/123456789' \
  --publish
```

The API requests require a Shopify custom app token with content-writing access.
