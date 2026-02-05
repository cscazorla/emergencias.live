# emergencias.live

Emergency phone numbers, real-time alerts, and emergency guides for Spain. Ultra-lightweight static site, no client-side JavaScript.

## Features

- **Ultra-lightweight**: ~90 KB total, ~7 KB per page
- **No JavaScript**: Works on any browser or device
- **Real-time alerts**: Weather alerts (AEMET) and earthquakes (IGN)
- **Emergency guides**: Step-by-step instructions for 8 emergency types
- **Dark mode**: Automatic based on system preferences
- **Direct calling**: `tel:` links for one-tap calling
- **Accessible**: Semantic HTML, large touch targets
- **Print-friendly**: Optimized styles for printing guides

## Pages

| Page | Description |
|------|-------------|
| `/` | Emergency phone numbers |
| `/alertas` | Weather alerts + recent earthquakes |
| `/guias/` | Emergency guides index |
| `/guias/terremotos` | Earthquake guide |
| `/guias/tornados` | Tornado guide |
| `/guias/inundaciones` | Flood guide |
| `/guias/incendios` | Fire guide |
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
| [AEMET](https://www.aemet.es) | Weather alerts | Every 15 min |
| [IGN](https://www.ign.es) | Earthquakes (M ≥ 2.0, last 48h) | Every 15 min |

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
├── netlify/
│   └── functions/
│       └── scheduled-build.js  # 15-min rebuild trigger
├── netlify.toml           # Netlify configuration
└── package.json
```

## Deployment

The site is deployed on [Netlify](https://www.netlify.com). Alerts are kept fresh via a scheduled function that triggers a rebuild every 15 minutes using a build hook.

## License

MIT
