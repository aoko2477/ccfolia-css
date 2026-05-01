"""
HPゲージの割合に応じた色分けCSSを自動生成するスクリプト。

ココフォリアのステータスバーは style="width: xx%" の形式で描画されるため、
CSSのみで割合判定を行うには、整数値および小数点付き値（xx.xx%）の両方を
網羅的に列挙する必要がある。

本スクリプトは以下の区分でCSSを生成する：

- 0〜20%        → 赤（瀕死）
- 20.xx〜50%    → 黄（中間）
- 50.xx〜100%   → 緑（通常）

各値について：
- 整数（width: xx%）
- 小数（width: xx.xx%）

の両方に対応するセレクタを生成する。

また、赤状態にはオプションとしてアニメーション（点滅）を付与可能。
アニメーション定義自体はCSS側で手動管理する前提とする。
"""

BASE = ".MuiBadge-root + div > div > div:nth-child(1) > div:last-child > div:last-child"

LOW_MAX = 20
MID_MAX = 50

def block(selectors, color_var, fallback, extra=""):
    return ",\n".join(selectors) + f""" {{
  background: var({color_var}, {fallback}) !important;{extra}
}}\n"""

# ===== 赤（0〜19.xx + 20%）=====
low = []
for n in range(0, LOW_MAX):
    low.append(f'{BASE}[style="width: {n}%;"]')
    low.append(f'{BASE}[style^="width: {n}."]')

low.append(f'{BASE}[style="width: {LOW_MAX}%;"]')

# ===== 黄（20.xx〜49.xx + 21〜49 + 50%）=====
mid = []

# 20.xx
mid.append(f'{BASE}[style^="width: 20."]')

# 21〜49（整数＋小数）
for n in range(21, MID_MAX):
    mid.append(f'{BASE}[style="width: {n}%;"]')
    mid.append(f'{BASE}[style^="width: {n}."]')

# 50%
mid.append(f'{BASE}[style="width: {MID_MAX}%;"]')

# ===== 緑補正 =====
green_fix = [
    f'{BASE}[style^="width: {MID_MAX}."]',
    f'{BASE}[style="width: 100%;"]'
]

print("/* ===== HP色分け（自動生成） ===== */\n")

# デフォルト
print(f"""{BASE} {{
  background: var(--hp-color, var(--gauge-color)) !important;
}}\n""")

# 黄
print("/* 黄（20.xx〜49.xx + 21〜49 + 50%） */")
print(block(mid, "--hp-mid-color", "#f1c40f"))

# 赤（アニメ付き）
print("/* 赤（0〜19.xx + 20%） */")
print(block(
    low,
    "--hp-low-color",
    "#e74c3c",
    """
  animation: var(--hp-alert-mode, none);
  animation-delay: var(--hp-alert-delay, 0.2s);
"""))

# 緑補正
print("/* 緑補正（50.xx + 100%） */")
print(block(green_fix, "--hp-color", "var(--gauge-color)"))
