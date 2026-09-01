#!/usr/bin/env node
// Inlines a deck's linked stylesheets and scripts into a single
// self-contained HTML file with no external references.
//
// Usage: node build.js <deckDir> <outFile>

const fs = require('fs');
const path = require('path');

function build(deckDir, outFile) {
  const indexPath = path.join(deckDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(
    /<link[^>]+rel=["']stylesheet["'][^>]*>/gi,
    (tag) => {
      const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
      if (!hrefMatch) return tag;
      const cssPath = path.resolve(deckDir, hrefMatch[1]);
      const css = fs.readFileSync(cssPath, 'utf8');
      return `<style>\n${css}\n</style>`;
    }
  );

  html = html.replace(
    /<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi,
    (tag, src) => {
      const jsPath = path.resolve(deckDir, src);
      const js = fs.readFileSync(jsPath, 'utf8');
      return `<script>\n${js}\n</script>`;
    }
  );

  fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
  fs.writeFileSync(outFile, html, 'utf8');
}

function main() {
  const [, , deckDir, outFile] = process.argv;
  if (!deckDir || !outFile) {
    console.error('Usage: node build.js <deckDir> <outFile>');
    process.exit(1);
  }
  build(deckDir, outFile);
}

main();
