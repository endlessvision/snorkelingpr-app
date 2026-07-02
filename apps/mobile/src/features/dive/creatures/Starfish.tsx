import Svg, { Circle, Path } from "react-native-svg";

interface Props {
  size: number;
  color?: string;
}

/** Seafloor starfish, ported from the prototype. */
export function Starfish({ size, color = "#ff8a3d" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d="M50 8 L61 38 L93 38 L67 58 L77 90 L50 70 L23 90 L33 58 L7 38 L39 38 Z"
        fill={color}
      />
      <Circle cx={50} cy={52} r={3} fill="rgba(255,255,255,0.5)" />
    </Svg>
  );
}
