# XpertAI Docs

## Generate Navigation

Generate or update the `docs.json` navigation configuration based on the folder structure:

```sh
node generate-navigation.mjs
```

### Options

- `--docs <path>`: Path to `docs.json` (default: `docs.json`)
- `--content-root <path>`: Content root directory (default: current directory)
- `--languages <list>`: Comma-separated languages (e.g. `en,zh-Hans`)
- `--dry-run`: Print result without writing `docs.json`
- `--update-titles`: Update English MDX titles from mapping or filename

### Examples

```sh
# Specify docs.json and content root
node generate-navigation.mjs --docs ./docs.json --content-root .

# Only build navigation for en and zh-Hans
node generate-navigation.mjs --languages en,zh-Hans

# Preview result without writing
node generate-navigation.mjs --dry-run

# Update English titles while generating navigation
node generate-navigation.mjs --update-titles
```

## Run Locally with Docker

Run the documentation site locally using Docker:

```sh
docker build -t xpert-ai/docs . \
  && docker run --rm -p 3000:3000 xpert-ai/docs
```

## Preview Locally with Mint

`mint dev`
