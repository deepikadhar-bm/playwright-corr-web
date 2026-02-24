import { Page, APIRequestContext } from '@playwright/test';

export async function apiGet(request: APIRequestContext, url: string, headers?: Record<string, string>) {
  const response = await request.get(url, { headers });
  return response.json();
}

export async function apiPost(request: APIRequestContext, url: string, data: unknown, headers?: Record<string, string>) {
  const response = await request.post(url, { data, headers });
  return response.json();
}

/**
 * Get Encompass OAuth2 token using client credentials.
 */
export async function getEncompassToken(
  request: import('@playwright/test').APIRequestContext,
  clientId: string,
  clientSecret: string,
  instanceId: string
): Promise<string> {
  try {
    const response = await request.post('https://api.elliemae.com/oauth2/v1/token', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&scope=lp`,
    });
    if (response.ok()) {
      const json = await response.json();
      return json.access_token || '';
    }
    console.warn('[api-helpers] getEncompassToken failed:', response.status());
    return '';
  } catch (e) {
    console.warn('[api-helpers] getEncompassToken error:', e);
    return '';
  }
}

/**
 * Create a loan via Encompass API.
 */
export async function createEncompassLoan(
  request: import('@playwright/test').APIRequestContext,
  token: string,
  loanData: Record<string, unknown>
): Promise<string> {
  try {
    const response = await request.post('https://api.elliemae.com/encompass/v1/loans', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(loanData),
    });
    if (response.ok()) {
      const location = response.headers()['location'] || '';
      // Extract loan ID from Location header: .../loans/{loanId}
      const match = location.match(/\/loans\/([a-zA-Z0-9-]+)/);
      return match ? match[1] : '';
    }
    console.warn('[api-helpers] createEncompassLoan failed:', response.status());
    return '';
  } catch (e) {
    console.warn('[api-helpers] createEncompassLoan error:', e);
    return '';
  }
}

/**
 * Get a loan via Encompass API.
 */
export async function getEncompassLoan(
  request: import('@playwright/test').APIRequestContext,
  token: string,
  loanId: string
): Promise<Record<string, unknown>> {
  try {
    const response = await request.get(`https://api.elliemae.com/encompass/v1/loans/${loanId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok()) {
      return await response.json();
    }
    return {};
  } catch (e) {
    return {};
  }
}
