/**
 * Framework-agnostic Image component
 * Automatically detects Next.js environment and falls back to native <img> tag
 */
import React, { forwardRef, ImgHTMLAttributes, CSSProperties } from 'react';

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading'> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  loader?: (props: { src: string; width: number; quality?: number }) => string;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  unoptimized?: boolean;
  onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
  layout?: string;
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: CSSProperties['objectPosition'];
  lazyBoundary?: string;
  lazyRoot?: string;
  sizes?: string;
}

let NextImage: any = null;
let isNextAvailable = false;

// Try to import Next.js Image if available
if (typeof window === 'undefined') {
  try {
    NextImage = require('next/image').default;
    isNextAvailable = true;
  } catch (e) {
    // Next.js not available
  }
} else {
  try {
    NextImage = require('next/image').default;
    isNextAvailable = true;
  } catch (e) {
    // Next.js not available
  }
}

/**
 * Universal Image component that works with or without Next.js
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      fill,
      loader,
      quality,
      priority,
      loading = 'lazy',
      placeholder,
      blurDataURL,
      unoptimized,
      onLoadingComplete,
      objectFit,
      objectPosition,
      sizes,
      style,
      ...props
    },
    ref
  ) => {
    // If Next.js is available, use Next Image
    if (isNextAvailable && NextImage) {
      return (
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          loader={loader}
          quality={quality}
          priority={priority}
          loading={loading}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          unoptimized={unoptimized}
          onLoadingComplete={onLoadingComplete}
          sizes={sizes}
          style={{
            objectFit,
            objectPosition,
            ...style,
          }}
          ref={ref}
          {...props}
        />
      );
    }

    // Fallback to native img tag
    const imgStyle: CSSProperties = {
      objectFit,
      objectPosition,
      ...style,
    };

    if (fill) {
      imgStyle.position = 'absolute';
      imgStyle.inset = '0px';
      imgStyle.width = '100%';
      imgStyle.height = '100%';
    }

    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        style={imgStyle}
        ref={ref}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;
