import Svg, { Path, Circle } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
  body: string;
  fin: string;
}

/** The most common reef fish silhouette, ported from Snorkeling Dive.dc.html. */
export function LongFish({ width, height, body, fin }: Props) {
  return (
    <Svg width={width} height={height ?? width * (41 / 70)} viewBox="0 0 120 70">
      <Path d="M28 35 Q60 6 98 35 Q60 64 28 35 Z" fill={body} />
      <Path d="M28 35 L4 15 L13 35 L4 55 Z" fill={fin} />
      <Path d="M62 12 Q76 5 86 17 L64 22 Z" fill={fin} />
      <Circle cx={86} cy={30} r={3.6} fill="#082033" />
      <Circle cx={87} cy={29} r={1.2} fill="#fff" />
    </Svg>
  );
}
