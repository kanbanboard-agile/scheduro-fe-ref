// Debug script to test token functionality
// Run this in browser // console to debug token issues

// // console.log("=== TOKEN DEBUG SCRIPT ===");

// Function to get cookie (same as cookieUtils.js)
function getCookie(name) {
  if (typeof window === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const cookie = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));

  if (cookie) {
    const value = cookie.split('=')[1];
    return value ? decodeURIComponent(value).trim() : null;
  }

  return null;
}

// Function to set test token
function setTestToken(token = 'test-jwt-token-123456789') {
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  //   // console.log("✅ Test token set:", token.substring(0, 20) + "...");
}

// Function to test token retrieval
function testTokenRetrieval() {
  //   // console.log("\n--- TOKEN RETRIEVAL TEST ---");

  // Test native cookie retrieval
  const nativeToken = getCookie('token');
  // console.log("Native cookie token:", nativeToken ? nativeToken.substring(0, 20) + "..." : "❌ NOT FOUND");

  // Test js-cookie retrieval (if available)
  if (typeof Cookies !== 'undefined') {
    const jsCookieToken = Cookies.get('token')?.trim();
    // console.log("js-cookie token:", jsCookieToken ? jsCookieToken.substring(0, 20) + "..." : "❌ NOT FOUND");
  }

  // Show all cookies
  // console.log("All cookies:", document.cookie);

  return nativeToken;
}

// Function to test webhook call
async function testWebhookCall() {
  // console.log("\n--- WEBHOOK TEST ---");

  const token = getCookie('token');
  if (!token) {
    // console.error("❌ No token found. Setting test token...");
    setTestToken();
    return;
  }

  const payload = {
    description: 'Test task generation for debugging',
    section: 'Development',
    steps: 3,
    workspaceId: '1',
    token: token,
  };

  const webhookUrl = 'https://n8n-9hlhd9ec.sumopod.biz.id/webhook/76de89dc-4784-49c0-904d-85ecd554a035';

  // console.log("Sending request to:", webhookUrl);
  // console.log("Payload:", {
  //     ...payload,
  //     token: token.substring(0, 20) + "..."
  //   });

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'X-Workspace-ID': '1',
        'X-Request-Source': 'debug-script',
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      cache: 'no-cache',
    });

    // console.log("Response status:", response.status);
    // console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      // console.log("✅ Success! Response:", result);
    } else {
      const errorText = await response.text();
      // console.error("❌ Error response:", errorText);
    }
  } catch (error) {
    // console.error("❌ Network error:", error);
  }
}

// Function to test API call
async function testApiCall() {
  // console.log("\n--- API CALL TEST ---");

  const baseUrl = window.location.origin; // Use current origin
  const token = getCookie('token');

  if (!token) {
    // console.error("❌ No token found for API test");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/test`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // console.log("API Response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      // console.log("✅ API Success:", result);
    } else {
      const errorText = await response.text();
      // console.log("API Error:", errorText);
    }
  } catch (error) {
    // console.error("❌ API Network error:", error);
  }
}

// Run all tests
async function runAllTests() {
  // console.log("🚀 Starting comprehensive token debug...\n");

  // Test 1: Token retrieval
  const token = testTokenRetrieval();

  // Test 2: Set token if not found
  if (!token) {
    setTestToken();
    testTokenRetrieval();
  }

  // Test 3: Webhook call
  await testWebhookCall();

  // Test 4: API call
  await testApiCall();

  // console.log("\n🏁 Debug tests completed!");
}

// Auto-run on script load
if (typeof window !== 'undefined') {
  // console.log("Debug script loaded. Run 'runAllTests()' to start debugging.");

  // Expose functions globally for manual testing
  window.debugToken = {
    runAllTests,
    testTokenRetrieval,
    testWebhookCall,
    testApiCall,
    setTestToken,
    getCookie,
  };
}
