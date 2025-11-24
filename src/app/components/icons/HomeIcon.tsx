import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color: string;
  size: number;
  filled?: boolean;
}

const HomeIcon = ({ color, size, filled = false }: IconProps) => {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
        <Path
          d="M224,120v96a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a16,16,0,0,1,4.69-11.31l80-80a16,16,0,0,1,22.62,0l80,80A16,16,0,0,1,224,120Z"
          fill={color}
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Path
        d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H48V120l80-80,80,80Z"
        fill={color}
      />
    </Svg>
  );
};

export default HomeIcon;
