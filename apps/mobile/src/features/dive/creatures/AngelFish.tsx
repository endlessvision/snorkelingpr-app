import Svg, { Path, Circle } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
  body: string;
  fin: string;
}

/** Reef-wall angelfish silhouette (curved dorsal spikes), ported from the prototype. */
export function AngelFish({ width, height, body, fin }: Props) {
  return (
    <Svg width={width} height={height ?? width * (112 / 120)} viewBox="0 0 120 112">
      <Path d="M40 56 Q64 14 92 40 Q101 56 92 72 Q64 98 40 56 Z" fill={body} />
      <Path d="M40 56 L13 30 L24 56 L13 82 Z" fill={fin} />
      <Path d="M86 30 Q106 20 110 40" stroke={fin} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M86 82 Q106 92 110 72" stroke={fin} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Circle cx={84} cy={47} r={3.8} fill="#082033" />
      <Circle cx={85} cy={46} r={1.3} fill="#fff" />
    </Svg>
  );
}
