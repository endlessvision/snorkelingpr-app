import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export type CreatureKind =
  | "turtle"
  | "fish"
  | "ray"
  | "shark"
  | "coral"
  | "octopus"
  | "jelly"
  | "seahorse"
  | "star";

interface Props {
  kind: CreatureKind;
  size?: number;
  color?: string;
}

/** Single-color marine silhouettes — ported from the m-* symbols in Snorkeling PR App.dc.html. */
export function MarineCreature({ kind, size = 64, color = "rgba(255,255,255,0.9)" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {shape(kind, color)}
    </Svg>
  );
}

function shape(kind: CreatureKind, c: string) {
  switch (kind) {
    case "turtle":
      return (
        <>
          <Ellipse cx={50} cy={52} rx={26} ry={22} fill={c} />
          <Circle cx={50} cy={22} r={9} fill={c} />
          <Ellipse cx={24} cy={38} rx={10} ry={6} transform="rotate(-35 24 38)" fill={c} />
          <Ellipse cx={76} cy={38} rx={10} ry={6} transform="rotate(35 76 38)" fill={c} />
          <Ellipse cx={26} cy={70} rx={9} ry={5} transform="rotate(35 26 70)" fill={c} />
          <Ellipse cx={74} cy={70} rx={9} ry={5} transform="rotate(-35 74 70)" fill={c} />
        </>
      );
    case "fish":
      return (
        <>
          <Path d="M20 50 Q45 28 72 50 Q45 72 20 50 Z" fill={c} />
          <Path d="M72 50 L92 36 L88 50 L92 64 Z" fill={c} />
          <Circle cx={34} cy={46} r={3} fill="#fff" />
        </>
      );
    case "ray":
      return (
        <>
          <Path d="M50 24 Q86 50 50 64 Q14 50 50 24 Z" fill={c} />
          <Path d="M50 60 L52 90" stroke={c} strokeWidth={3} fill="none" />
        </>
      );
    case "shark":
      return (
        <>
          <Path d="M14 54 Q44 40 76 52 L92 44 L84 56 L92 66 L74 58 Q44 66 14 54 Z" fill={c} />
          <Path d="M52 44 L60 26 L66 46 Z" fill={c} />
        </>
      );
    case "coral":
      return (
        <Path
          d="M50 90 V54 M50 60 Q38 50 34 34 M50 58 Q62 48 68 30 M50 66 Q44 56 40 48 M50 64 Q58 54 62 46"
          stroke={c}
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
        />
      );
    case "octopus":
      return (
        <>
          <Path
            d="M30 44 Q30 20 50 20 Q70 20 70 44 Q70 56 64 60 Q70 80 60 86 Q56 70 50 70 Q44 86 38 84 Q44 70 40 64 Q30 78 24 70 Q34 62 30 56 Z"
            fill={c}
          />
          <Circle cx={42} cy={40} r={3} fill="#fff" />
          <Circle cx={58} cy={40} r={3} fill="#fff" />
        </>
      );
    case "jelly":
      return (
        <>
          <Path d="M28 44 Q28 22 50 22 Q72 22 72 44 Q72 50 68 50 H32 Q28 50 28 44 Z" fill={c} />
          <Path
            d="M36 52 Q34 72 38 86 M48 52 Q48 74 46 88 M60 52 Q66 72 62 86 M52 52 Q52 70 56 84"
            stroke={c}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "seahorse":
      return (
        <Path
          d="M58 20 Q70 22 68 34 Q66 44 54 46 Q46 48 46 58 Q46 70 56 72 Q66 74 64 84 Q58 88 52 84 Q40 80 40 64 Q40 50 50 44 Q44 36 40 40 Q44 28 54 30 Q52 22 58 20 Z"
          fill={c}
        />
      );
    case "star":
      return (
        <Path d="M50 14 L61 40 L89 42 L67 60 L75 88 L50 72 L25 88 L33 60 L11 42 L39 40 Z" fill={c} />
      );
  }
}
