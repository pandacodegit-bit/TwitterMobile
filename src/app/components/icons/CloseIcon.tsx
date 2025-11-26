import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color: string;
  size: number;
}

const CloseIcon = ({ color, size }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <Path
      d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
      fill={color}
      strokeWidth="4"
    />
  </Svg>
);

export default CloseIcon;
