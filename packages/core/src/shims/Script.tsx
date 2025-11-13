/**
 * Framework-agnostic Script component
 * Automatically detects Next.js environment and falls back to native <script> tag
 */
import React, { useEffect, useRef, ScriptHTMLAttributes } from 'react';

export interface ScriptProps extends ScriptHTMLAttributes<HTMLScriptElement> {
  src?: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
  onLoad?: () => void;
  onReady?: () => void;
  onError?: () => void;
  children?: string;
}

let NextScript: any = null;
let isNextAvailable = false;

// Try to import Next.js Script if available
if (typeof window === 'undefined') {
  try {
    NextScript = require('next/script').default;
    isNextAvailable = true;
  } catch (e) {
    // Next.js not available
  }
} else {
  try {
    NextScript = require('next/script').default;
    isNextAvailable = true;
  } catch (e) {
    // Next.js not available
  }
}

/**
 * Universal Script component that works with or without Next.js
 */
export const Script: React.FC<ScriptProps> = ({
  src,
  strategy = 'afterInteractive',
  onLoad,
  onReady,
  onError,
  children,
  ...props
}) => {
  const scriptRef = useRef<HTMLScriptElement>(null);

  // If Next.js is available, use Next Script
  if (isNextAvailable && NextScript) {
    return (
      <NextScript
        src={src}
        strategy={strategy}
        onLoad={onLoad}
        onReady={onReady}
        onError={onError}
        {...props}
      >
        {children}
      </NextScript>
    );
  }

  // Fallback to native script tag with strategy handling
  useEffect(() => {
    if (!src && !children) return;

    const script = document.createElement('script');
    
    if (src) {
      script.src = src;
    }
    
    if (children) {
      script.textContent = children;
    }

    // Apply attributes
    Object.entries(props).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        script.setAttribute(key, String(value));
      }
    });

    // Handle loading strategy
    if (strategy === 'beforeInteractive') {
      // Load immediately
      document.head.appendChild(script);
    } else if (strategy === 'afterInteractive') {
      // Load after interactive
      if (document.readyState === 'complete') {
        document.body.appendChild(script);
      } else {
        window.addEventListener('load', () => {
          document.body.appendChild(script);
        });
      }
    } else if (strategy === 'lazyOnload') {
      // Load on idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          document.body.appendChild(script);
        });
      } else {
        setTimeout(() => {
          document.body.appendChild(script);
        }, 1);
      }
    }

    // Handle callbacks
    if (onLoad) {
      script.addEventListener('load', onLoad);
    }
    if (onError) {
      script.addEventListener('error', onError);
    }
    if (onReady) {
      script.addEventListener('load', onReady);
    }

    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [src, children, strategy, onLoad, onReady, onError]);

  return null;
};

Script.displayName = 'Script';

export default Script;
