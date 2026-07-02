import Svg, { Ellipse, Rect } from "react-native-svg";

interface Props {
  size: number;
  color: string;
}

/** Three sea-rod capsules of increasing height, ported from the prototype. */
export function SeaRodCoral({ size, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x={26} y={42} width={15} height={56} rx={7.5} fill={color} />
      <Rect x={46} y={30} width={13} height={68} rx={6.5} fill={color} />
      <Rect x={64} y={50} width={11} height={48} rx={5.5} fill={color} />
      <Ellipse cx={33.5} cy={42} rx={7.5} ry={3.5} fill="rgba(255,255,255,0.4)" />
      <Ellipse cx={52.5} cy={30} rx={6.5} ry={3} fill="rgba(255,255,255,0.4)" />
      <Ellipse cx={69.5} cy={50} rx={5.5} ry={2.6} fill="rgba(255,255,255,0.4)" />
    </Svg>
  );
}
