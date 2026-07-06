import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COIN_BUBBLE_DEFS, GEM_BUBBLE_DEFS } from "@snorkeling/shared";
import { diveOceanGradient } from "@/theme/tokens";
import { Bubble } from "@/components/Bubble";
import { SunRay } from "./SunRay";
import { BiolumDot } from "./BiolumDot";
import { Drift } from "./Drift";
import { CoinBubbleView } from "./CoinBubbleView";
import { GemBubbleView } from "./GemBubbleView";
import { BurstKind, CollectBurst } from "./CollectBurst";
import { LongFish } from "./creatures/LongFish";
import { RoundFish } from "./creatures/RoundFish";
import { AngelFish } from "./creatures/AngelFish";
import { TangFish } from "./creatures/TangFish";
import { MantaGlide } from "./creatures/MantaGlide";
import { RayGlide } from "./creatures/RayGlide";
import { DiveTurtle } from "./creatures/DiveTurtle";
import { FanCoral } from "./creatures/FanCoral";
import { PillarCoral } from "./creatures/PillarCoral";
import { BrainCoral } from "./creatures/BrainCoral";
import { SeaRodCoral } from "./creatures/SeaRodCoral";
import { Starfish } from "./creatures/Starfish";
import { Anchor } from "./creatures/Anchor";
import { TreasureChest } from "./creatures/TreasureChest";

export const WORLD_WIDTH = 1120;
export const WORLD_HEIGHT = 4200;

interface Burst {
  id: number;
  left: number;
  top: number;
  value: number;
  kind: BurstKind;
}

interface Props {
  collected: Record<string, boolean>;
  onCollect: (id: string, left: number, top: number, value: number) => void;
  poppedGems: Record<string, boolean>;
  onCollectGem: (id: string, left: number, top: number, value: number) => void;
  bursts: Burst[];
  onBurstDone: (id: number) => void;
}

/** The full pannable 1120x4200 underwater world — ports Snorkeling Dive.dc.html. */
export function OceanWorld({ collected, onCollect, poppedGems, onCollectGem, bursts, onBurstDone }: Props) {
  return (
    <LinearGradient
      colors={diveOceanGradient.colors as [string, string, ...string[]]}
      locations={diveOceanGradient.locations as [number, number, ...number[]]}
      style={styles.world}
    >
      {/* sun rays */}
      <SunRay left={180} width={90} height={640} skewDeg={-14} durationMs={6000} />
      <SunRay left={520} width={64} height={520} skewDeg={11} durationMs={7500} delayMs={800} />
      <SunRay left={820} width={80} height={600} skewDeg={-9} durationMs={6800} delayMs={400} />

      {/* ambient bubbles */}
      <Bubble left={240} top={560} size={9} rise={150} durationMs={6000} />
      <Bubble left={700} top={820} size={6} rise={150} durationMs={7000} delayMs={1200} />
      <Bubble left={430} top={1300} size={7} rise={150} durationMs={6500} delayMs={600} />
      <Bubble left={920} top={1750} size={8} rise={150} durationMs={7400} delayMs={1800} />
      <Bubble left={330} top={2350} size={6} rise={150} durationMs={8000} delayMs={300} />
      <Bubble left={640} top={3050} size={7} rise={150} durationMs={8500} delayMs={1000} color="rgba(200,240,255,0.4)" />

      {/* SURFACE fish */}
      <Drift left={210} top={250} type="swim" durationMs={9000}>
        <LongFish width={70} body="#d5eef4" fin="#9dc3d1" />
      </Drift>
      <Drift left={640} top={360} type="bob" durationMs={5000}>
        <LongFish width={40} body="#2f7bff" fin="#1b4fd0" />
      </Drift>
      <Drift left={500} top={200} type="bob" durationMs={6000} delayMs={500}>
        <LongFish width={34} body="#2f7bff" fin="#1b4fd0" />
      </Drift>

      {/* REEF GARDEN fish */}
      <Drift left={300} top={840} type="sway" durationMs={8000}>
        <RoundFish width={68} body="#1a63d8" fin="#0a3f9e" />
      </Drift>
      <Drift left={730} top={1000} type="swim" durationMs={10000}>
        <LongFish width={56} body="#f4d13d" fin="#123a5c" />
      </Drift>
      <Drift left={520} top={1200} type="bob" durationMs={6500}>
        <RoundFish width={50} body="#fbf4e2" fin="#f3a93d" />
      </Drift>
      <Drift left={170} top={1330} type="swim" durationMs={11000} delayMs={600}>
        <LongFish width={64} body="#dfeaf0" fin="#f4c93d" />
      </Drift>
      <Drift left={880} top={1240} type="bob" durationMs={5500} delayMs={800}>
        <RoundFish width={44} body="#1a63d8" fin="#0a3f9e" />
      </Drift>

      {/* reef ledge corals */}
      <Drift left={150} top={1360} type="sway" durationMs={9000}>
        <FanCoral size={92} color="#a05bd6" />
      </Drift>
      <View style={{ position: "absolute", left: 380, top: 1450 }}>
        <BrainCoral size={80} color="#f6a6c2" />
      </View>
      <View style={{ position: "absolute", left: 630, top: 1380 }}>
        <PillarCoral size={100} color="#e28a4a" />
      </View>
      <View style={{ position: "absolute", left: 860, top: 1420 }}>
        <SeaRodCoral size={62} color="#ff7a9c" />
      </View>

      {/* turtle */}
      <Drift left={470} top={1620} type="sway" durationMs={10000}>
        <DiveTurtle width={112} color="#2fb89a" />
      </Drift>

      {/* REEF WALL fish */}
      <Drift left={340} top={1780} type="bob" durationMs={6000}>
        <AngelFish width={74} body="#1fb7c9" fin="#f4c93d" />
      </Drift>
      <Drift left={780} top={1960} type="bob" durationMs={7000} delayMs={600}>
        <AngelFish width={70} body="#233039" fin="#f4c93d" />
      </Drift>
      <Drift left={240} top={2120} type="swim" durationMs={12000}>
        <TangFish width={86} body="#17a06a" fin="#ff5bb0" />
      </Drift>
      <Drift left={660} top={2280} type="bob" durationMs={5600} delayMs={400}>
        <RoundFish width={48} body="#f4c93d" fin="#1a1e24" />
      </Drift>

      {/* wall corals */}
      <Drift left={720} top={2320} type="sway" durationMs={11000}>
        <FanCoral size={90} color="#7b52c9" />
      </Drift>
      <View style={{ position: "absolute", left: 300, top: 2380 }}>
        <BrainCoral size={76} color="#f6b13d" />
      </View>

      {/* DEEP BLUE fish */}
      <Drift left={360} top={2700} type="glide" durationMs={12000}>
        <MantaGlide width={150} color="#3f6076" />
      </Drift>
      <Drift left={770} top={2560} type="swim" durationMs={14000}>
        <RayGlide width={130} body="#b9c6cf" fin="#7f95a1" />
      </Drift>
      <Drift left={260} top={3080} type="bob" durationMs={6600}>
        <LongFish width={70} body="#8fb0c4" fin="#2f7bff" />
      </Drift>

      {/* ABYSS fish + bioluminescence */}
      <Drift left={700} top={3520} type="bob" durationMs={7200}>
        <RoundFish width={64} body="#3fa9c4" fin="#f4c93d" />
      </Drift>
      <BiolumDot left={250} top={3360} color="#8ff0ff" durationMs={3500} />
      <BiolumDot left={520} top={3560} size={5} color="#a0f5c8" durationMs={4000} delayMs={800} />
      <BiolumDot left={840} top={3460} color="#8ff0ff" durationMs={3200} delayMs={1400} />
      <BiolumDot left={380} top={3680} size={5} color="#c9a0ff" durationMs={4500} delayMs={300} />

      {/* SEAFLOOR */}
      <View style={styles.sand} />
      <View style={{ position: "absolute", left: 210, top: 3862 }}>
        <PillarCoral size={118} color="#d98a4a" />
      </View>
      <Drift left={870} top={3820} type="sway" durationMs={12000}>
        <FanCoral size={100} color="#8a5bd6" />
      </Drift>
      <View style={{ position: "absolute", left: 700, top: 3980 }}>
        <BrainCoral size={82} color="#f28ab0" />
      </View>
      <Drift left={430} top={4060} type="bob" durationMs={5000}>
        <Starfish size={54} color="#ff8a3d" />
      </Drift>
      <Drift left={300} top={3760} type="sway" durationMs={13000}>
        <Anchor width={64} color="#9a6a4a" />
      </Drift>

      {/* treasure chest */}
      <View style={styles.chestGlow}>
        <TreasureChest width={132} />
      </View>

      {/* coin bubbles */}
      {COIN_BUBBLE_DEFS.filter((c) => !collected[c.id]).map((c) => (
        <CoinBubbleView
          key={c.id}
          left={c.left}
          top={c.top}
          value={c.value}
          onCollect={() => onCollect(c.id, c.left - 4, c.top - 6, c.value)}
        />
      ))}

      {/* gem (XP) bubbles */}
      {GEM_BUBBLE_DEFS.filter((g) => !poppedGems[g.id]).map((g) => (
        <GemBubbleView
          key={g.id}
          left={g.left}
          top={g.top}
          value={g.value}
          onCollect={() => onCollectGem(g.id, g.left - 4, g.top - 6, g.value)}
        />
      ))}

      {/* collect bursts */}
      {bursts.map((b) => (
        <CollectBurst key={b.id} left={b.left} top={b.top} value={b.value} kind={b.kind} onDone={() => onBurstDone(b.id)} />
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  world: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
  sand: {
    position: "absolute",
    left: 0,
    top: 3980,
    width: WORLD_WIDTH,
    height: 220,
    backgroundColor: "#b8935a",
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },
  chestGlow: { position: "absolute", left: 495, top: 3868 },
});
