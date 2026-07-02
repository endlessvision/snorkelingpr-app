import Svg, { Path, Circle } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
  body: string;
  fin: string;
}

/** Reef-wall tang silhouette (single dorsal spike + tall tail), ported from the prototype. */
export function TangFish({ width, height, body, fin }: Props) {
  return (
    <Svg width={width} height={height ?? width * (84 / 134)} viewBox="0 0 134 84">
      <Path d="M34 42 Q76 5 110 34 Q118 42 110 50 Q76 79 34 42 Z" fill={body} />
      <Path d="M108 33 Q120 42 108 51 Z" fill={fin} />
      <Path d="M34 42 L7 18 L18 42 L7 66 Z" fill={fin} />
      <Path d="M60 10 Q78 4 90 16 L66 22 Z" fill={fin} />
      <Circle cx={96} cy={37} r={3.8} fill="#082033" />
      <Circle cx={97} cy={36} r={1.3} fill="#fff" />
    </Svg>
  );
}
