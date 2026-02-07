# emergencias.live

Official repository for [emergencias.live](https://emergencias.live) — emergency phone numbers, real-time alerts, and emergency guides for Spain. Ultra-lightweight static site, no client-side JavaScript.

## Features

- **Ultra-lightweight**: ~126 KB total, ~7 KB per page
- **No JavaScript**: Works on any browser or device
- **Real-time alerts**: Weather alerts (AEMET), earthquakes (IGN), and traffic incidents (DGT)
- **Emergency guides**: Step-by-step instructions for 9 emergency types
- **Dark mode**: Automatic based on system preferences
- **Direct calling**: `tel:` links for one-tap calling
- **Accessible**: Semantic HTML, large touch targets
- **Print-friendly**: Optimized styles for printing guides

## Pages

| Page | Description |
|------|-------------|
| `/` | Emergency phone numbers |
| `/alertas` | Weather alerts + earthquakes + traffic incidents |
| `/comunidades` | Emergency phone numbers by autonomous community |
| `/guias/` | Emergency guides index |
| `/guias/terremotos` | Earthquake guide |
| `/guias/tornados` | Tornado guide |
| `/guias/inundaciones` | Flood guide |
| `/guias/incendios` | Fire guide |
| `/guias/accidentes-trafico` | Traffic accident guide |
| `/guias/fugas-gas` | Gas leak guide |
| `/guias/apagones` | Power outage guide |
| `/guias/golpe-calor` | Heat stroke guide |
| `/guias/hipotermia` | Hypothermia guide |

## Phone Numbers

| Service | Phone |
|---------|-------|
| General emergencies | 112 |
| National Police | 091 |
| Civil Guard | 062 |
| Fire department | 080 |
| Maritime rescue | 900 202 202 |
| Poison control | 91 562 04 20 |
| Domestic violence | 016 |
| Child helpline (ANAR) | 116 111 |
| Suicide prevention | 717 003 717 |

## Data Sources

| Source | Data | Update frequency |
|--------|------|------------------|
| [AEMET](https://www.aemet.es) | Weather alerts | Every 2 hours |
| [IGN](https://www.ign.es) | Earthquakes (M ≥ 2.0, last 48h) | Every 2 hours |
| [DGT](https://nap.dgt.es) | Traffic incidents (high severity) | Every 2 hours |

## Development

### Prerequisites

- Node.js 18+

### Local development

```bash
# Install dependencies
npm install

# Build the site (fetches live RSS data)
npm run build

# Serve locally
npx serve dist
```

Open http://localhost:3000 (serve)

### Project structure

```
emergencias.live/
├── dist/                  # Generated output (git-ignored)
├── scripts/
│   └── build.js           # Static site generator
├── .github/
│   └── workflows/
│       └── scheduled-build.yml  # 2-hourly rebuild via GitHub Actions
└── package.json
```

## Deployment

The site is deployed on [Cloudflare Pages](https://pages.cloudflare.com). A GitHub Actions workflow builds and deploys the site on every push to `main` and every 2 hours via cron using `wrangler`. Security and cache headers are generated at build time via a `_headers` file.

## License

MIT
