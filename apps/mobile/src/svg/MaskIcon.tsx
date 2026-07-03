import Svg, { Path, Rect } from "react-native-svg";

interface Props {
  size?: number;
  color: string;
}

/** The diver mask glyph used for Explorer/Fortune/Voyager, ported from the prototype. */
export function MaskIcon({ size = 54, color }: Props) {
  const height = (size * 49) / 54;
  return (
    <Svg width={size} height={height} viewBox="0 0 60 52">
      <Rect x={4} y={5} width={52} height={33} rx={15} fill={color} />
      <Rect x={11} y={12} width={38} height={19} rx={9} fill="#0a2a3a" />
      <Rect x={15} y={15} width={12} height={7} rx={3} fill="rgba(255,255,255,0.35)" />
      <Path d="M6 37 Q30 50 54 37" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
