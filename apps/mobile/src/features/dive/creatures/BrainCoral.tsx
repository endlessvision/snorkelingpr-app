import Svg, { Circle, G, Path } from "react-native-svg";

interface Props {
  size: number;
  color: string;
}

/** Brain coral (circle body + wavy ridges), ported from the prototype. */
export function BrainCoral({ size, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={60} r={36} fill={color} />
      <G stroke="rgba(255,255,255,0.55)" strokeWidth={3.2} fill="none" strokeLinecap="round">
        <Path d="M22 56 q9 -11 18 0 t18 0 t18 0" />
        <Path d="M22 68 q9 -11 18 0 t18 0 t18 0" />
        <Path d="M26 80 q9 -10 16 0 t16 0" />
      </G>
    </Svg>
  );
}
