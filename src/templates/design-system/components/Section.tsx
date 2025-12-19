/**
 * Section Component
 * 
 * Generic section wrapper for notes, payment info, and other content.
 */

import React from 'react';
import { spacing } from '../tokens';

export interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  ariaLabel?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = 'invoice-section',
  style,
  titleStyle,
  contentStyle,
  ariaLabel,
}) => {
  return (
    <section
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {title && (
        <h3
          style={{
            fontSize: spacing.base,
            textTransform: 'uppercase',
            marginBottom: spacing.md,
            ...titleStyle,
          }}
        >
          {title}
        </h3>
      )}
      <div
        style={{
          fontSize: 'clamp(11px, 2.5vw, 18px)',
          lineHeight: 1.6,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </section>
  );
};

