/**
 * Framework-agnostic shims for Next.js components and hooks
 * These shims allow the library to work seamlessly in both Next.js and non-Next.js environments
 */

export { Link } from './Link';
export { Image } from './Image';
export { Script } from './Script';
export { usePathname, useSearchParams, useRouter, useParams } from './navigation';
export type { LinkProps } from './Link';
export type { ImageProps } from './Image';
export type { ScriptProps } from './Script';
export type { NextRouter, NavigationOptions, RouterPushOptions, RouterReplaceOptions } from './navigation';
