# Console Crypto

Self-hostable, self-custody crypto wallet UI for deploying on the [Akash Network](https://akash.network).

## Requirements

- **Node.js** >= 20
- **npm** >= 11

## Setup

```bash
git clone git@github.com:baktun14/console-crypto.git
cd console-crypto
npm install
```

## Environment

Env files live under [apps/deploy-web/env/](apps/deploy-web/env/) and are gitignored. Create your local file from the sample:

```bash
cp apps/deploy-web/env/.env.sample apps/deploy-web/env/.env
# and/or an overrides file
cp apps/deploy-web/env/.env.sample apps/deploy-web/env/.env.local
```

Fill in the values. The sample lists every variable — secrets (API keys, client secrets, tokens) must be provided by whoever operates your instance; do not commit them.

## Run

From the repo root:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) (or `3001` if `3000` is in use).

## Build & Production

```bash
npm run build
npm --workspace apps/deploy-web run start
```

## Project Layout

This is an npm-workspaces monorepo:

- [apps/deploy-web/](apps/deploy-web/) — the Next.js console UI
- [packages/](packages/) — shared libraries consumed by the app

## Versions

- Cosmos SDK target: **53**

## License

Apache-2.0
