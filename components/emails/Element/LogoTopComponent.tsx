import React from 'react'

type LogoTopComponentProps = {
  style?: React.CSSProperties;
  imageUrl: string;
  outerStyle?: React.CSSProperties;
};

export default function LogoTopComponent({ style, imageUrl, outerStyle }: LogoTopComponentProps) {
  return (
    <div style={{...outerStyle}}>
        <img src={imageUrl} alt="Logo" style={{...style}} />
    </div>
  )
}
