"""
HPゲージの割合に応じた色分けCSSを自動生成するスクリプト。

ココフォリアのステータスバーは width: xx% の形式で描画されるため、
CSSのみで割合判定を行うには、0〜100%および小数点付き値（xx.xx%）を
網羅的に列挙する必要がある。

このスクリプトは以下のような区分でCSSを生成する：

- 0〜LOW_MAX%        → 赤（瀕死）
- LOW_MAX.xx〜MID_MAX% → 黄（中間）
- MID_MAX.xx〜100%   → 緑（通常）

※ 小数点付き（例：1.23%）にも対応するため、
  [style^="width: n."] の形式も同時に生成する。
"""

BASE = ".MuiBadge-root + div > div > div:nth-child(1) > div:last-child > div:last-child"

LOW_MAX = 20   # 赤の上限（20%含む）
MID_MAX = 50   # 黄の上限（50%含む）

def gen_range(start, end, include_int=True, include_decimal=True):
    sels = []
    for n in range(start, end + 1):
        if include_int:
            sels.append(f'{BASE}[style="width: {n}%;"]')
        if include_decimal:
            sels.append(f'{BASE}[style^="width: {n}."]')
    return sels

# 赤：0〜19.xx ＋ 20%
low = gen_range(0, LOW_MAX - 1)  # 0〜19（整数＋小数）
low.append(f'{BASE}[style="width: {LOW_MAX}%;"]')  # 20%だけ赤

# 黄：20.xx〜49.xx ＋ 50%
mid = gen_range(LOW_MAX, MID_MAX - 1, include_int=False)  # 20.xx〜49.xx（小数のみ）
mid.append(f'{BASE}[style="width: {MID_MAX}%;"]')         # 50%だけ黄

# 50.xx は緑に戻す（上書き）
green_fix = [f'{BASE}[style^="width: {MID_MAX}."]']  # 50.xx

def block(selectors, color_var, fallback):
    return ",\n".join(selectors) + f' {{\n  background: var({color_var}, {fallback}) !important;\n}}\n'

print("/* ===== HP色分け（自動生成） ===== */\n")

print("/* デフォルト（緑） */")
print(f"{BASE} {{\n  background: var(--hp-color, var(--gauge-color)) !important;\n}}\n")

print("/* 黄（20.xx〜49.xx + 50%） */")
print(block(mid, "--hp-mid-color", "#f1c40f"))

print("/* 赤（0〜19.xx + 20%） */")
print(block(low, "--hp-low-color", "#e74c3c"))

print("/* 50.xx を緑に戻す */")
print(block(green_fix, "--hp-color", "var(--gauge-color)"))

print("/* 100%誤爆対策 */")
print(f'{BASE}[style="width: 100%;"] {{\n  background: var(--hp-color, var(--gauge-color)) !important;\n}}')
