import Svg, { G, Path } from "react-native-svg";

interface Props {
  size: number;
  color: string;
}

/** Thick four-branch pillar coral, ported from the prototype. */
export function PillarCoral({ size, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth={11} fill="none" strokeLinecap="round">
        <Path d="M50 98 L50 54" />
        <Path d="M50 60 C46 44 34 40 28 22" />
        <Path d="M50 58 C56 44 68 42 74 26" />
        <Path d="M50 50 L50 30" />
      </G>
    </Svg>
  );
}
