import Svg, { Circle, Path } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
  body: string;
  fin: string;
}

/** The round-bodied reef fish silhouette, ported from Snorkeling Dive.dc.html. */
export function RoundFish({ width, height, body, fin }: Props) {
  return (
    <Svg width={width} height={height ?? width * (96 / 118)} viewBox="0 0 118 96">
      <Circle cx={60} cy={48} r={35} fill={body} />
      <Path d="M26 48 L3 26 L12 48 L3 70 Z" fill={fin} />
      <Path d="M50 13 Q62 6 74 16 L58 22 Z" fill={fin} />
      <Path d="M50 83 Q62 90 74 80 L58 74 Z" fill={fin} />
      <Circle cx={82} cy={43} r={3.8} fill="#082033" />
      <Circle cx={83} cy={42} r={1.3} fill="#fff" />
    </Svg>
  );
}
