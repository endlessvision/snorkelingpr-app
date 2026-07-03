import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SHOP_ITEM_DEFS } from "@snorkeling/shared";
import { CoinIcon } from "@/svg/CoinIcon";
import { CoinPill } from "@/components/CoinPill";
import { Text } from "@/components/Text";
import { fontDisplay, fontLabel } from "@/theme/fonts";
import { priceWithDiscount, useEconomy } from "@/store/useEconomy";

interface Props {
  visible: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

/** The Coin Shop overlay — trade coins for real-world perks. Ports the prototype's shop. */
export function CoinShop({ visible, onClose, onToast }: Props) {
  const coins = useEconomy((s) => s.coins);
  const gear = useEconomy((s) => s.gear);
  const redeemed = useEconomy((s) => s.redeemedShopItems);
  const redeemShopItem = useEconomy((s) => s.redeemShopItem);

  const handleRedeem = (key: string, name: string) => {
    const result = redeemShopItem(key);
    if (result === "insufficient") onToast("Not enough coins — keep diving!");
    else if (result === "ok") onToast(`Redeemed: ${name} 🎉`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <ScrollView style={styles.overlay} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <Pressable onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backGlyph}>‹</Text>
          </Pressable>
          <CoinPill coins={coins} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Coin Shop</Text>
          <Text variant="body" color="rgba(255,255,255,0.82)" style={styles.subtitle}>
            Trade the coins you found underwater for real perks on your next tour.
          </Text>
        </View>

        <View style={styles.list}>
          {SHOP_ITEM_DEFS.map((item) => {
            const isRedeemed = redeemed.includes(item.key);
            const price = priceWithDiscount(item.cost, { gear });
            const afford = coins >= price;
            return (
              <View key={item.key} style={styles.row}>
                <View style={styles.iconWrap}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowDesc}>{item.desc}</Text>
                </View>
                {isRedeemed ? (
                  <Text style={styles.redeemed}>✓ Redeemed</Text>
                ) : (
                  <Pressable
                    onPress={() => handleRedeem(item.key, item.name)}
                    style={[styles.buyBtn, { backgroundColor: afford ? "#16c0d8" : "rgba(255,255,255,0.12)" }]}
                  >
                    <CoinIcon size={15} />
                    <Text style={[styles.buyLabel, { color: afford ? "#fff" : "rgba(255,255,255,0.5)" }]}>
                      {price}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "#0a5f83" },
  scrollContent: { flexGrow: 1, paddingBottom: 34 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  backGlyph: { color: "#fff", fontSize: 20, fontFamily: fontLabel.bold },
  header: { alignItems: "center", paddingHorizontal: 24, marginTop: 8 },
  title: { fontFamily: fontDisplay.semiBold, fontSize: 30, color: "#fff" },
  subtitle: { textAlign: "center", marginTop: 2, maxWidth: 280 },
  list: { paddingHorizontal: 20, paddingTop: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 23 },
  rowText: { flex: 1 },
  rowName: { fontFamily: fontLabel.extraBold, fontSize: 14, color: "#fff" },
  rowDesc: { fontFamily: fontLabel.regular, fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  redeemed: { fontFamily: fontLabel.extraBold, fontSize: 12, color: "#7fffd0" },
  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 100,
  },
  buyLabel: { fontFamily: fontLabel.extraBold, fontSize: 12 },
});
