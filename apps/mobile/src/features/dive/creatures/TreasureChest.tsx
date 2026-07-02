import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";

interface Props {
  width: number;
  height?: number;
}

/** The glowing seafloor treasure chest, ported from Snorkeling Dive.dc.html. */
export function TreasureChest({ width, height }: Props) {
  return (
    <Svg width={width} height={height ?? width * (104 / 132)} viewBox="0 0 132 104">
      <Defs>
        <LinearGradient id="chestBase" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7a4a1e" />
          <Stop offset="1" stopColor="#5f3616" />
        </LinearGradient>
        <LinearGradient id="chestLid" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8a5626" />
          <Stop offset="1" stopColor="#6f4420" />
        </LinearGradient>
      </Defs>
      <Rect x={6} y={44} width={120} height={56} rx={8} fill="url(#chestBase)" stroke="#4a2a10" strokeWidth={2} />
      <Rect x={6} y={18} width={120} height={34} rx={16} fill="url(#chestLid)" stroke="#4a2a10" strokeWidth={2} />
      <Rect x={56} y={16} width={20} height={70} fill="#f4c93d" />
      <Rect x={52} y={52} width={28} height={22} rx={5} fill="#ffd23f" stroke="#c9962a" strokeWidth={2} />
      <Circle cx={66} cy={64} r={4} fill="#7a5200" />
      <Circle cx={16} cy={100} r={8} fill="#f4c93d" />
      <Circle cx={38} cy={104} r={8} fill="#ffd23f" />
      <Circle cx={56} cy={98} r={8} fill="#e6b437" />
    </Svg>
  );
}
