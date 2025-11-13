/**
 * Framework-agnostic navigation hooks
 * Automatically detects Next.js environment and provides fallbacks
 */
import { useCallback, useMemo, useEffect, useState } from 'react';

// Type definitions
export interface NavigationOptions {
  scroll?: boolean;
}

export interface RouterPushOptions extends NavigationOptions {
  shallow?: boolean;
  locale?: string | false;
}

export interface RouterReplaceOptions extends RouterPushOptions {}

export interface NextRouter {
  pathname: string;
  query: Record<string, string | string[]>;
  asPath: string;
  push: (url: string, as?: string, options?: RouterPushOptions) => Promise<boolean>;
  replace: (url: string, as?: string, options?: RouterReplaceOptions) => Promise<boolean>;
  back: () => void;
  forward: () => void;
  prefetch: (url: string, asPath?: string, options?: { priority?: boolean }) => Promise<void>;
  refresh: () => void;
  isReady: boolean;
  isFallback: boolean;
  isPreview: boolean;
  locale?: string;
  locales?: string[];
  defaultLocale?: string;
  basePath: string;
  events: any;
}

let nextNavigation: any = null;
let nextRouter: any = null;
let isNextAvailable = false;

// Try to import Next.js navigation
try {
  nextNavigation = require('next/navigation');
  nextRouter = require('next/router');
  isNextAvailable = true;
} catch (e) {
  // Next.js not available
}

/**
 * Get current pathname - works with or without Next.js
 */
export function usePathname(): string {
  const [pathname, setPathname] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Use Next.js hook if available
  if (isNextAvailable && nextNavigation?.usePathname) {
    try {
      return nextNavigation.usePathname();
    } catch (e) {
      // Fall through to custom implementation
    }
  }

  return pathname;
}

/**
 * Get current search params - works with or without Next.js
 */
export function useSearchParams(): URLSearchParams {
  const [searchParams, setSearchParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteChange = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Use Next.js hook if available
  if (isNextAvailable && nextNavigation?.useSearchParams) {
    try {
      return nextNavigation.useSearchParams();
    } catch (e) {
      // Fall through to custom implementation
    }
  }

  return searchParams;
}

/**
 * Router for navigation - works with or without Next.js
 */
export function useRouter(): NextRouter {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useMemo(() => {
    const query: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      if (query[key]) {
        if (Array.isArray(query[key])) {
          (query[key] as string[]).push(value);
        } else {
          query[key] = [query[key] as string, value];
        }
      } else {
        query[key] = value;
      }
    });

    return {
      pathname,
      query,
      asPath: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/',
      push: async (url: string, _as?: string, options?: RouterPushOptions) => {
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', url);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        return true;
      },
      replace: async (url: string, _as?: string, options?: RouterReplaceOptions) => {
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', url);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        return true;
      },
      back: () => {
        if (typeof window !== 'undefined') {
          window.history.back();
        }
      },
      forward: () => {
        if (typeof window !== 'undefined') {
          window.history.forward();
        }
      },
      prefetch: async () => {},
      refresh: () => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      },
      isReady: true,
      isFallback: false,
      isPreview: false,
      basePath: '',
      events: {
        on: () => {},
        off: () => {},
        emit: () => {},
      },
    };
  }, [pathname, searchParams]);

  // Use Next.js hook if available
  if (isNextAvailable && nextNavigation?.useRouter) {
    try {
      return nextNavigation.useRouter();
    } catch (e) {
      // Fall through to custom implementation
    }
  }

  // Try legacy Next.js router
  if (isNextAvailable && nextRouter?.useRouter) {
    try {
      return nextRouter.useRouter();
    } catch (e) {
      // Fall through to custom implementation
    }
  }

  return router;
}

/**
 * Get route parameters - works with or without Next.js
 */
export function useParams(): Record<string, string | string[]> {
  const searchParams = useSearchParams();
  
  // Use Next.js hook if available
  if (isNextAvailable && nextNavigation?.useParams) {
    try {
      return nextNavigation.useParams();
    } catch (e) {
      // Fall through to custom implementation
    }
  }

  // Fallback to search params
  const params: Record<string, string | string[]> = {};
  searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });

  return params;
}

export default {
  usePathname,
  useSearchParams,
  useRouter,
  useParams,
};
