import React from 'react'

type TextComponentProps = {
  style?: React.CSSProperties;
  textarea: React.ReactNode;
};

export default function TextComponent({ style, textarea }: TextComponentProps) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
      minWidth: 0,
      ...style,
    }}>
      <h2 style={{ margin: 0 }}>{textarea}</h2>
    </div>
  );
}
