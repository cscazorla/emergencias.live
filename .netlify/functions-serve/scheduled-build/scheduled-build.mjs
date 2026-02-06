
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/functions/scheduled-build.mjs
var scheduled_build_default = async (req) => {
  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK;
  if (!buildHookUrl) {
    console.log("NETLIFY_BUILD_HOOK not configured, skipping scheduled rebuild");
    return new Response("Build hook not configured", { status: 200 });
  }
  try {
    const response = await fetch(buildHookUrl, {
      method: "POST",
      body: JSON.stringify({ trigger: "scheduled-rebuild" })
    });
    if (response.ok) {
      console.log("Build triggered successfully");
      return new Response("Build triggered", { status: 200 });
    } else {
      console.error("Failed to trigger build:", response.status);
      return new Response("Failed to trigger build", { status: 500 });
    }
  } catch (error) {
    console.error("Error triggering build:", error);
    return new Response("Error triggering build", { status: 500 });
  }
};
var config = {
  schedule: "*/15 * * * *"
};
export {
  config,
  scheduled_build_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvc2NoZWR1bGVkLWJ1aWxkLm1qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gTmV0bGlmeSBTY2hlZHVsZWQgRnVuY3Rpb24gLSBUcmlnZ2VycyBhIHJlYnVpbGQgZXZlcnkgMTUgbWludXRlc1xuLy8gVGhpcyBrZWVwcyBhbGVydCBkYXRhIGZyZXNoIGZyb20gQUVNRVQgYW5kIElHTiBSU1MgZmVlZHNcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHJlcSkgPT4ge1xuICAvLyBHZXQgdGhlIGJ1aWxkIGhvb2sgVVJMIGZyb20gZW52aXJvbm1lbnQgdmFyaWFibGVcbiAgY29uc3QgYnVpbGRIb29rVXJsID0gcHJvY2Vzcy5lbnYuTkVUTElGWV9CVUlMRF9IT09LO1xuXG4gIGlmICghYnVpbGRIb29rVXJsKSB7XG4gICAgY29uc29sZS5sb2coJ05FVExJRllfQlVJTERfSE9PSyBub3QgY29uZmlndXJlZCwgc2tpcHBpbmcgc2NoZWR1bGVkIHJlYnVpbGQnKTtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKCdCdWlsZCBob29rIG5vdCBjb25maWd1cmVkJywgeyBzdGF0dXM6IDIwMCB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChidWlsZEhvb2tVcmwsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0cmlnZ2VyOiAnc2NoZWR1bGVkLXJlYnVpbGQnIH0pXG4gICAgfSk7XG5cbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnNvbGUubG9nKCdCdWlsZCB0cmlnZ2VyZWQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKCdCdWlsZCB0cmlnZ2VyZWQnLCB7IHN0YXR1czogMjAwIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdHJpZ2dlciBidWlsZDonLCByZXNwb25zZS5zdGF0dXMpO1xuICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZSgnRmFpbGVkIHRvIHRyaWdnZXIgYnVpbGQnLCB7IHN0YXR1czogNTAwIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciB0cmlnZ2VyaW5nIGJ1aWxkOicsIGVycm9yKTtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKCdFcnJvciB0cmlnZ2VyaW5nIGJ1aWxkJywgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufTtcblxuLy8gU2NoZWR1bGU6IGV2ZXJ5IDE1IG1pbnV0ZXNcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIHNjaGVkdWxlOiBcIiovMTUgKiAqICogKlwiXG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUdBLElBQU8sMEJBQVEsT0FBTyxRQUFRO0FBRTVCLFFBQU0sZUFBZSxRQUFRLElBQUk7QUFFakMsTUFBSSxDQUFDLGNBQWM7QUFDakIsWUFBUSxJQUFJLCtEQUErRDtBQUMzRSxXQUFPLElBQUksU0FBUyw2QkFBNkIsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQ2xFO0FBRUEsTUFBSTtBQUNGLFVBQU0sV0FBVyxNQUFNLE1BQU0sY0FBYztBQUFBLE1BQ3pDLFFBQVE7QUFBQSxNQUNSLE1BQU0sS0FBSyxVQUFVLEVBQUUsU0FBUyxvQkFBb0IsQ0FBQztBQUFBLElBQ3ZELENBQUM7QUFFRCxRQUFJLFNBQVMsSUFBSTtBQUNmLGNBQVEsSUFBSSw4QkFBOEI7QUFDMUMsYUFBTyxJQUFJLFNBQVMsbUJBQW1CLEVBQUUsUUFBUSxJQUFJLENBQUM7QUFBQSxJQUN4RCxPQUFPO0FBQ0wsY0FBUSxNQUFNLDRCQUE0QixTQUFTLE1BQU07QUFDekQsYUFBTyxJQUFJLFNBQVMsMkJBQTJCLEVBQUUsUUFBUSxJQUFJLENBQUM7QUFBQSxJQUNoRTtBQUFBLEVBQ0YsU0FBUyxPQUFPO0FBQ2QsWUFBUSxNQUFNLDJCQUEyQixLQUFLO0FBQzlDLFdBQU8sSUFBSSxTQUFTLDBCQUEwQixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDL0Q7QUFDRjtBQUdPLElBQU0sU0FBUztBQUFBLEVBQ3BCLFVBQVU7QUFDWjsiLAogICJuYW1lcyI6IFtdCn0K
