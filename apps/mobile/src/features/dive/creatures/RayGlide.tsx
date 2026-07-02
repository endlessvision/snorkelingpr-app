import Svg, { Path, Circle } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
  body: string;
  fin: string;
}

/** Deep Blue flat glide-fish silhouette, ported from the prototype. */
export function RayGlide({ width, height, body, fin }: Props) {
  return (
    <Svg width={width} height={height ?? width * (56 / 168)} viewBox="0 0 168 56">
      <Path d="M22 28 Q92 6 156 28 Q92 50 22 28 Z" fill={body} />
      <Path d="M22 28 L3 14 L10 28 L3 42 Z" fill={fin} />
      <Circle cx={138} cy={25} r={3} fill="#082033" />
    </Svg>
  );
}
