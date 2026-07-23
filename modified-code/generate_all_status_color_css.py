"""CCFOLIAの全ステータスゲージを割合に応じて色分けするCSS生成スクリプト。"""
BASE = ".MuiBadge-root + div > div > div > div:last-child > div:last-child"
LOW_MAX = 20
MID_MAX = 50


def block(selectors, color_var, fallback, extra=""):
    return ",\n".join(selectors) + f""" {{
  background: var({color_var}, {fallback}) !important;{extra}
}}\n"""


low = []
for n in range(0, LOW_MAX):
    low.append(f'{BASE}[style="width: {n}%;"]')
    low.append(f'{BASE}[style^="width: {n}."]')
low.append(f'{BASE}[style="width: {LOW_MAX}%;"]')

mid = [f'{BASE}[style^="width: {LOW_MAX}."]']
for n in range(LOW_MAX + 1, MID_MAX):
    mid.append(f'{BASE}[style="width: {n}%;"]')
    mid.append(f'{BASE}[style^="width: {n}."]')
mid.append(f'{BASE}[style="width: {MID_MAX}%;"]')

normal_fix = [
    f'{BASE}[style^="width: {MID_MAX}."]',
    f'{BASE}[style="width: 100%;"]',
]

print("/* ===== 全ステータス色分け（Python生成） ===== */\n")
print(f"""{BASE} {{
  background: var(--status-threshold-normal-color, var(--gauge-color, rgb(245, 245, 245))) !important;
}}\n""")
print("/* 黄（20.xx〜49.xx + 21〜49 + 50%） */")
print(block(mid, "--status-threshold-mid-color", "#f1c40f"))
print("/* 赤（0〜19.xx + 20%） */")
print(block(low, "--status-threshold-low-color", "#e74c3c", """
  animation: var(--status-threshold-alert-mode, none);
  animation-delay: var(--status-threshold-alert-delay, 0.2s);
"""))
print("/* 通常色補正（50.xx + 100%） */")
print(block(normal_fix, "--status-threshold-normal-color", "var(--gauge-color, rgb(245, 245, 245))"))
