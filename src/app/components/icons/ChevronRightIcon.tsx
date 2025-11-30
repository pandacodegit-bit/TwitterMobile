import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color: string;
  size: number;
}

const ChevronRightIcon = ({ color, size }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <Path
      d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
      fill={color}
    />
  </Svg>
);

export default ChevronRightIcon;
