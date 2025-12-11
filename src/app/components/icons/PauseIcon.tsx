import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface PauseIconProps {
  size?: number;
  color?: string;
}

const PauseIcon: React.FC<PauseIconProps> = ({ size = 24, color = '#fff' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="5" width="4" height="14" rx="1" fill={color} />
      <Rect x="14" y="5" width="4" height="14" rx="1" fill={color} />
    </Svg>
  );
};

export default PauseIcon;
