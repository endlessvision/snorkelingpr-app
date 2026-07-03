import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
}

/** Ported from Coin Rush's gem symbol in Snorkeling Dive.dc.html. */
export function GemIcon({ size = 28 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M20 5 L33 17 L20 36 L7 17 Z" fill="#ff5bb0" />
      <Path d="M7 17 L33 17 L20 36 Z" fill="#ff2e93" />
      <Path d="M20 5 L26 17 L20 36 L14 17 Z" fill="#ffa8d3" />
    </Svg>
  );
}
