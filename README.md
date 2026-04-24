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
# and/or an overrides file (takes precedence over .env)
cp apps/deploy-web/env/.env.sample apps/deploy-web/env/.env.local
```

The sample has everything annotated. The short version:

### Required — app won't boot without these

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Console's own HTTP API base URL |
| `NEXT_PUBLIC_STATS_APP_URL` | Akash stats/explorer URL (e.g. `https://stats.akash.network`) |
| `NEXT_PUBLIC_PROVIDER_PROXY_URL` | Provider proxy URL used to talk to Akash providers |
| `NEXT_PUBLIC_BASE_API_MAINNET_URL` / `_TESTNET_URL` / `_SANDBOX_URL` | Client-visible Akash chain API per network |
| `BASE_API_MAINNET_URL` / `_TESTNET_URL` / `_SANDBOX_URL` | Server-side equivalents (full URLs) |
| `NEXT_PUBLIC_BASE_TEMPLATES_URL` | URL for the SDL template catalog |
| `E2E_TESTING_CLIENT_TOKEN` | Any random non-empty string |

### Optional (defaults applied)

| Variable | Default |
|---|---|
| `NEXT_PUBLIC_DEFAULT_NETWORK_ID` | `mainnet` |
| `NEXT_PUBLIC_NODE_ENV` | `development` |
| `NEXT_PUBLIC_DEFAULT_INITIAL_DEPOSIT` | `500000` (uakt) |
| `MAINTENANCE_MODE` | `false` |
| `DEFAULT_REST_API_NODE_URL_MAINNET` / `DEFAULT_RPC_NODE_URL_MAINNET` | unset |

Never commit your `.env` / `.env.local` — the repo's `.gitignore` already excludes them.

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
