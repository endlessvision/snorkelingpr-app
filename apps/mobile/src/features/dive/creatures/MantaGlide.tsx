import Svg, { Path, Circle } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
  color: string;
}

/** Deep Blue manta-ray glide silhouette, ported from the prototype. */
export function MantaGlide({ width, height, color }: Props) {
  return (
    <Svg width={width} height={height ?? width * (96 / 176)} viewBox="0 0 176 96">
      <Path
        d="M88 16 Q166 44 138 64 Q108 70 88 66 Q68 70 38 64 Q10 44 88 16 Z"
        fill={color}
      />
      <Path d="M88 64 Q90 90 96 94" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Circle cx={78} cy={36} r={2.4} fill="#06202f" />
      <Circle cx={98} cy={36} r={2.4} fill="#06202f" />
    </Svg>
  );
}
