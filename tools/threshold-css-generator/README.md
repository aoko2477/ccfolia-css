# CCFOLIA ステータス閾値CSS作成ツール

公開先想定：

```text
https://aoko2477.github.io/ccfolia-css/tools/threshold-css-generator/
```

## 機能

- 表示形式
  - キャラクター一覧（`status-all`）
  - 指定キャラクターのステータス表示（`fixed-status`）
- 標準・StylishベースCSSの読み込み
- 適用対象
  - すべてのステータス
  - 1つのステータス
  - 複数のステータス（例：`1, 3, 4`）
- 危険域・注意域の閾値指定
- 通常色・注意色・危険色の指定
- ステータスごとの通常色指定
  - HP・MP・SANプリセット
  - 対象番号・表示名・色の追加と削除
- 危険域アニメーションの選択
- CSSのコピー
- CSSファイル保存
- OBSブラウザソース用URLの案内
- 簡易プレビュー

`fixed-status` では通常色を指定しない限り、ベースCSS側の色やグラデーションを維持します。

## 配置

リポジトリ内の次のパスへ配置します。

```text
tools/
└─ threshold-css-generator/
   ├─ index.html
   ├─ style.css
   └─ app.js
```

GitHub Pagesの公開元がリポジトリルートの場合、そのまま公開URLからアクセスできます。

## 注意

非公式ツールです。CCFOLIA・OBSのアップデートでHTML構造が変わった場合、作成されたCSSが動作しなくなる可能性があります。
