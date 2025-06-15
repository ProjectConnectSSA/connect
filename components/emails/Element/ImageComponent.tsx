import React from 'react'

type ImageComponentProps = {
  style?: React.CSSProperties;
  imageUrl: string;
  outerStyle?: React.CSSProperties;
};

export default function ImageComponent({style, imageUrl, outerStyle}: ImageComponentProps) {
  return (
    <div style={{ ...outerStyle, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <img
        src={imageUrl}
        alt='image'
        style={{
          display: 'block',
          width: style?.width || '100%',
          height: style?.height || 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: style?.objectFit || 'contain',
          ...style,
        }}
      />
    </div>
  );
}
