#!/usr/bin/env bash
set -euo pipefail

# Build the book-only version of the site
# Output: dist-book/

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SITE_DIR"

BOOK_PAGES="$SITE_DIR/src/pages/book"

echo "==> Swapping layouts to book mode..."
# Swap chapter MDX layouts
for f in "$BOOK_PAGES"/*.mdx; do
  sed -i.bak 's|../../layouts/ChapterLayout.astro|../../layouts/BookChapterLayout.astro|g' "$f"
done
# Swap book index layout
sed -i.bak 's|../../layouts/BaseLayout.astro|../../layouts/BookBaseLayout.astro|g' "$BOOK_PAGES/index.astro"

echo "==> Building book site..."
npx astro build --config astro.config.book.mjs

echo "==> Restoring original layouts..."
for f in "$BOOK_PAGES"/*.mdx.bak; do
  mv "$f" "${f%.bak}"
done
mv "$BOOK_PAGES/index.astro.bak" "$BOOK_PAGES/index.astro"

echo "==> Cleaning non-book pages from output..."
rm -rf dist-book/about/ dist-book/fastchain/ dist-book/products/

# Make the book-index page the root
if [ -f dist-book/book-index/index.html ]; then
  cp dist-book/book-index/index.html dist-book/index.html
  rm -rf dist-book/book-index/
fi

echo "==> Book build complete: dist-book/"
echo "    Pages:"
find dist-book -name "*.html" | sort | sed 's/^/    /'
