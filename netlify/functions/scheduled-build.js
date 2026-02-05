// Netlify Scheduled Function - Triggers a rebuild every 15 minutes
// This keeps alert data fresh from AEMET and IGN RSS feeds

export default async (req) => {
  // Get the build hook URL from environment variable
  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK;

  if (!buildHookUrl) {
    console.log('NETLIFY_BUILD_HOOK not configured, skipping scheduled rebuild');
    return new Response('Build hook not configured', { status: 200 });
  }

  try {
    const response = await fetch(buildHookUrl, {
      method: 'POST',
      body: JSON.stringify({ trigger: 'scheduled-rebuild' })
    });

    if (response.ok) {
      console.log('Build triggered successfully');
      return new Response('Build triggered', { status: 200 });
    } else {
      console.error('Failed to trigger build:', response.status);
      return new Response('Failed to trigger build', { status: 500 });
    }
  } catch (error) {
    console.error('Error triggering build:', error);
    return new Response('Error triggering build', { status: 500 });
  }
};

// Schedule: every 15 minutes
export const config = {
  schedule: "*/15 * * * *"
};
