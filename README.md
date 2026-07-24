# CCFOLIA CSS

CCFOLIAの画面をOBSのブラウザソースへ表示するための、カスタムCSSと作成ツールをまとめたリポジトリです。

## 1. ステータス固定

指定したキャラクターのステータスを、OBS上の決まった位置へ表示できます。このリポジトリの中心となるオリジナル機能です。

NPCやエネミーの追加でキャラクター一覧の順番が変わっても、URLで指定したキャラクターの表示を維持できます。

### CSS

| ファイル | 用途 |
| --- | --- |
| [`fixed-status.css`](status/fixed-status.css) | 基本の固定ステータス表示 |
| [`fixed-status-stylish.css`](status/fixed-status-stylish.css) | レイアウトとゲージの見た目を整えた表示 |

読み込み例：

```css
@import url("https://aoko2477.github.io/ccfolia-css/status/fixed-status-stylish.css");
```

OBSブラウザソースのURL：

```text
https://ccfolia.com/rooms/{ルームID}/characters/{キャラクターID}
```

### 解説記事

- [OBSにCCFOLIA上の指定したキャラクターのステータスを表示するカスタムCSSについて](https://qiita.com/aoko_2477/items/d04ad1654016262c063e)
- [CCFOLIAキャラ駒のステータスをOBS配信用におしゃれにするCSSテンプレ](https://qiita.com/aoko_2477/items/470932138755a3687324)

## 2. ステータス閾値

ステータスの残量に応じて、ゲージの色とアニメーションを切り替えられます。

```text
通常域：ステータスごとの色
注意域：黄色
危険域：赤色＋アニメーション
```

### ステータス閾値CSS作成ツール

対象・閾値・色・アニメーションを画面上で選び、OBSへ貼り付けるCSSを作成できます。

**[ステータス閾値CSS作成ツールを開く](https://aoko2477.github.io/ccfolia-css/tools/threshold-css-generator/)**

主な機能：

- ステータス固定とキャラクター一覧の両方に対応
- 1つ・複数・すべてのステータスを対象に指定
- 通常・注意・危険の3段階でゲージを色分け
- HP・MP・SANなど、ステータスごとの通常色を設定
- 危険域の点滅・心拍アニメーション
- ベースCSSの自動読み込み
- CSSのコピーとファイル保存
- OBSブラウザソースへ指定するURL例の表示

詳しい仕様は[`tools/threshold-css-generator/README.md`](tools/threshold-css-generator/README.md)を参照してください。

解説記事：

- [ステータス閾値CSS作成ツールの使い方・解説](https://qiita.com/aoko_2477/items/0f0db2ddd32cf0b5cf57)

### 作成済みCSS

| ファイル | 対象 |
| --- | --- |
| [`fixed-status-threshold-hp.css`](status/fixed-status-threshold-hp.css) | 固定表示・1番目のステータス |
| [`fixed-status-threshold-all.css`](status/fixed-status-threshold-all.css) | 固定表示・すべてのステータス |
| [`status-all-threshold-hp.css`](modified-code/status-all-threshold-hp.css) | キャラクター一覧・1番目のステータス |
| [`status-all-threshold-all.css`](modified-code/status-all-threshold-all.css) | キャラクター一覧・すべてのステータス |

## 3. 公開CSSを継承して追加した機能

`modified-code/`には、他の方が公開しているCSSを`@import`で読み込み、その上に表示調整や追加設定を重ねたCSSを配置しています。参照元とライセンス表記は各ファイル内に記載しています。

### キャラクター一覧のステータス表示

| ファイル | 用途 |
| --- | --- |
| [`status-all.css`](modified-code/status-all.css) | キャラクター一覧の基本表示 |
| [`status-all-stylish.css`](modified-code/status-all-stylish.css) | レイアウトとゲージの見た目を整えた表示 |

読み込み例：

```css
@import url("https://aoko2477.github.io/ccfolia-css/modified-code/status-all-stylish.css");
```

OBSブラウザソースのURL：

```text
https://ccfolia.com/rooms/{ルームID}/
```

### その他

| ファイル | 用途 |
| --- | --- |
| [`bgm.css`](modified-code/bgm.css) | BGM関連表示 |
| [`generate_all_status_color_css.py`](modified-code/generate_all_status_color_css.py) | 一覧用の色分けCSSを作成するスクリプト |
| [`generate_hp_color_css.py`](modified-code/generate_hp_color_css.py) | HP用の色分けCSSを作成するスクリプト |

## 4. その他のCSS

### チャット表示

| ファイル | 用途 |
| --- | --- |
| [`chat-main.css`](chat-main.css) | CCFOLIAチャットのOBS向け基本表示 |
| [`chat-hitoku.css`](chat-hitoku.css) | 秘匿チャット向け設定 |
| [`chat-bottom-fade-in-out.css`](chat-bottom-fade-in-out.css) | 下から表示してフェードアウトする演出 |
| [`dicord/discord-chat.css`](dicord/discord-chat.css) | Discordチャット表示用CSS |

解説記事：

- [【備忘録】CCFOLIAのルームチャットをOBSで良い感じに表示させるCSS](https://qiita.com/aoko_2477/items/dd6373d427f942b8e30f)

## Qiita

[aoko_2477のQiita記事一覧](https://qiita.com/aoko_2477)

## 注意事項

- このリポジトリのCSSとツールは非公式です。
- CCFOLIA・OBSのアップデートにより動作しなくなる場合があります。
- 問題が発生しても、CCFOLIAまたはOBSの公式サポートへ問い合わせないでください。
- CSSを組み合わせる場合は、ベースCSSを先に読み込み、追加するCSSを後に記述してください。

## ライセンス

このリポジトリは[MIT License](LICENSE)で公開しています。外部コードを元にしたファイルについては、各ファイル内のライセンス表記も確認してください。
