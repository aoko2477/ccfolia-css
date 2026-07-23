# CCFOLIA ステータス閾値CSSジェネレーター

公開先想定：

```text
https://aoko2477.github.io/ccfolia-css/tools/threshold-css-generator/
```

## 機能

- 適用対象
  - すべてのステータス
  - 1つのステータス
  - 複数のステータス（例：`1, 3, 4`）
- 危険域・注意域の閾値指定
- 通常色・注意色・危険色の指定
- 危険域アニメーションの選択
- CSSのコピー
- CSSファイル保存
- 簡易プレビュー

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

非公式ツールです。CCFOLIA・OBSのアップデートでHTML構造が変わった場合、生成されたCSSが動作しなくなる可能性があります。
