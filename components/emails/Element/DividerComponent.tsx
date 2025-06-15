import React from 'react'

type DividerComponentProps = {
  style?: React.CSSProperties;
  outerStyle?: React.CSSProperties;
};

export default function DividerComponent({ style , outerStyle}: DividerComponentProps) {
  return (
    <div style={{ ...outerStyle, width: '100%' }}>
      <hr
        style={style}
      />
    </div>
  );
}
