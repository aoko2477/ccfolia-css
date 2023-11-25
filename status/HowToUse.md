
以下のコードを
https://qiita.com/aoko_2477/items/d04ad1654016262c063e
に従って使ってください。
```css
@import url("https://aoko2477.github.io/ccfolia-css/status/fixed-status.css");

:root {
    /*ステータスの横幅や並びの数制御*/
    --status-number: 200px;/*ここで横並びの数制御。ステータスの横幅と関連*/
    --status-width:   80px;/*ステータスの横幅制御：デフォルト96px*/

    /*ステータスのフォント等のデザイン変更*/
    --font-color-status: rgb(66, 66, 66);/*デフォはrgb(66, 66, 66)*/
    --font-size-status: 0.875rem;/*HP等のフォントサイズ*/
    --font-family-all: "Roboto", "Helvetica", "Arial", sans-serif;/*イニシアチブ含めたフォント変更*/

    /*ステータスのバーデザイン関連*/
    --status-background-color: transparent;/*transparent;(245, 245, 245);*/
    --status-gauge-color: rgb(245, 245, 245);

    /*イニシアチブ部分のデザイン変更*/
    --initiative-font-color: rgb(66, 66, 66);
    --initiative-background-color: rgb(245, 245, 245);/*背景色;*/

    /*キャラアイコンのデザイン変更*/
    /*--icon-switch: none;*/
    --character-background-color: transparent;/*背景色。デフォルトはtransparent*/

    /*色は#000000のようにカラーコードも使えます。キャラクターカラーと揃えたい場合はご活用ください。*/
}
```
