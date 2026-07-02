import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

/** Ported from the `#o-star` / `#m-star` symbol in the prototypes. */
export function StarIcon({ size = 24, color = "#16C0D8" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <Path d="M50 14 L61 40 L89 42 L67 60 L75 88 L50 72 L25 88 L33 60 L11 42 L39 40 Z" />
    </Svg>
  );
}
