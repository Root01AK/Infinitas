export async function strapiRequest(endpoint: string, options: any = {}) {
  const url = process.env.STRAPI_URL + endpoint;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    cache: "no-store",
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Strapi error ${res.status}: ${err}`);
  }

  return res.json();
}
