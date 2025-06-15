import React from 'react'

type LogoComponentProps = {
  style?: React.CSSProperties;
  imageUrl?: string;
  outerStyle?: React.CSSProperties;
};

export default function LogoComponent({style, imageUrl, outerStyle}: LogoComponentProps) {
  // If imageUrl is empty, use a placeholder or return null for the image
  const imgSrc = imageUrl && imageUrl.trim() !== '' ? imageUrl : null;
  
  return (
    <div style={{ 
      ...outerStyle, 
      width: '100%', 
      maxWidth: '100%', 
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50px'
    }}>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Logo"
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
      ) : (
        <div style={{
          padding: '10px',
          border: '1px dashed #ccc',
          borderRadius: '4px',
          color: '#888',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          Logo Placeholder
        </div>
      )}
    </div>
  );
}
