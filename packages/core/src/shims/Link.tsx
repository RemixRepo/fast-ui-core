/**
 * Framework-agnostic Link component
 * Automatically detects Next.js environment and falls back to native <a> tag
 */
import React, { forwardRef, AnchorHTMLAttributes } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
  locale?: string | false;
}

let NextLink: any = null;
let isNextAvailable = false;

// Try to import Next.js Link if available
if (typeof window === 'undefined') {
  // Server-side: try to import Next.js
  try {
    NextLink = require('next/link').default;
    isNextAvailable = true;
  } catch (e) {
    // Next.js not available, will use fallback
  }
} else {
  // Client-side: check if Next.js is available
  try {
    NextLink = require('next/link').default;
    isNextAvailable = true;
  } catch (e) {
    // Next.js not available, will use fallback
  }
}

/**
 * Universal Link component that works with or without Next.js
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      children,
      prefetch,
      replace,
      scroll,
      shallow,
      passHref,
      legacyBehavior,
      locale,
      ...props
    },
    ref
  ) => {
    // If Next.js is available, use Next Link
    if (isNextAvailable && NextLink) {
      return (
        <NextLink
          href={href}
          prefetch={prefetch}
          replace={replace}
          scroll={scroll}
          shallow={shallow}
          passHref={passHref}
          legacyBehavior={legacyBehavior}
          locale={locale}
          ref={ref}
          {...props}
        >
          {children}
        </NextLink>
      );
    }

    // Fallback to native anchor tag
    return (
      <a href={href} ref={ref} {...props}>
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export default Link;
