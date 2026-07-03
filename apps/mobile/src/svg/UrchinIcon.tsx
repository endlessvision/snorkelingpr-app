import Svg, { Circle, G, Path } from "react-native-svg";

interface Props {
  size?: number;
}

/** Ported from Coin Rush's urchin symbol in Snorkeling Dive.dc.html. */
export function UrchinIcon({ size = 34 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <G stroke="#12212b" strokeWidth={3} strokeLinecap="round">
        <Path d="M20 3 L20 37" />
        <Path d="M3 20 L37 20" />
        <Path d="M8 8 L32 32" />
        <Path d="M32 8 L8 32" />
      </G>
      <Circle cx={20} cy={20} r={10} fill="#22333f" />
      <Circle cx={16} cy={17} r={2.3} fill="#ff5252" />
      <Circle cx={24} cy={17} r={2.3} fill="#ff5252" />
    </Svg>
  );
}
