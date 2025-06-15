import React from 'react';

type SocialIcon = {
  icon: string;
  url?: string;
};

type SocialComponentProps = {
  style?: React.CSSProperties;
  socialIcons?: SocialIcon[];
  outerStyle?: React.CSSProperties;
  label?: string;
};

export default function SocialComponent({
  style,
  socialIcons = [],
  outerStyle,
  label,
}: SocialComponentProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        textAlign: 'center',
        ...outerStyle,
      }}
    >
      {label && (
        <div style={{ marginBottom: '8px', textAlign: 'center', width: '100%' }}>
          {label}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        width: '100%'
      }}>
        {socialIcons.map((icon, index) =>
          icon.icon ? (
            <a
              key={index}
              href={icon.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: style?.width || 40,
                height: style?.height || 40,
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                padding: 4,
                transition: 'transform 0.2s ease',
                textAlign: 'center',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={icon.icon}
                alt={`Social Icon ${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: 32,
                  maxHeight: 32,
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </a>
          ) : null
        )}
      </div>
    </div>
  );
}
