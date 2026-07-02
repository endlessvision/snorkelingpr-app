import Svg, { G, Path } from "react-native-svg";

interface Props {
  size: number;
  color: string;
}

/** Five-branch fan coral with cross ticks, ported from the prototype. */
export function FanCoral({ size, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={5} fill="none" strokeLinecap="round">
        <Path d="M50 98 C50 62 34 52 26 20" />
        <Path d="M50 98 C50 62 44 48 38 14" />
        <Path d="M50 98 C50 60 52 46 52 10" />
        <Path d="M50 98 C50 62 58 48 66 16" />
        <Path d="M50 98 C50 62 68 52 76 24" />
      </G>
      <G stroke="rgba(255,255,255,0.5)" strokeWidth={3} fill="none" strokeLinecap="round">
        <Path d="M34 52 L30 40" />
        <Path d="M52 46 L52 32" />
        <Path d="M66 50 L72 38" />
      </G>
    </Svg>
  );
}
