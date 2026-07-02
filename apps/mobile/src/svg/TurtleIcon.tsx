import Svg, { Ellipse, Circle } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

/** Ported from the `#o-turtle` / `#m-turtle` symbol in the prototypes. */
export function TurtleIcon({ size = 24, color = "#16C0D8" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <Ellipse cx={50} cy={52} rx={26} ry={22} />
      <Circle cx={50} cy={22} r={9} />
      <Ellipse cx={24} cy={38} rx={10} ry={6} transform="rotate(-35 24 38)" />
      <Ellipse cx={76} cy={38} rx={10} ry={6} transform="rotate(35 76 38)" />
      <Ellipse cx={26} cy={70} rx={9} ry={5} transform="rotate(35 26 70)" />
      <Ellipse cx={74} cy={70} rx={9} ry={5} transform="rotate(-35 74 70)" />
    </Svg>
  );
}
