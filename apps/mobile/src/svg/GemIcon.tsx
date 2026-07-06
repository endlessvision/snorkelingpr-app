import Svg, { Path } from "react-native-svg";

export interface GemColors {
  main: string;
  dark: string;
  light: string;
}

/** Pink gem (Coin Rush). */
export const GEM_PINK: GemColors = { main: "#ff5bb0", dark: "#ff2e93", light: "#ffa8d3" };
/** Cyan gem (Dive XP bubbles). */
export const GEM_CYAN: GemColors = { main: "#7fe6ef", dark: "#16c0d8", light: "#bff4f8" };

interface Props {
  size?: number;
  colors?: GemColors;
}

/** Ported from the gem symbol in Snorkeling Dive.dc.html. */
export function GemIcon({ size = 28, colors = GEM_PINK }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M20 5 L33 17 L20 36 L7 17 Z" fill={colors.main} />
      <Path d="M7 17 L33 17 L20 36 Z" fill={colors.dark} />
      <Path d="M20 5 L26 17 L20 36 L14 17 Z" fill={colors.light} />
    </Svg>
  );
}
