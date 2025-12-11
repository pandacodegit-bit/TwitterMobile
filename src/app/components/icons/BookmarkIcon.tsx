import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color: string;
  size: number;
  filled?: boolean;
}

const BookmarkIcon = ({ color, size, filled = false }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    {filled ? (
      <Path
        d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"
        fill={color}
      />
    ) : (
      <Path
        d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"
        fill={color}
      />
    )}
  </Svg>
);

export default BookmarkIcon;
