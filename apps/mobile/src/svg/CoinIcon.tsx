import Svg, { Circle, Path } from "react-native-svg";

interface Props {
  size?: number;
}

/** Ported from the `#dv-coin` symbol in Snorkeling Dive.dc.html. */
export function CoinIcon({ size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx={20} cy={20} r={18} fill="#f4c93d" />
      <Circle cx={20} cy={20} r={18} fill="none" stroke="#c9962a" strokeWidth={2.4} />
      <Circle cx={20} cy={20} r={12} fill="none" stroke="#e6b437" strokeWidth={1.6} />
      <Path
        d="M20 9 L23.2 16.6 L31 17 L25 22.2 L27 30 L20 25.5 L13 30 L15 22.2 L9 17 L16.8 16.6 Z"
        fill="#fff6d8"
      />
    </Svg>
  );
}
