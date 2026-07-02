import Svg, { Circle, Path } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
  color?: string;
}

/** Seafloor anchor, ported from the prototype. */
export function Anchor({ width, height, color = "#9a6a4a" }: Props) {
  return (
    <Svg width={width} height={height ?? width * (100 / 80)} viewBox="0 0 80 100">
      <Circle cx={40} cy={14} r={7} stroke={color} strokeWidth={5} fill="none" />
      <Path d="M40 21 L40 82" stroke={color} strokeWidth={5} strokeLinecap="round" />
      <Path d="M24 32 L56 32" stroke={color} strokeWidth={5} strokeLinecap="round" />
      <Path d="M16 66 Q40 96 64 66" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
