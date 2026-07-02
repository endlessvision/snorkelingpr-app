import Svg, { Ellipse, Circle, Path } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
  color: string;
}

/** The sea turtle at the Reef Wall entrance, ported from Snorkeling Dive.dc.html. */
export function DiveTurtle({ width, height, color }: Props) {
  return (
    <Svg width={width} height={height ?? width * (97 / 112)} viewBox="0 0 120 104">
      <Ellipse cx={60} cy={60} rx={35} ry={28} fill={color} />
      <Path d="M60 34 L82 48 L74 74 L46 74 L38 48 Z" fill="rgba(255,255,255,0.25)" />
      <Circle cx={60} cy={22} r={11} fill={color} />
      <Ellipse cx={24} cy={44} rx={13} ry={7} transform="rotate(-38 24 44)" fill={color} />
      <Ellipse cx={96} cy={44} rx={13} ry={7} transform="rotate(38 96 44)" fill={color} />
      <Ellipse cx={30} cy={84} rx={11} ry={6} transform="rotate(38 30 84)" fill={color} />
      <Ellipse cx={90} cy={84} rx={11} ry={6} transform="rotate(-38 90 84)" fill={color} />
      <Circle cx={56} cy={20} r={1.7} fill="#06202f" />
      <Circle cx={64} cy={20} r={1.7} fill="#06202f" />
    </Svg>
  );
}
