const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const SRC_DIR = path.join(__dirname, '..', 'src');

// RSS Feed URLs
const AEMET_RSS = 'https://www.aemet.es/documentos_d/eltiempo/prediccion/avisos/rss/CAP_AFAE_wah_RSS.xml';
const IGN_RSS = 'https://www.ign.es/ign/RssTools/sismologia.xml';
const DGT_DATEX2 = 'https://nap.dgt.es/datex2/v3/dgt/SituationPublication/datex2_v36.xml';

// XML Parser configuration
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

// Shared CSS (minified)
const SHARED_CSS = `*{box-sizing:border-box;margin:0;padding:0}
html{font-family:system-ui,-apple-system,sans-serif;font-size:18px;line-height:1.5}
body{max-width:600px;margin:0 auto;padding:1rem;background:#fff;color:#111}
h1{font-size:1.5rem;margin-bottom:.5rem;color:#dc2626}
.subtitle{color:#666;margin-bottom:1.5rem;font-size:.9rem}
nav{display:flex;gap:.5rem;margin-bottom:1.5rem;flex-wrap:wrap}
nav a{padding:.5rem 1rem;background:#f5f5f5;border-radius:.5rem;text-decoration:none;color:#111;font-size:.9rem}
nav a:hover,nav a:focus{background:#e5e5e5}
nav a.active{background:#dc2626;color:#fff}
.emergency{display:block;padding:1rem;margin-bottom:.75rem;background:#fef2f2;border-left:4px solid #dc2626;text-decoration:none;color:inherit;border-radius:0 .5rem .5rem 0}
.emergency:hover,.emergency:focus{background:#fee2e2}
.emergency strong{display:block;font-size:1.1rem;color:#111}
.emergency .phone{font-size:1.4rem;color:#dc2626;font-weight:700;letter-spacing:.05em}
.emergency .note{font-size:.8rem;color:#666;margin-top:.25rem}
.primary{background:#dc2626;border-color:#991b1b}
.primary,.primary strong,.primary .phone{color:#fff}
.primary .note{color:#fecaca}
.primary:hover,.primary:focus{background:#b91c1c}
section{margin-bottom:2rem}
h2{font-size:1rem;color:#666;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.05em}
h3{font-size:1.1rem;margin:1rem 0 .5rem;color:#111}
p{margin-bottom:.75rem}
ul,ol{margin-bottom:.75rem;padding-left:1.5rem}
li{margin-bottom:.25rem}
.alert{padding:1rem;margin-bottom:.75rem;border-left:4px solid #666;border-radius:0 .5rem .5rem 0;background:#f5f5f5}
.alert-yellow{border-color:#eab308;background:#fefce8}
.alert-orange{border-color:#f97316;background:#fff7ed}
.alert-red{border-color:#dc2626;background:#fef2f2}
.alert-title{font-weight:700;margin-bottom:.25rem}
.alert-meta{font-size:.8rem;color:#666}
.seismo{padding:.75rem;margin-bottom:.5rem;background:#f5f5f5;border-radius:.5rem}
.seismo-mag{font-size:1.2rem;font-weight:700;color:#dc2626}
.guide-card{display:block;padding:1rem;margin-bottom:.75rem;background:#f5f5f5;border-radius:.5rem;text-decoration:none;color:inherit}
.guide-card:hover,.guide-card:focus{background:#e5e5e5}
.guide-card strong{color:#dc2626}
.update-time{font-size:.8rem;color:#666;margin-bottom:1rem}
.source-link{font-size:.8rem;color:#666}
.source-link a{color:#dc2626}
.section-nav{display:flex;gap:.5rem;margin-bottom:1.5rem;flex-wrap:wrap}
.section-nav a{padding:.4rem .8rem;background:#f5f5f5;border-radius:.5rem;text-decoration:none;color:#666;font-size:.85rem}
.section-nav a:hover,.section-nav a:focus{background:#e5e5e5;color:#111}
footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #e5e5e5;font-size:.8rem;color:#666;text-align:center}
footer a{color:#666;text-decoration:none}
footer a:hover{text-decoration:underline}
.back-link{display:inline-block;margin-bottom:1rem;color:#dc2626;text-decoration:none;font-size:.9rem}
.back-link:hover{text-decoration:underline}
.step{counter-increment:step;padding-left:2rem;position:relative;margin-bottom:1rem}
.step::before{content:counter(step);position:absolute;left:0;width:1.5rem;height:1.5rem;background:#dc2626;color:#fff;border-radius:50%;text-align:center;font-size:.8rem;line-height:1.5rem}
.warning-box{padding:1rem;background:#fef2f2;border:1px solid #dc2626;border-radius:.5rem;margin-bottom:1rem}
.warning-box strong{color:#dc2626}
@media(prefers-color-scheme:dark){
body{background:#111;color:#f5f5f5}
h1{color:#f87171}
h3{color:#f5f5f5}
.subtitle,h2,.emergency .note,.alert-meta,.update-time,.source-link,footer{color:#a3a3a3}
nav a{background:#1f1f1f;color:#f5f5f5}
nav a:hover,nav a:focus{background:#292929}
nav a.active{background:#dc2626;color:#fff}
.emergency{background:#1f1f1f;border-color:#f87171}
.emergency:hover,.emergency:focus{background:#292929}
.emergency strong{color:#f5f5f5}
.emergency .phone{color:#f87171}
.primary{background:#dc2626;border-color:#dc2626}
.primary,.primary strong,.primary .phone{color:#fff}
.primary .note{color:#fecaca}
.primary:hover,.primary:focus{background:#b91c1c}
.alert{background:#1f1f1f}
.alert-yellow{border-color:#eab308;background:#1c1a00}
.alert-orange{border-color:#f97316;background:#1f1000}
.alert-red{border-color:#dc2626;background:#1f0f0f}
.seismo,.guide-card{background:#1f1f1f}
.guide-card:hover,.guide-card:focus{background:#292929}
.guide-card strong{color:#f87171}
.back-link{color:#f87171}
.warning-box{background:#1f0f0f;border-color:#f87171}
.warning-box strong{color:#f87171}
footer{border-color:#333}
footer a,.source-link a{color:#a3a3a3}
.section-nav a{background:#1f1f1f;color:#a3a3a3}
.section-nav a:hover,.section-nav a:focus{background:#292929;color:#f5f5f5}
}
@media print{
nav,.back-link,.section-nav{display:none}
body{max-width:100%;font-size:12pt}
.alert,.seismo,.guide-card,.emergency{break-inside:avoid}
}`;

// Navigation HTML
function getNav(activePage) {
  return `<nav>
  <a href="/"${activePage === 'index' ? ' class="active"' : ''}>Teléfonos</a>
  <a href="/alertas"${activePage === 'alertas' ? ' class="active"' : ''}>Alertas</a>
  <a href="/comunidades"${activePage === 'comunidades' ? ' class="active"' : ''}>Comunidades</a>
  <a href="/guias/"${activePage === 'guias' ? ' class="active"' : ''}>Guías</a>
</nav>`;
}

// HTML head template
function getHead(title, description, path = '/') {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#dc2626">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://emergencias.live${path}">
  <link rel="canonical" href="https://emergencias.live${path}">
  <style>${SHARED_CSS}</style>
</head>`;
}

// Footer template
function getFooter() {
  return `<footer>
  <p><a href="https://github.com/cscazorla/emergencias.live">GitHub</a></p>
</footer>`;
}

// Fetch RSS feed with timeout and error handling
async function fetchFeed(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'emergencias.live/2.0 (alertas meteorologicas)'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

// Parse AEMET CAP alerts
function parseAemetAlerts(xml) {
  if (!xml) return [];

  try {
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item;
    if (!items) return [];

    const alerts = Array.isArray(items) ? items : [items];
    const now = Date.now();
    const threeDaysAgo = now - (72 * 60 * 60 * 1000);

    const parsedAlerts = alerts.map(item => {
      // Parse severity from title or description
      let severity = 'yellow';
      const title = item.title || '';
      const description = item.description || '';

      if (title.toLowerCase().includes('rojo') || title.toLowerCase().includes('extremo')) {
        severity = 'red';
      } else if (title.toLowerCase().includes('naranja') || title.toLowerCase().includes('importante')) {
        severity = 'orange';
      }

      return {
        title: title,
        description: description.replace(/<[^>]*>/g, ''),
        severity,
        link: item.link || '',
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date()
      };
    })
    .filter(alert => alert.title && alert.pubDate.getTime() > threeDaysAgo)
    .sort((a, b) => {
      // Sort by severity first (red > orange > yellow), then by date
      const severityOrder = { red: 0, orange: 1, yellow: 2 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.pubDate.getTime() - a.pubDate.getTime();
    });

    // Limit to 30 alerts maximum (prioritizing by severity)
    return parsedAlerts.slice(0, 30);
  } catch (error) {
    console.error('Error parsing AEMET RSS:', error.message);
    return [];
  }
}

// Parse IGN earthquake feed (GeoRSS)
function parseIgnEarthquakes(xml) {
  if (!xml) return [];

  try {
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item;
    if (!items) return [];

    const quakes = Array.isArray(items) ? items : [items];
    const now = Date.now();
    const twoDaysAgo = now - (48 * 60 * 60 * 1000);

    return quakes
      .map(item => {
        const title = item.title || '';
        // Extract magnitude from title (format: "Magnitud X.X - Location")
        const magMatch = title.match(/(\d+\.?\d*)/);
        const magnitude = magMatch ? parseFloat(magMatch[1]) : 0;

        const description = item.description || '';
        const link = item.link || '';
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

        // Extract coordinates if available
        const lat = item['geo:lat'] || item['georss:point']?.split(' ')[0] || '';
        const lon = item['geo:long'] || item['georss:point']?.split(' ')[1] || '';

        return {
          title,
          description: description.replace(/<[^>]*>/g, ''),
          magnitude,
          lat,
          lon,
          link,
          pubDate
        };
      })
      .filter(quake => {
        // Filter: magnitude >= 2.0 and within last 48h
        return quake.magnitude >= 2.0 && quake.pubDate.getTime() > twoDaysAgo;
      })
      .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
      .slice(0, 20); // Limit to 20 most recent
  } catch (error) {
    console.error('Error parsing IGN RSS:', error.message);
    return [];
  }
}

// Parse DGT DATEX2 traffic incidents
function parseDgtIncidents(xml) {
  if (!xml) return [];

  try {
    const data = parser.parse(xml);
    const situations = data?.['d2:payload']?.['sit:situation'];
    if (!situations) return [];

    const sitList = Array.isArray(situations) ? situations : [situations];
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    const incidents = [];

    for (const sit of sitList) {
      const severity = sit['sit:overallSeverity'];
      // Only include high and highest severity incidents
      if (severity !== 'high' && severity !== 'highest') continue;

      const record = sit['sit:situationRecord'];
      if (!record) continue;

      // Handle both single record and array of records
      const records = Array.isArray(record) ? record : [record];

      for (const rec of records) {
        const creationTime = rec['sit:situationRecordCreationTime'];
        const recordDate = creationTime ? new Date(creationTime) : null;

        // Skip old incidents (> 7 days)
        if (recordDate && recordDate.getTime() < sevenDaysAgo) continue;

        // Get cause type
        const cause = rec['sit:cause'];
        const causeType = cause?.['sit:causeType'] || 'unknown';
        const detailedCause = cause?.['sit:detailedCauseType'];

        // Get location info
        const locationRef = rec['sit:locationReference'];
        const suppDesc = locationRef?.['loc:supplementaryPositionalDescription'];
        const roadName = suppDesc?.['loc:roadInformation']?.['loc:roadName'] || '';

        // Get province/municipality from tpeg location
        const tpegLoc = locationRef?.['loc:tpegLinearLocation'];
        const fromPoint = tpegLoc?.['loc:from'];
        const extPoint = fromPoint?.['loc:_tpegNonJunctionPointExtension']?.['loc:extendedTpegNonJunctionPoint'];

        const province = extPoint?.['lse:province'] || '';
        const municipality = extPoint?.['lse:municipality'] || '';
        const autonomy = extPoint?.['lse:autonomousCommunity'] || '';

        // Translate cause types to Spanish
        let causeText = 'Incidencia';
        if (causeType === 'accident') causeText = 'Accidente';
        else if (causeType === 'roadMaintenance') causeText = 'Obras';
        else if (causeType === 'obstruction') causeText = 'Obstrucción';
        else if (causeType === 'vehicleObstruction') causeText = 'Vehículo en calzada';
        else if (causeType === 'environmentalObstruction') causeText = 'Obstáculo ambiental';
        else if (causeType === 'infrastructureDamageObstruction') causeText = 'Daños en infraestructura';
        else if (causeType === 'poorRoadInfrastructure') causeText = 'Mal estado de vía';
        else if (causeType === 'abnormalTraffic') causeText = 'Tráfico anormal';
        else if (causeType === 'poorEnvironment') causeText = 'Condiciones adversas';
        else if (causeType === 'poorEnvironmentConditions') causeText = 'Condiciones adversas';

        // Get more specific cause if available
        if (detailedCause) {
          if (detailedCause['sit:roadMaintenanceType'] === 'roadClosed') causeText = 'Carretera cortada';
          else if (detailedCause['sit:obstructionType'] === 'shed load') causeText = 'Carga derramada';
          else if (detailedCause['sit:accidentType']) causeText = 'Accidente';
        }

        // Build title
        let title = causeText;
        if (roadName) title += ` en ${roadName}`;
        if (municipality && province) title += ` - ${municipality} (${province})`;
        else if (province) title += ` - ${province}`;

        incidents.push({
          title,
          severity: severity === 'highest' ? 'red' : 'orange',
          province,
          municipality,
          road: roadName,
          causeType,
          date: recordDate || new Date()
        });
      }
    }

    // Sort by date (most recent first) and limit
    return incidents
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 15);

  } catch (error) {
    console.error('Error parsing DGT DATEX2:', error.message);
    return [];
  }
}

// Format relative time
function formatRelativeTime(date) {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 60) {
    return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else if (hours < 24) {
    return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(hours / 24);
    return `hace ${days} día${days !== 1 ? 's' : ''}`;
  }
}

// Generate alerts.html
function generateAlertasHtml(alerts, earthquakes, trafficIncidents, buildTime) {
  const alertsHtml = alerts.length > 0
    ? alerts.map(alert => `
      <div class="alert alert-${alert.severity}">
        <div class="alert-title">${escapeHtml(alert.title)}</div>
        <p>${escapeHtml(alert.description)}</p>
        <div class="alert-meta">${formatRelativeTime(alert.pubDate)}</div>
      </div>`).join('')
    : '<p>No hay alertas meteorológicas activas en este momento.</p>';

  const earthquakesHtml = earthquakes.length > 0
    ? earthquakes.map(quake => `
      <div class="seismo">
        <span class="seismo-mag">M${quake.magnitude.toFixed(1)}</span>
        ${escapeHtml(quake.title.replace(/^\d+\.?\d*\s*-?\s*/, ''))}
        <div class="alert-meta">${formatRelativeTime(quake.pubDate)}</div>
      </div>`).join('')
    : '<p>No hay terremotos significativos en las últimas 48 horas.</p>';

  const trafficHtml = trafficIncidents.length > 0
    ? trafficIncidents.map(incident => `
      <div class="alert alert-${incident.severity}">
        <div class="alert-title">${escapeHtml(incident.title)}</div>
        <div class="alert-meta">${formatRelativeTime(incident.date)}</div>
      </div>`).join('')
    : '<p>No hay incidencias graves de tráfico en este momento.</p>';

  return `${getHead('Alertas - Emergencias en España', 'Alertas meteorológicas y sísmicas en tiempo real para España. Información de AEMET e IGN.', '/alertas')}
<body>
  ${getNav('alertas')}
  <header>
    <h1>Alertas en España</h1>
    <p class="update-time">Última actualización: ${buildTime.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
  </header>

  <nav class="section-nav">
    <a href="#meteorologia">Meteorología</a>
    <a href="#sismica">Sísmica</a>
    <a href="#trafico">Tráfico</a>
  </nav>

  <main>
    <section id="meteorologia">
      <h2>Alertas Meteorológicas</h2>
      ${alertsHtml}
      <p class="source-link">Fuente: <a href="https://www.aemet.es/es/eltiempo/prediccion/avisos" target="_blank" rel="noopener">AEMET</a></p>
    </section>

    <section id="sismica">
      <h2>Actividad Sísmica (últimas 48h)</h2>
      ${earthquakesHtml}
      <p class="source-link">Fuente: <a href="https://www.ign.es/web/ign/portal/ultimos-terremotos/-/ultimos-terremotos/get10teleproc" target="_blank" rel="noopener">Instituto Geográfico Nacional</a></p>
    </section>

    <section id="trafico">
      <h2>Incidencias de Tráfico (severidad alta)</h2>
      ${trafficHtml}
      <a href="https://etraffic.dgt.es/etrafficWEB/" target="_blank" rel="noopener" class="guide-card">
        <strong>Ver mapa de tráfico completo</strong>
        <p>Todas las incidencias, obras y retenciones</p>
      </a>
      <p class="source-link">Fuente: <a href="https://nap.dgt.es" target="_blank" rel="noopener">DGT - Punto de Acceso Nacional</a></p>
    </section>
  </main>

  ${getFooter()}
</body>
</html>`;
}

// Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Copy and update index.html with navigation
function generateIndexHtml() {
  return `${getHead('Emergencias en España - Teléfonos de emergencia', 'Todos los teléfonos de emergencia de España: 112, policía, bomberos, ambulancia, violencia de género, toxicología y más. Llamada directa con un toque.', '/')}
<body>
  ${getNav('index')}
  <header>
    <h1>Emergencias en España</h1>
    <p class="subtitle">Toca un número para llamar directamente</p>
  </header>

  <main>
    <section>
      <a href="tel:112" class="emergency primary">
        <strong>Emergencias generales</strong>
        <span class="phone">112</span>
        <span class="note">Policía, bomberos, ambulancia - Disponible 24h</span>
      </a>
    </section>

    <section>
      <h2>Seguridad</h2>
      <a href="tel:091" class="emergency">
        <strong>Policía Nacional</strong>
        <span class="phone">091</span>
        <span class="note">Zonas urbanas</span>
      </a>
      <a href="tel:062" class="emergency">
        <strong>Guardia Civil</strong>
        <span class="phone">062</span>
        <span class="note">Zonas rurales</span>
      </a>
      <a href="tel:080" class="emergency">
        <strong>Bomberos</strong>
        <span class="phone">080</span>
        <span class="note">Incendios, rescates</span>
      </a>
      <a href="tel:900202202" class="emergency">
        <strong>Salvamento Marítimo</strong>
        <span class="phone">900 202 202</span>
        <span class="note">Emergencias en el mar</span>
      </a>
    </section>

    <section>
      <h2>Salud</h2>
      <a href="tel:915620420" class="emergency">
        <strong>Información Toxicológica</strong>
        <span class="phone">91 562 04 20</span>
        <span class="note">Intoxicaciones y envenenamientos</span>
      </a>
    </section>

    <section>
      <h2>Apoyo y protección</h2>
      <a href="tel:016" class="emergency">
        <strong>Violencia de género</strong>
        <span class="phone">016</span>
        <span class="note">No deja rastro en la factura telefónica</span>
      </a>
      <a href="tel:116111" class="emergency">
        <strong>ANAR - Ayuda a menores</strong>
        <span class="phone">116 111</span>
        <span class="note">Atención a niños y adolescentes</span>
      </a>
      <a href="tel:717003717" class="emergency">
        <strong>Teléfono de la Esperanza</strong>
        <span class="phone">717 003 717</span>
        <span class="note">Crisis emocional y prevención del suicidio</span>
      </a>
    </section>
  </main>

  ${getFooter()}
</body>
</html>`;
}

// Generate guides index
function generateGuiasIndexHtml() {
  const guides = [
    { slug: 'terremotos', title: 'Terremotos', desc: 'Qué hacer antes, durante y después de un terremoto' },
    { slug: 'tornados', title: 'Tornados', desc: 'Cómo protegerte de tornados y trombas de agua' },
    { slug: 'inundaciones', title: 'Inundaciones', desc: 'Actuación ante crecidas e inundaciones' },
    { slug: 'incendios', title: 'Incendios', desc: 'Evacuación y seguridad ante incendios' },
    { slug: 'accidentes-trafico', title: 'Accidentes de tráfico', desc: 'Protocolo PAS y primeros auxilios en carretera' },
    { slug: 'fugas-gas', title: 'Fugas de gas', desc: 'Detectar y actuar ante escapes de gas' },
    { slug: 'apagones', title: 'Apagones', desc: 'Preparación y seguridad durante cortes de luz' },
    { slug: 'golpe-calor', title: 'Golpe de calor', desc: 'Prevenir y tratar el golpe de calor' },
    { slug: 'hipotermia', title: 'Hipotermia', desc: 'Reconocer y tratar la hipotermia' }
  ];

  const guidesHtml = guides.map(g => `
    <a href="/guias/${g.slug}" class="guide-card">
      <strong>${g.title}</strong>
      <p>${g.desc}</p>
    </a>`).join('');

  return `${getHead('Guías de Emergencia - Emergencias en España', 'Guías prácticas para saber cómo actuar en diferentes situaciones de emergencia. Terremotos, inundaciones, incendios y más.', '/guias/')}
<body>
  ${getNav('guias')}
  <header>
    <h1>Guías de Emergencia</h1>
    <p class="subtitle">Aprende qué hacer en cada situación</p>
  </header>

  <main>
    ${guidesHtml}
  </main>

  ${getFooter()}
</body>
</html>`;
}

// Generate comunidades page
function generateComunidadesHtml() {
  const comunidades = [
    {
      name: 'Andalucía',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Emergencias Sanitarias', number: '061', note: '' },
        { name: 'Salud Responde', number: '955 54 50 60', note: 'Cita previa, información sanitaria' },
        { name: 'Información Junta', number: '012', note: '' }
      ]
    },
    {
      name: 'Aragón',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Urgencias Sanitarias', number: '061', note: '' },
        { name: 'Información Gobierno', number: '012', note: '' }
      ]
    },
    {
      name: 'Asturias',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Urgencias Sanitarias', number: '061', note: '' },
        { name: 'Información Principado', number: '012', note: '' }
      ]
    },
    {
      name: 'Baleares',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'SAMU 061', number: '061', note: "Servei d'Atenció Mèdica Urgent" },
        { name: 'IB-Salut', number: '971 21 98 00', note: '' },
        { name: 'Información Govern', number: '012', note: '' }
      ]
    },
    {
      name: 'Canarias',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Urgencias Canarias', number: '061', note: '' },
        { name: 'Información Gobierno', number: '012', note: '' }
      ]
    },
    {
      name: 'Cantabria',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Emergencias Sanitarias', number: '061', note: '' },
        { name: 'Información Gobierno', number: '012', note: '' }
      ]
    },
    {
      name: 'Castilla-La Mancha',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'SESCAM Urgencias', number: '061', note: '' },
        { name: 'Información Junta', number: '012', note: '' }
      ]
    },
    {
      name: 'Castilla y León',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Emergencias Sanitarias', number: '061', note: '' },
        { name: 'Información Junta', number: '012', note: '' }
      ]
    },
    {
      name: 'Cataluña',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Emergències Mèdiques (SEM)', number: '061', note: '' },
        { name: "Mossos d'Esquadra", number: '088', note: 'Policía autonómica' },
        { name: 'CatSalut', number: '061', note: 'Sanitat Respon' },
        { name: 'Información Generalitat', number: '012', note: '' }
      ]
    },
    {
      name: 'Ceuta',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Urgencias INGESA', number: '956 52 82 00', note: '' }
      ]
    },
    {
      name: 'Comunidad Valenciana',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Emergencias Sanitarias', number: '061', note: '' },
        { name: 'Sanitat Respon', number: '900 16 11 61', note: 'Información sanitaria' },
        { name: 'Información GVA', number: '012', note: '' }
      ]
    },
    {
      name: 'Extremadura',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Emergencias Sanitarias', number: '061', note: '' },
        { name: 'Información Junta', number: '012', note: '' }
      ]
    },
    {
      name: 'Galicia',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Urxencias Sanitarias', number: '061', note: '' },
        { name: 'Saúde en liña', number: '881 54 02 02', note: 'Información sanitaria' },
        { name: 'Información Xunta', number: '012', note: '' }
      ]
    },
    {
      name: 'La Rioja',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Urgencias Sanitarias', number: '061', note: '' },
        { name: 'Información Gobierno', number: '012', note: '' }
      ]
    },
    {
      name: 'Madrid',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'SUMMA 112', number: '061', note: 'Urgencias extrahospitalarias' },
        { name: 'Salud Madrid', number: '900 102 112', note: 'Cita previa, información' },
        { name: 'Información Comunidad', number: '012', note: '' }
      ]
    },
    {
      name: 'Melilla',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Urgencias INGESA', number: '952 67 00 00', note: '' }
      ]
    },
    {
      name: 'Murcia',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Emergencias Sanitarias 061', number: '061', note: '' },
        { name: 'Información CARM', number: '012', note: '' }
      ]
    },
    {
      name: 'Navarra',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'SOS Navarra', number: '112', note: '' },
        { name: 'Policía Foral', number: '948 01 20 12', note: 'No urgencias' },
        { name: 'Osasunbidea', number: '948 29 00 00', note: 'Servicio Navarro de Salud' },
        { name: 'Información Gobierno', number: '012', note: '' }
      ]
    },
    {
      name: 'País Vasco',
      phones: [
        { name: 'Emergencias', number: '112', note: '' },
        { name: 'Emergencias Osakidetza', number: '061', note: '' },
        { name: 'Ertzaintza', number: '112', note: 'Policía autonómica' },
        { name: 'Ertzaintza (no urgencias)', number: '900 10 35 84', note: '' },
        { name: 'Información Gobierno', number: '012', note: '' }
      ]
    }
  ];

  const comunidadesHtml = comunidades.map(c => `
    <section>
      <h2>${c.name}</h2>
      ${c.phones.map(p => `
      <a href="tel:${p.number.replace(/\s/g, '')}" class="emergency">
        <strong>${p.name}</strong>
        <span class="phone">${p.number}</span>
        ${p.note ? `<span class="note">${p.note}</span>` : ''}
      </a>`).join('')}
    </section>`).join('');

  return `${getHead('Teléfonos por Comunidad Autónoma - Emergencias en España', 'Teléfonos de emergencia específicos de cada comunidad autónoma: 061, policías autonómicas, información sanitaria y más.', '/comunidades')}
<body>
  ${getNav('comunidades')}
  <header>
    <h1>Teléfonos por Comunidad</h1>
    <p class="subtitle">Servicios específicos de cada autonomía</p>
  </header>

  <main>
    <div class="warning-box">
      <strong>112</strong> es el número único de emergencias válido en toda España y Europa. Úsalo siempre en caso de emergencia.
    </div>

    ${comunidadesHtml}
  </main>

  ${getFooter()}
</body>
</html>`;
}

// Guide template
function generateGuideHtml(guide) {
  return `${getHead(`${guide.title} - Guías de Emergencia`, guide.description, `/guias/${guide.slug}`)}
<body>
  <a href="/guias/" class="back-link">← Volver a guías</a>

  <header>
    <h1>${guide.title}</h1>
  </header>

  <main>
    ${guide.content}
  </main>

  <section>
    <h2>¿Cuándo llamar al 112?</h2>
    ${guide.when112}
    <a href="tel:112" class="emergency primary">
      <strong>Llamar al 112</strong>
      <span class="phone">112</span>
    </a>
  </section>

  ${getFooter()}
</body>
</html>`;
}

// Guide content
const GUIDES = [
  {
    slug: 'terremotos',
    title: 'Terremotos',
    description: 'Guía de actuación ante terremotos: qué hacer antes, durante y después de un seísmo.',
    content: `
    <section>
      <h2>Acciones inmediatas</h2>
      <div class="warning-box">
        <strong>Si estás en interior:</strong> Agáchate, cúbrete bajo una mesa resistente y agárrate.
      </div>
      <div class="warning-box">
        <strong>Si estás en exterior:</strong> Aléjate de edificios, cables eléctricos y árboles.
      </div>
    </section>

    <section>
      <h2>Durante el terremoto</h2>
      <ol>
        <li><strong>No corras ni uses ascensores</strong></li>
        <li>Aléjate de ventanas, espejos y muebles que puedan caer</li>
        <li>Si estás en la cama, quédate ahí y cúbrete la cabeza con la almohada</li>
        <li>Si estás conduciendo, para en un lugar seguro lejos de puentes y edificios</li>
        <li>Espera a que termine el temblor antes de moverte</li>
      </ol>
    </section>

    <section>
      <h2>Después del terremoto</h2>
      <ol>
        <li>Comprueba si hay heridos y presta primeros auxilios</li>
        <li>Inspecciona tu vivienda por daños estructurales antes de entrar</li>
        <li>No enciendas llamas ni interruptores si hueles a gas</li>
        <li>Prepárate para réplicas</li>
        <li>Escucha la radio para información oficial</li>
        <li>Si estás cerca de la costa, aléjate por riesgo de tsunami</li>
      </ol>
    </section>

    <section>
      <h2>Preparación previa</h2>
      <ul>
        <li>Identifica lugares seguros en cada habitación</li>
        <li>Ten un kit de emergencia con agua, comida, linterna y radio</li>
        <li>Aprende a cerrar las llaves de gas, agua y electricidad</li>
        <li>Fija muebles pesados a la pared</li>
      </ul>
    </section>`,
    when112: '<p>Llama si hay personas atrapadas, heridos graves, fugas de gas, daños estructurales importantes o necesitas evacuación.</p>'
  },
  {
    slug: 'tornados',
    title: 'Tornados',
    description: 'Cómo protegerte de tornados y trombas de agua. Señales de alerta y lugares seguros.',
    content: `
    <section>
      <h2>Señales de alerta</h2>
      <ul>
        <li>Cielo oscuro con tinte verdoso</li>
        <li>Granizo grande</li>
        <li>Rugido fuerte similar a un tren de carga</li>
        <li>Nube en forma de embudo</li>
        <li>Calma repentina después de una tormenta</li>
      </ul>
    </section>

    <section>
      <h2>Acciones inmediatas</h2>
      <div class="warning-box">
        <strong>Busca refugio inmediatamente</strong> en el lugar más bajo y interior del edificio.
      </div>
    </section>

    <section>
      <h2>Dónde refugiarse</h2>
      <ol>
        <li><strong>Mejor opción:</strong> Sótano o refugio antitornados</li>
        <li>Habitación interior sin ventanas en la planta más baja</li>
        <li>Bajo las escaleras o en un armario interior</li>
        <li>Cúbrete con colchones o mantas gruesas</li>
        <li><strong>Nunca:</strong> Vehículos, casas móviles o bajo puentes</li>
      </ol>
    </section>

    <section>
      <h2>Si estás al aire libre</h2>
      <ol>
        <li>Busca un edificio sólido cercano</li>
        <li>Si no hay refugio, túmbate en una zanja o depresión del terreno</li>
        <li>Cúbrete la cabeza con los brazos</li>
        <li>Aléjate de árboles, coches y objetos que puedan volar</li>
      </ol>
    </section>

    <section>
      <h2>Después del tornado</h2>
      <ul>
        <li>Ten cuidado con escombros y cables caídos</li>
        <li>No entres en edificios dañados</li>
        <li>Ayuda a vecinos heridos si puedes hacerlo de forma segura</li>
      </ul>
    </section>`,
    when112: '<p>Llama si hay personas atrapadas, heridos, cables eléctricos caídos o fugas de gas.</p>'
  },
  {
    slug: 'inundaciones',
    title: 'Inundaciones',
    description: 'Qué hacer antes, durante y después de una inundación. Evacuación y seguridad.',
    content: `
    <section>
      <h2>Si hay alerta de inundación</h2>
      <ol>
        <li>Sigue las instrucciones de las autoridades</li>
        <li>Mueve objetos de valor a zonas altas</li>
        <li>Desconecta electricidad y gas si hay riesgo de inundación en casa</li>
        <li>Prepara un kit de emergencia</li>
        <li>Carga el móvil y ten una radio con pilas</li>
      </ol>
    </section>

    <section>
      <h2>Durante la inundación</h2>
      <div class="warning-box">
        <strong>Nunca camines ni conduzcas por agua en movimiento.</strong> 15 cm de agua pueden derribarte; 60 cm pueden arrastrar un coche.
      </div>
      <ol>
        <li>Evacúa si te lo ordenan las autoridades</li>
        <li>Si no puedes evacuar, sube a la planta más alta</li>
        <li>Aléjate de sótanos y zonas bajas</li>
        <li>No toques equipos eléctricos si estás mojado</li>
        <li>Evita puentes sobre aguas rápidas</li>
      </ol>
    </section>

    <section>
      <h2>Si quedas atrapado en el coche</h2>
      <ol>
        <li>Si el coche se para, sal inmediatamente y busca terreno alto</li>
        <li>Si el agua sube dentro del coche, abre la ventana o rompe el cristal</li>
        <li>No intentes abrir la puerta hasta que la presión se iguale</li>
      </ol>
    </section>

    <section>
      <h2>Después de la inundación</h2>
      <ul>
        <li>No vuelvas a casa hasta que las autoridades lo permitan</li>
        <li>El agua de inundación está contaminada, evita el contacto</li>
        <li>No consumas alimentos que hayan estado en contacto con el agua</li>
        <li>Limpia y desinfecta todo lo que se haya mojado</li>
        <li>Documenta los daños con fotos para el seguro</li>
      </ul>
    </section>`,
    when112: '<p>Llama si hay personas atrapadas por el agua, heridos, o necesitas rescate o evacuación urgente.</p>'
  },
  {
    slug: 'incendios',
    title: 'Incendios',
    description: 'Evacuación segura y actuación ante incendios en viviendas y edificios.',
    content: `
    <section>
      <h2>Si hay un incendio</h2>
      <div class="warning-box">
        <strong>Sal inmediatamente.</strong> No pierdas tiempo recogiendo pertenencias.
      </div>
    </section>

    <section>
      <h2>Evacuación</h2>
      <ol>
        <li>Alerta a todos los ocupantes gritando "¡Fuego!"</li>
        <li>Toca las puertas antes de abrirlas; si están calientes, no las abras</li>
        <li>Agáchate y avanza a gatas si hay humo (el aire limpio está abajo)</li>
        <li>Usa las escaleras, nunca el ascensor</li>
        <li>Cierra las puertas tras de ti para frenar el fuego</li>
        <li>Reúnete en el punto de encuentro acordado</li>
      </ol>
    </section>

    <section>
      <h2>Si no puedes salir</h2>
      <ol>
        <li>Cierra la puerta y tapa las rendijas con trapos húmedos</li>
        <li>Ve a una ventana y haz señales para que te vean</li>
        <li>Llama al 112 e indica tu ubicación exacta</li>
        <li>No saltes excepto como último recurso</li>
      </ol>
    </section>

    <section>
      <h2>Si se te prende la ropa</h2>
      <ol>
        <li><strong>Para:</strong> No corras</li>
        <li><strong>Tírate:</strong> Al suelo</li>
        <li><strong>Rueda:</strong> Para apagar las llamas</li>
        <li>Cúbrete la cara con las manos</li>
      </ol>
    </section>

    <section>
      <h2>Uso del extintor</h2>
      <ul>
        <li>Solo si el fuego es pequeño y tienes vía de escape</li>
        <li><strong>P</strong>ull - Tira de la anilla</li>
        <li><strong>A</strong>im - Apunta a la base del fuego</li>
        <li><strong>S</strong>queeze - Aprieta la palanca</li>
        <li><strong>S</strong>weep - Barre de lado a lado</li>
      </ul>
    </section>`,
    when112: '<p>Llama siempre ante un incendio, aunque parezca pequeño. Indica si hay personas atrapadas y tu ubicación exacta.</p>'
  },
  {
    slug: 'fugas-gas',
    title: 'Fugas de gas',
    description: 'Cómo detectar y actuar de forma segura ante una fuga de gas.',
    content: `
    <section>
      <h2>Señales de fuga de gas</h2>
      <ul>
        <li>Olor a huevos podridos o azufre (el gas natural tiene un odorizante)</li>
        <li>Sonido de silbido o soplido cerca de tuberías</li>
        <li>Plantas muertas sin explicación</li>
        <li>Burbujas en agua estancada</li>
        <li>Llama piloto que se apaga constantemente</li>
      </ul>
    </section>

    <section>
      <h2>Acciones inmediatas</h2>
      <div class="warning-box">
        <strong>No enciendas ni apagues nada eléctrico.</strong> Ni luces, ni móviles, ni electrodomésticos.
      </div>
      <ol>
        <li>Abre puertas y ventanas para ventilar</li>
        <li>Cierra la llave de paso del gas si es seguro hacerlo</li>
        <li>No uses el teléfono dentro de la vivienda</li>
        <li>Sal del edificio caminando, sin correr</li>
        <li>Llama al 112 desde fuera</li>
      </ol>
    </section>

    <section>
      <h2>Lo que NO debes hacer</h2>
      <ul>
        <li>Encender o apagar interruptores de luz</li>
        <li>Usar el timbre</li>
        <li>Enchufar o desenchufar aparatos</li>
        <li>Usar el teléfono dentro del edificio</li>
        <li>Encender cerillas, mecheros o velas</li>
        <li>Fumar</li>
      </ul>
    </section>

    <section>
      <h2>Prevención</h2>
      <ul>
        <li>Revisa periódicamente las instalaciones de gas</li>
        <li>Instala detectores de gas</li>
        <li>Ventila las áreas donde hay aparatos de gas</li>
        <li>Conoce la ubicación de la llave de paso general</li>
      </ul>
    </section>`,
    when112: '<p>Llama siempre ante sospecha de fuga de gas, especialmente si el olor es fuerte o hay mareos.</p>'
  },
  {
    slug: 'apagones',
    title: 'Apagones',
    description: 'Preparación y seguridad durante cortes prolongados de electricidad.',
    content: `
    <section>
      <h2>Primeros pasos</h2>
      <ol>
        <li>Comprueba si el apagón es solo en tu casa o en la zona</li>
        <li>Si es solo en tu casa, revisa el cuadro eléctrico</li>
        <li>Desconecta aparatos electrónicos para evitar daños cuando vuelva la luz</li>
        <li>Deja una luz encendida para saber cuándo vuelve</li>
      </ol>
    </section>

    <section>
      <h2>Seguridad</h2>
      <div class="warning-box">
        <strong>Nunca uses generadores, barbacoas o estufas de camping dentro de casa.</strong> Riesgo de intoxicación por monóxido de carbono.
      </div>
      <ul>
        <li>Usa linternas en lugar de velas si es posible</li>
        <li>Si usas velas, nunca las dejes desatendidas</li>
        <li>Aléjate de cables caídos</li>
        <li>No abras el congelador innecesariamente</li>
      </ul>
    </section>

    <section>
      <h2>Conservación de alimentos</h2>
      <ul>
        <li>El congelador mantiene los alimentos unas 48h si está lleno y no se abre</li>
        <li>El frigorífico mantiene los alimentos unas 4h</li>
        <li>Consume primero los alimentos perecederos</li>
        <li>En caso de duda, tíralo</li>
      </ul>
    </section>

    <section>
      <h2>Personas vulnerables</h2>
      <ul>
        <li>Comprueba el estado de vecinos mayores o con necesidades especiales</li>
        <li>Si dependes de equipos médicos eléctricos, ten un plan de respaldo</li>
        <li>En temperaturas extremas, considera ir a un centro de acogida</li>
      </ul>
    </section>

    <section>
      <h2>Kit de emergencia recomendado</h2>
      <ul>
        <li>Linternas y pilas de repuesto</li>
        <li>Radio a pilas</li>
        <li>Cargador portátil para móvil</li>
        <li>Agua embotellada</li>
        <li>Alimentos no perecederos</li>
        <li>Medicamentos necesarios</li>
      </ul>
    </section>`,
    when112: '<p>Llama si hay personas atrapadas en ascensores, emergencias médicas por falta de equipos eléctricos, o cables caídos.</p>'
  },
  {
    slug: 'golpe-calor',
    title: 'Golpe de calor',
    description: 'Reconocer y tratar el golpe de calor. Prevención en olas de calor.',
    content: `
    <section>
      <h2>Señales de alerta</h2>
      <div class="warning-box">
        <strong>El golpe de calor es una emergencia médica.</strong> Puede ser mortal si no se trata rápidamente.
      </div>
      <ul>
        <li>Temperatura corporal muy alta (más de 39.5°C)</li>
        <li>Piel roja, caliente y SECA (no sudorosa)</li>
        <li>Pulso rápido y fuerte</li>
        <li>Dolor de cabeza intenso</li>
        <li>Mareos, náuseas, confusión</li>
        <li>Pérdida de consciencia</li>
      </ul>
    </section>

    <section>
      <h2>Acciones inmediatas</h2>
      <ol>
        <li>Llama al 112 inmediatamente</li>
        <li>Lleva a la persona a la sombra o lugar fresco</li>
        <li>Enfría el cuerpo como puedas:
          <ul>
            <li>Aplica paños húmedos fríos</li>
            <li>Rocía con agua fría</li>
            <li>Abanica mientras mojas la piel</li>
            <li>Coloca hielo en axilas, ingles y cuello</li>
          </ul>
        </li>
        <li>NO des de beber si está inconsciente</li>
      </ol>
    </section>

    <section>
      <h2>Diferencia con agotamiento por calor</h2>
      <p>El agotamiento por calor es menos grave pero puede evolucionar a golpe de calor:</p>
      <ul>
        <li>Sudoración intensa</li>
        <li>Debilidad, náuseas</li>
        <li>Piel fría y pálida</li>
        <li>Pulso débil</li>
      </ul>
      <p>Tratamiento: Descanso en lugar fresco, beber agua, paños frescos.</p>
    </section>

    <section>
      <h2>Prevención</h2>
      <ul>
        <li>Evita la exposición al sol en las horas centrales (12-17h)</li>
        <li>Bebe agua frecuentemente, aunque no tengas sed</li>
        <li>Usa ropa ligera, de colores claros</li>
        <li>Nunca dejes personas ni animales en coches cerrados</li>
        <li>Limita el ejercicio físico en días de calor extremo</li>
        <li>Pon especial atención a niños, mayores y enfermos crónicos</li>
      </ul>
    </section>`,
    when112: '<p>Llama inmediatamente si hay confusión, piel muy caliente y seca, o pérdida de consciencia. El golpe de calor es una emergencia.</p>'
  },
  {
    slug: 'hipotermia',
    title: 'Hipotermia',
    description: 'Reconocer y tratar la hipotermia. Actuación en exposición al frío.',
    content: `
    <section>
      <h2>Señales de hipotermia</h2>
      <div class="warning-box">
        <strong>La hipotermia puede ser mortal.</strong> Es una emergencia médica cuando es severa.
      </div>

      <h3>Hipotermia leve (35-32°C)</h3>
      <ul>
        <li>Temblores intensos</li>
        <li>Manos torpes, dificultad para moverse</li>
        <li>Piel fría y pálida</li>
      </ul>

      <h3>Hipotermia moderada-severa (menos de 32°C)</h3>
      <ul>
        <li>Temblores que desaparecen</li>
        <li>Confusión, habla arrastrada</li>
        <li>Somnolencia extrema</li>
        <li>Pérdida de consciencia</li>
      </ul>
    </section>

    <section>
      <h2>Acciones inmediatas</h2>
      <ol>
        <li>Llama al 112 si la hipotermia es moderada o severa</li>
        <li>Lleva a la persona a un lugar cálido y seco</li>
        <li>Retira la ropa mojada</li>
        <li>Cubre con mantas, especialmente cabeza y cuello</li>
        <li>Si está consciente, dale bebidas calientes (no alcohol)</li>
        <li>Aplica calor gradual: botellas de agua tibia en axilas y torso</li>
      </ol>
    </section>

    <section>
      <h2>Lo que NO debes hacer</h2>
      <ul>
        <li>No frotes ni masajees las extremidades</li>
        <li>No uses calor directo (radiadores, agua muy caliente)</li>
        <li>No des alcohol</li>
        <li>No muevas bruscamente a la persona</li>
        <li>No pongas en agua caliente</li>
      </ul>
    </section>

    <section>
      <h2>Prevención</h2>
      <ul>
        <li>Viste en capas con tejidos que aíslen</li>
        <li>Mantén seca la ropa</li>
        <li>Cubre cabeza, manos y pies</li>
        <li>Come suficiente y mantente hidratado</li>
        <li>Evita el alcohol y el tabaco en el frío</li>
        <li>No te quedes quieto si tienes frío, muévete</li>
      </ul>
    </section>

    <section>
      <h2>Grupos de riesgo</h2>
      <ul>
        <li>Personas mayores</li>
        <li>Bebés y niños pequeños</li>
        <li>Personas sin hogar</li>
        <li>Personas bajo efectos del alcohol</li>
        <li>Personas con enfermedades crónicas</li>
      </ul>
    </section>`,
    when112: '<p>Llama si la persona deja de temblar, está confusa, somnolienta o inconsciente, o si sospechas hipotermia severa.</p>'
  },
  {
    slug: 'accidentes-trafico',
    title: 'Accidentes de tráfico',
    description: 'Protocolo PAS (Proteger, Avisar, Socorrer) y primeros auxilios en accidentes de carretera.',
    content: `
    <section>
      <h2>Protocolo PAS</h2>
      <div class="warning-box">
        <strong>PAS = Proteger, Avisar, Socorrer.</strong> Sigue siempre este orden para no convertirte en otra víctima.
      </div>
    </section>

    <section>
      <h2>1. PROTEGER</h2>
      <ol>
        <li>Estaciona tu vehículo en lugar seguro, fuera de la calzada si es posible</li>
        <li>Enciende las luces de emergencia</li>
        <li>Ponte el chaleco reflectante ANTES de salir del coche</li>
        <li>Coloca los triángulos de emergencia:
          <ul>
            <li>A 50 metros por delante y por detrás del accidente</li>
            <li>En autopista/autovía: solo por detrás, a 100 metros</li>
            <li>Camina siempre por el arcén, de cara al tráfico</li>
          </ul>
        </li>
        <li>Si hay riesgo de incendio o atropello, apaga el motor de los vehículos implicados</li>
      </ol>
    </section>

    <section>
      <h2>2. AVISAR</h2>
      <ol>
        <li>Llama al <strong>112</strong></li>
        <li>Indica con claridad:
          <ul>
            <li>Ubicación exacta (kilómetro, carretera, dirección)</li>
            <li>Número de vehículos implicados</li>
            <li>Número aproximado de heridos</li>
            <li>Si hay personas atrapadas</li>
            <li>Si hay riesgo de incendio o mercancías peligrosas</li>
          </ul>
        </li>
        <li>No cuelgues hasta que te lo indiquen</li>
      </ol>
    </section>

    <section>
      <h2>3. SOCORRER</h2>
      <div class="warning-box">
        <strong>No muevas a los heridos</strong> salvo que haya peligro inminente (fuego, ahogamiento). Mover a alguien con lesión de columna puede causar parálisis.
      </div>
      <ol>
        <li>Comprueba si los heridos están conscientes (háblales, tócales el hombro)</li>
        <li>Si están conscientes, tranquilízalos y evita que se muevan</li>
        <li>Si no respiran y sabes RCP, inicia las maniobras</li>
        <li>Controla hemorragias graves presionando con un paño limpio</li>
        <li>NO quites el casco a un motorista salvo que no respire</li>
        <li>Cubre a los heridos para evitar hipotermia</li>
      </ol>
    </section>

    <section>
      <h2>Lo que NO debes hacer</h2>
      <ul>
        <li>Mover a los heridos (salvo peligro inminente)</li>
        <li>Darles de beber o comer</li>
        <li>Quitar el casco a un motorista que respira</li>
        <li>Hacer torniquetes (solo en amputaciones con hemorragia mortal)</li>
        <li>Dejar solo a un herido grave</li>
        <li>Circular por la calzada sin chaleco reflectante</li>
      </ul>
    </section>

    <section>
      <h2>Si estás implicado en el accidente</h2>
      <ol>
        <li>Para el vehículo y enciende las luces de emergencia</li>
        <li>Comprueba si tú y tus acompañantes estáis bien</li>
        <li>Sal del vehículo por el lado más seguro (arcén)</li>
        <li>Nunca te des a la fuga, es delito</li>
        <li>Intercambia datos con el otro conductor:
          <ul>
            <li>Nombre y DNI</li>
            <li>Matrícula y marca del vehículo</li>
            <li>Compañía de seguros y número de póliza</li>
          </ul>
        </li>
        <li>Haz fotos de los daños y la posición de los vehículos</li>
        <li>Rellena el parte amistoso si no hay heridos</li>
      </ol>
    </section>

    <section>
      <h2>Kit obligatorio en el coche</h2>
      <ul>
        <li>2 triángulos de emergencia</li>
        <li>Chaleco reflectante homologado</li>
        <li>Rueda de repuesto o kit antipinchazos</li>
        <li>Recomendado: guantes, linterna, manta térmica</li>
      </ul>
    </section>`,
    when112: '<p>Llama siempre que haya un accidente con heridos, personas atrapadas, vehículos que obstaculizan la vía, o cualquier situación de peligro.</p>'
  }
];

// Copy static files (sitemap is generated separately)
function copyStaticFiles() {
  const staticFiles = ['robots.txt'];

  for (const file of staticFiles) {
    const src = path.join(__dirname, '..', file);
    const dest = path.join(DIST_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }
}

// Generate sitemap
function generateSitemap() {
  const baseUrl = 'https://emergencias.live';
  const pages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/alertas', priority: '0.9', changefreq: 'hourly' },
    { loc: '/comunidades', priority: '0.8', changefreq: 'monthly' },
    { loc: '/guias/', priority: '0.8', changefreq: 'monthly' },
    ...GUIDES.map(g => ({ loc: `/guias/${g.slug}`, priority: '0.7', changefreq: 'monthly' }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml);
}

// Main build function
async function build() {
  console.log('Building emergencias.live v2...\n');

  // Create dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }
  fs.mkdirSync(DIST_DIR);
  fs.mkdirSync(path.join(DIST_DIR, 'guias'));

  const buildTime = new Date();

  // Fetch feeds in parallel
  console.log('Fetching data feeds...');
  const [aemetXml, ignXml, dgtXml] = await Promise.all([
    fetchFeed(AEMET_RSS),
    fetchFeed(IGN_RSS),
    fetchFeed(DGT_DATEX2)
  ]);

  // Parse feeds
  const alerts = parseAemetAlerts(aemetXml);
  const earthquakes = parseIgnEarthquakes(ignXml);
  const trafficIncidents = parseDgtIncidents(dgtXml);

  console.log(`  - AEMET alerts: ${alerts.length}`);
  console.log(`  - IGN earthquakes: ${earthquakes.length}`);
  console.log(`  - DGT traffic incidents: ${trafficIncidents.length}`);

  // Generate pages
  console.log('\nGenerating pages...');

  // Index
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), generateIndexHtml());
  console.log('  - index.html');

  // Alertas
  fs.writeFileSync(path.join(DIST_DIR, 'alertas.html'), generateAlertasHtml(alerts, earthquakes, trafficIncidents, buildTime));
  console.log('  - alertas.html');

  // Comunidades
  fs.writeFileSync(path.join(DIST_DIR, 'comunidades.html'), generateComunidadesHtml());
  console.log('  - comunidades.html');

  // Guias index
  fs.writeFileSync(path.join(DIST_DIR, 'guias', 'index.html'), generateGuiasIndexHtml());
  console.log('  - guias/index.html');

  // Individual guides
  for (const guide of GUIDES) {
    fs.writeFileSync(path.join(DIST_DIR, 'guias', `${guide.slug}.html`), generateGuideHtml(guide));
    console.log(`  - guias/${guide.slug}.html`);
  }

  // Generate sitemap
  generateSitemap();
  console.log('  - sitemap.xml');

  // Copy static files
  copyStaticFiles();
  console.log('  - robots.txt');

  // Calculate sizes
  console.log('\nFile sizes:');
  const files = [
    'index.html',
    'alertas.html',
    'comunidades.html',
    'guias/index.html',
    ...GUIDES.map(g => `guias/${g.slug}.html`)
  ];

  let totalSize = 0;
  for (const file of files) {
    const filePath = path.join(DIST_DIR, file);
    const stat = fs.statSync(filePath);
    const sizeKb = (stat.size / 1024).toFixed(1);
    totalSize += stat.size;
    console.log(`  - ${file}: ${sizeKb}KB`);
  }

  console.log(`\nTotal size: ${(totalSize / 1024).toFixed(1)}KB`);
  console.log(`\nBuild complete at ${buildTime.toISOString()}`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
