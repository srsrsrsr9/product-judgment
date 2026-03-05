#!/usr/bin/env bash
set -euo pipefail

# Build the book-only version of the site
# Output: dist-book/
#
# This script:
# 1. Swaps chapter layouts to use BookChapterLayout (book-only nav)
# 2. Builds with the book config
# 3. Removes non-book pages from output
# 4. Makes the book landing page the root index
# 5. Restores original chapter layouts

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SITE_DIR"

BOOK_PAGES="$SITE_DIR/src/pages/book"
CHAPTER_LAYOUT="../../layouts/ChapterLayout.astro"
BOOK_CHAPTER_LAYOUT="../../layouts/BookChapterLayout.astro"

echo "==> Swapping chapter layouts to book mode..."
for f in "$BOOK_PAGES"/*.mdx; do
  sed -i.bak "s|$CHAPTER_LAYOUT|$BOOK_CHAPTER_LAYOUT|g" "$f"
done

echo "==> Building book site..."
npx astro build --config astro.config.book.mjs

echo "==> Restoring original chapter layouts..."
for f in "$BOOK_PAGES"/*.mdx.bak; do
  mv "$f" "${f%.bak}"
done

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
