type PublicEnv = {
  NEXT_PUBLIC_API_URL: string;
};

type ServerEnv = {
  NEXT_SERVICE_TOKEN: string;
};

function assertValue(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const publicEnv: PublicEnv = {
  NEXT_PUBLIC_API_URL: assertValue('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL),
};

let cachedServerEnv: ServerEnv | null = null;

export const env: Readonly<PublicEnv> = Object.freeze(publicEnv);

export function getServerEnv(): Readonly<ServerEnv> {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv can only be called on the server');
  }

  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  cachedServerEnv = {
    NEXT_SERVICE_TOKEN: assertValue('NEXT_SERVICE_TOKEN', process.env.NEXT_SERVICE_TOKEN),
  };

  return cachedServerEnv;
}

export function buildApiUrl(path: string, searchParams?: URLSearchParams | Record<string, unknown>): URL {
  const base = env.NEXT_PUBLIC_API_URL.endsWith('/')
    ? env.NEXT_PUBLIC_API_URL.slice(0, -1)
    : env.NEXT_PUBLIC_API_URL;

  let url: URL;
  try {
    url = new URL(path.startsWith('/') ? path : `/${path}`, base);
  } catch (error) {
    throw new Error(`Invalid NEXT_PUBLIC_API_URL "${base}" while building path "${path}"`);
  }

  if (searchParams) {
    const params = searchParams instanceof URLSearchParams ? searchParams : new URLSearchParams();
    if (!(searchParams instanceof URLSearchParams)) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        params.set(key, String(value));
      });
    }
    url.search = params.toString();
  }

  return url;
}
