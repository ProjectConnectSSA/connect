import React from 'react'

type ButtonComponentProps = {
  style?: React.CSSProperties;
  outerStyle?: React.CSSProperties;
  content: React.ReactNode;
  url: string;
  align?: 'left' | 'center' | 'right';
};

export default function ButtonComponent({ style, outerStyle, content, url, align = 'center' }: ButtonComponentProps) {
  let justifyContent: 'flex-start' | 'center' | 'flex-end' = 'center';
  if (align === 'left') justifyContent = 'flex-start';
  if (align === 'right') justifyContent = 'flex-end';

  // If width is set, use 100% up to parent maxWidth
  const buttonWidth = style?.width ? '100%' : 'auto';

  return (
    <div
      style={{
        display: 'flex',
        textAlign: align,
        justifyContent,
        width: '100%',
        maxWidth: '100%',
        ...outerStyle,
      }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: buttonWidth,
          maxWidth: '100%',
          display: 'block',
        }}
      >
        <button
          style={{
            boxSizing: 'border-box',
            width: buttonWidth,
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            ...style,
          }}
        >
          {content}
        </button>
      </a>
    </div>
  );
}
