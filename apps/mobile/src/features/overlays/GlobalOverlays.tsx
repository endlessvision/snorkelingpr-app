import { useEconomy } from "@/store/useEconomy";
import { useUI } from "@/store/useUI";
import { ActionMenu } from "@/features/actions/ActionMenu";
import { LogSightingOverlay } from "@/features/collection/LogSightingOverlay";
import { GearLocker } from "@/features/gear/GearLocker";
import { MiniGamesHub } from "@/features/minigames/MiniGamesHub";
import { CoinRushOverlay } from "@/features/minigames/coin-rush/CoinRushOverlay";
import { LuckyReelsOverlay } from "@/features/minigames/lucky-reels/LuckyReelsOverlay";
import { DepthGambleOverlay } from "@/features/minigames/depth-gamble/DepthGambleOverlay";
import { CoinShop } from "@/features/redeem/CoinShop";
import { GlobalToast } from "./GlobalToast";

/**
 * Single host for every overlay reachable from the + action menu or the Redeem
 * sheet, mounted once at the root and driven by the useUI store. Keeps one
 * instance of each screen (no duplicate Gear/game state across tabs) and reads
 * economy values from the store to feed the existing prop-based overlays.
 */
export function GlobalOverlays() {
  const screen = useUI((s) => s.screen);
  const close = useUI((s) => s.close);
  const showToast = useUI((s) => s.showToast);

  const gear = useEconomy((s) => s.gear);
  const coins = useEconomy((s) => s.coins);
  const masks = useEconomy((s) => s.masks);
  const earnCoins = useEconomy((s) => s.earnCoins);
  const spendCoins = useEconomy((s) => s.spendCoins);
  const unlockMask = useEconomy((s) => s.unlockMask);

  return (
    <>
      <ActionMenu />
      <LogSightingOverlay />
      <MiniGamesHub />
      <GearLocker visible={screen === "gear"} onClose={close} />
      <CoinRushOverlay visible={screen === "coinRush"} gear={gear} onClose={close} onEarnCoins={earnCoins} />
      <LuckyReelsOverlay
        visible={screen === "luckyReels"}
        coins={coins}
        ownedMasks={masks}
        onClose={close}
        onSpendCoins={spendCoins}
        onEarnCoins={earnCoins}
        onUnlockMask={unlockMask}
      />
      <DepthGambleOverlay
        visible={screen === "depthGamble"}
        coins={coins}
        onClose={close}
        onSpendCoins={spendCoins}
        onEarnCoins={earnCoins}
      />
      <CoinShop visible={screen === "coinShop"} onClose={close} onToast={showToast} />
      <GlobalToast />
    </>
  );
}
