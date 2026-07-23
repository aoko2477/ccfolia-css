(() => {
  "use strict";

  const els = {
    pageTypeOptions: [...document.querySelectorAll('input[name="pageType"]')],
    baseCssOptions: [...document.querySelectorAll('input[name="baseCss"]')],
    standardBaseDescription: document.querySelector("#standardBaseDescription"),
    stylishBaseDescription: document.querySelector("#stylishBaseDescription"),
    targetModes: [...document.querySelectorAll('input[name="targetMode"]')],
    singleIndex: document.querySelector("#singleIndex"),
    multipleIndexes: document.querySelector("#multipleIndexes"),
    dependentFields: [...document.querySelectorAll(".dependent-field")],
    lowMax: document.querySelector("#lowMax"),
    midMax: document.querySelector("#midMax"),
    normalColor: document.querySelector("#normalColor"),
    normalColorText: document.querySelector("#normalColorText"),
    useNormalColor: document.querySelector("#useNormalColor"),
    midColor: document.querySelector("#midColor"),
    midColorText: document.querySelector("#midColorText"),
    lowColor: document.querySelector("#lowColor"),
    lowColorText: document.querySelector("#lowColorText"),
    animationMode: document.querySelector("#animationMode"),
    animationDelay: document.querySelector("#animationDelay"),
    generateButton: document.querySelector("#generateButton"),
    resetButton: document.querySelector("#resetButton"),
    cssOutput: document.querySelector("#cssOutput"),
    copyButton: document.querySelector("#copyButton"),
    downloadButton: document.querySelector("#downloadButton"),
    errorBox: document.querySelector("#errorBox"),
    outputStatus: document.querySelector("#outputStatus"),
    previewTarget: document.querySelector("#previewTarget"),
    previewNormal: document.querySelector("#previewNormal"),
    previewMid: document.querySelector("#previewMid"),
    previewLow: document.querySelector("#previewLow"),
    previewMidLabel: document.querySelector("#previewMidLabel"),
    previewLowLabel: document.querySelector("#previewLowLabel"),
    sourceUrlType: document.querySelector("#sourceUrlType"),
    sourceUrl: document.querySelector("#sourceUrl"),
    sourceUrlHint: document.querySelector("#sourceUrlHint"),
  };

  const defaults = {
    pageType: "status-all",
    baseCss: "stylish",
    targetMode: "single",
    singleIndex: 1,
    multipleIndexes: "1, 3",
    lowMax: 20,
    midMax: 50,
    normalColor: "#2ecc71",
    useNormalColor: false,
    midColor: "#f1c40f",
    lowColor: "#e74c3c",
    animationMode: "heartbeat-strong",
    animationDelay: 0.2,
  };

  const animationValues = {
    none: "none",
    alert: "status-threshold-alert 0.6s ease-out 2",
    blink: "status-threshold-blink 1s linear infinite",
    heartbeat: "status-threshold-heartbeat 1.6s ease-in-out infinite",
    "heartbeat-strong": "status-threshold-heartbeat-strong 1.4s ease-in-out infinite",
  };

  const baseCssPresets = {
    "status-all": {
      standard: {
        filename: "status-all.css",
        url: "https://aoko2477.github.io/ccfolia-css/modified-code/status-all.css",
      },
      stylish: {
        filename: "status-all-stylish.css",
        url: "https://aoko2477.github.io/ccfolia-css/modified-code/status-all-stylish.css",
      },
    },
    "fixed-status": {
      standard: {
        filename: "fixed-status.css",
        url: "https://aoko2477.github.io/ccfolia-css/status/fixed-status.css",
      },
      stylish: {
        filename: "fixed-status-stylish.css",
        url: "https://aoko2477.github.io/ccfolia-css/status/fixed-status-stylish.css",
      },
    },
  };

  function getPageType() {
    return els.pageTypeOptions.find((radio) => radio.checked)?.value ?? "status-all";
  }

  function getBaseCss() {
    return els.baseCssOptions.find((radio) => radio.checked)?.value ?? "stylish";
  }

  function getTargetMode() {
    return els.targetModes.find((radio) => radio.checked)?.value ?? "single";
  }

  function pageTypeDescription(pageType) {
    return pageType === "fixed-status"
      ? "指定キャラクターのステータス表示"
      : "キャラクター一覧";
  }

  function updatePageType() {
    const pageType = getPageType();
    const presets = baseCssPresets[pageType];
    els.standardBaseDescription.textContent =
      `${presets.standard.filename} を作成結果の先頭で読み込む`;
    els.stylishBaseDescription.textContent =
      `見た目を整えた ${presets.stylish.filename} を読み込む`;

    if (pageType === "fixed-status") {
      els.sourceUrlType.textContent = "指定キャラクターのステータス表示";
      els.sourceUrl.value =
        "https://ccfolia.com/rooms/{ルームID}/characters/{キャラクターID}";
      els.sourceUrlHint.textContent =
        "表示したいキャラクターの個別ページURLを指定します。";
    } else {
      els.sourceUrlType.textContent = "キャラクター一覧";
      els.sourceUrl.value = "https://ccfolia.com/rooms/{ルームID}/";
      els.sourceUrlHint.textContent = "ルーム画面のURLを指定します。";
    }

    updatePreview();
  }

  function updateTargetFields() {
    const mode = getTargetMode();
    els.dependentFields.forEach((field) => {
      field.hidden = field.dataset.for !== mode;
    });
    updatePreview();
  }

  function normalizeHex(value) {
    const trimmed = value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
      return trimmed.toLowerCase();
    }
    if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
      return (
        "#" +
        trimmed
          .slice(1)
          .split("")
          .map((char) => char + char)
          .join("")
      ).toLowerCase();
    }
    return null;
  }

  function syncColorPair(colorInput, textInput, source) {
    if (source === "picker") {
      textInput.value = colorInput.value;
      return;
    }
    const normalized = normalizeHex(textInput.value);
    if (normalized) {
      colorInput.value = normalized;
    }
  }

  function parseMultipleIndexes(value) {
    const rawItems = value.split(",").map((item) => item.trim());

    if (rawItems.some((item) => item === "")) {
      throw new Error("複数指定は「1, 3, 4」のように入力してください。");
    }

    if (!rawItems.every((item) => /^[1-9]\d*$/.test(item))) {
      throw new Error("複数指定には1以上の整数だけを入力してください。");
    }

    const indexes = [...new Set(rawItems.map(Number))].sort((a, b) => a - b);

    if (indexes.some((index) => index > 99)) {
      throw new Error("ステータスの順番は99番目まで指定できます。");
    }

    return indexes;
  }

  function validateAndReadSettings() {
    const targetMode = getTargetMode();
    const lowMax = Number(els.lowMax.value);
    const midMax = Number(els.midMax.value);
    const animationDelay = Number(els.animationDelay.value);

    if (!Number.isInteger(lowMax) || lowMax < 0 || lowMax > 99) {
      throw new Error("危険域の上限は0〜99の整数で指定してください。");
    }

    if (!Number.isInteger(midMax) || midMax < 1 || midMax > 100) {
      throw new Error("注意域の上限は1〜100の整数で指定してください。");
    }

    if (lowMax >= midMax) {
      throw new Error("危険域の上限は、注意域の上限より小さくしてください。");
    }

    if (!Number.isFinite(animationDelay) || animationDelay < 0 || animationDelay > 10) {
      throw new Error("アニメーションの遅延は0〜10秒で指定してください。");
    }

    let indexes = [];

    if (targetMode === "single") {
      const index = Number(els.singleIndex.value);
      if (!Number.isInteger(index) || index < 1 || index > 99) {
        throw new Error("ステータスの順番は1〜99の整数で指定してください。");
      }
      indexes = [index];
    } else if (targetMode === "multiple") {
      indexes = parseMultipleIndexes(els.multipleIndexes.value);
    }

    const normalColor = normalizeHex(els.normalColorText.value);
    const midColor = normalizeHex(els.midColorText.value);
    const lowColor = normalizeHex(els.lowColorText.value);

    if (els.useNormalColor.checked && !normalColor) {
      throw new Error("通常色は #2ecc71 のようなHEX形式で指定してください。");
    }
    if (!midColor) {
      throw new Error("注意色は #f1c40f のようなHEX形式で指定してください。");
    }
    if (!lowColor) {
      throw new Error("危険色は #e74c3c のようなHEX形式で指定してください。");
    }

    return {
      pageType: getPageType(),
      baseCss: getBaseCss(),
      targetMode,
      indexes,
      lowMax,
      midMax,
      useNormalColor: els.useNormalColor.checked,
      normalColor,
      midColor,
      lowColor,
      animationMode: els.animationMode.value,
      animationDelay,
    };
  }

  function makeBases(settings) {
    const prefix = settings.pageType === "fixed-status"
      ? '[variant="bar"]'
      : ".MuiBadge-root + div > div";

    if (settings.targetMode === "all") {
      return [`${prefix} > div > div:last-child > div:last-child`];
    }

    return settings.indexes.map(
      (index) =>
        `${prefix} > div:nth-child(${index}) > div:last-child > div:last-child`
    );
  }

  function makeSelectors(bases, kind, settings) {
    const selectors = [];

    if (kind === "low") {
      for (const base of bases) {
        for (let n = 0; n < settings.lowMax; n += 1) {
          selectors.push(`${base}[style="width: ${n}%;"]`);
          selectors.push(`${base}[style^="width: ${n}."]`);
        }
        selectors.push(`${base}[style="width: ${settings.lowMax}%;"]`);
      }
    }

    if (kind === "mid") {
      for (const base of bases) {
        selectors.push(`${base}[style^="width: ${settings.lowMax}."]`);

        for (let n = settings.lowMax + 1; n < settings.midMax; n += 1) {
          selectors.push(`${base}[style="width: ${n}%;"]`);
          selectors.push(`${base}[style^="width: ${n}."]`);
        }

        selectors.push(`${base}[style="width: ${settings.midMax}%;"]`);
      }
    }

    if (kind === "normalFix") {
      for (const base of bases) {
        selectors.push(`${base}[style^="width: ${settings.midMax}."]`);
        selectors.push(`${base}[style="width: 100%;"]`);
      }
    }

    return selectors;
  }

  function renderBlock(selectors, declarations) {
    return `${selectors.join(",\n")} {\n${declarations
      .map((line) => `  ${line}`)
      .join("\n")}\n}`;
  }

  function animationKeyframes() {
    return `/* ===== アニメーション定義 ===== */

@keyframes status-threshold-alert {
  0%   { opacity: 1; box-shadow: 0 0 2px rgba(231,76,60,0.4); }
  30%  { opacity: 0.4; box-shadow: 0 0 8px rgba(231,76,60,0.9); }
  60%  { opacity: 1; box-shadow: 0 0 2px rgba(231,76,60,0.4); }
  100% { opacity: 1; box-shadow: none; }
}

@keyframes status-threshold-blink {
  0%   { opacity: 1; }
  50%  { opacity: 0.5; }
  100% { opacity: 1; }
}

@keyframes status-threshold-heartbeat {
  0%   { transform: scale(1); box-shadow: 0 0 2px rgba(231,76,60,0.4); }
  10%  { transform: scale(1.15); box-shadow: 0 0 10px rgba(231,76,60,1); }
  20%  { transform: scale(1); }
  30%  { transform: scale(1.15); box-shadow: 0 0 8px rgba(231,76,60,0.8); }
  40%  { transform: scale(1); }
  100% { transform: scale(1); box-shadow: 0 0 2px rgba(231,76,60,0.4); }
}

@keyframes status-threshold-heartbeat-strong {
  0%   { transform: scale(1); box-shadow: 0 0 2px rgba(231,76,60,0.4); filter: brightness(1); }
  8%   { transform: scale(0.92); box-shadow: 0 0 1px rgba(231,76,60,0.3); filter: brightness(0.9); }
  16%  { transform: scale(1.18); box-shadow: 0 0 12px rgba(231,76,60,1); filter: brightness(1.2); }
  24%  { transform: scale(0.96); box-shadow: 0 0 4px rgba(231,76,60,0.6); filter: brightness(1); }
  32%  { transform: scale(1.12); box-shadow: 0 0 8px rgba(231,76,60,0.8); filter: brightness(1.15); }
  40%  { transform: scale(1); box-shadow: 0 0 2px rgba(231,76,60,0.4); filter: brightness(1); }
  100% { transform: scale(1); box-shadow: 0 0 2px rgba(231,76,60,0.4); filter: brightness(1); }
}`;
  }

  function targetDescription(settings) {
    if (settings.targetMode === "all") {
      return "すべてのステータス";
    }
    if (settings.targetMode === "single") {
      return `${settings.indexes[0]}番目のステータス`;
    }
    return `${settings.indexes.join("・")}番目のステータス`;
  }

  function generateCss(settings) {
    const bases = makeBases(settings);
    const low = makeSelectors(bases, "low", settings);
    const mid = makeSelectors(bases, "mid", settings);
    const normalFix = makeSelectors(bases, "normalFix", settings);
    const animationValue = animationValues[settings.animationMode];

    const normalBackground = settings.useNormalColor
      ? "var(--status-threshold-normal-color, var(--gauge-color, rgb(245, 245, 245)))"
      : "var(--gauge-color, rgb(245, 245, 245))";

    const rootLines = [
      "/* --- 色設定 --- */",
      ":root {",
    ];

    if (settings.useNormalColor) {
      rootLines.push(`  --status-threshold-normal-color: ${settings.normalColor};`);
    } else {
      rootLines.push("  /* --status-threshold-normal-color: #2ecc71; */");
    }

    rootLines.push(
      `  --status-threshold-mid-color: ${settings.midColor};`,
      `  --status-threshold-low-color: ${settings.lowColor};`,
      "",
      `  --status-threshold-alert-mode: ${animationValue};`,
      `  --status-threshold-alert-delay: ${settings.animationDelay}s;`,
      "}"
    );

    const shouldWriteNormalBackground =
      settings.pageType === "status-all" || settings.useNormalColor;

    const defaultBlock = shouldWriteNormalBackground
      ? renderBlock(bases, [
          `background: ${normalBackground} !important;`,
        ])
      : null;

    const midBlock = renderBlock(mid, [
      `background: var(--status-threshold-mid-color, ${settings.midColor}) !important;`,
    ]);

    const lowBlock = renderBlock(low, [
      `background: var(--status-threshold-low-color, ${settings.lowColor}) !important;`,
      "animation: var(--status-threshold-alert-mode, none);",
      `animation-delay: var(--status-threshold-alert-delay, ${settings.animationDelay}s);`,
    ]);

    const normalFixBlock = shouldWriteNormalBackground
      ? renderBlock(normalFix, [
          `background: ${normalBackground} !important;`,
        ])
      : null;

    const heading = `/*
CCFOLIA ステータス閾値CSS
表示形式：${pageTypeDescription(settings.pageType)}
対象：${targetDescription(settings)}
危険域：${settings.lowMax}%以下
注意域：${settings.midMax}%以下
作成元：https://aoko2477.github.io/ccfolia-css/tools/threshold-css-generator/
*/`;

    const basePreset = baseCssPresets[settings.pageType]?.[settings.baseCss];
    const baseImport = basePreset
      ? `@import url("${basePreset.url}");`
      : null;

    return [
      ...(baseImport ? [baseImport, ""] : []),
      heading,
      "",
      rootLines.join("\n"),
      "",
      animationKeyframes(),
      ...(defaultBlock ? ["", "/* ===== 通常色 ===== */", defaultBlock] : []),
      "",
      `/* ===== 注意域（${settings.lowMax}%超〜${settings.midMax}%以下） ===== */`,
      midBlock,
      "",
      `/* ===== 危険域（${settings.lowMax}%以下） ===== */`,
      lowBlock,
      ...(normalFixBlock
        ? ["", `/* ===== 通常色補正（${settings.midMax}%超） ===== */`, normalFixBlock]
        : []),
      "",
    ].join("\n");
  }

  function showError(message) {
    els.errorBox.textContent = message;
    els.errorBox.hidden = false;
  }

  function clearError() {
    els.errorBox.hidden = true;
    els.errorBox.textContent = "";
  }

  function updatePreview() {
    let settings;
    try {
      settings = validateAndReadSettings();
      clearError();
    } catch {
      return;
    }

    els.previewTarget.textContent =
      `${pageTypeDescription(settings.pageType)}・${targetDescription(settings)}`;
    els.previewMid.style.width = `${settings.midMax}%`;
    els.previewLow.style.width = `${settings.lowMax}%`;
    els.previewMidLabel.textContent = `${settings.midMax} / 100`;
    els.previewLowLabel.textContent = `${settings.lowMax} / 100`;

    const normalColor = settings.useNormalColor ? settings.normalColor : "#6a6a6a";
    els.previewNormal.style.background = normalColor;
    els.previewMid.style.background = settings.midColor;
    els.previewLow.style.background = settings.lowColor;

    els.previewLow.style.animation = "none";
    void els.previewLow.offsetWidth;

    const previewAnimations = {
      none: "none",
      alert: "preview-alert 0.6s ease-out 2",
      blink: "preview-blink 1s linear infinite",
      heartbeat: "preview-heartbeat 1.6s ease-in-out infinite",
      "heartbeat-strong": "preview-heartbeat-strong 1.4s ease-in-out infinite",
    };

    els.previewLow.style.animation = previewAnimations[settings.animationMode];
  }

  function generate() {
    try {
      const settings = validateAndReadSettings();
      const css = generateCss(settings);

      els.cssOutput.value = css;
      els.outputStatus.textContent = "作成済み";
      els.outputStatus.classList.add("is-ready");
      els.copyButton.disabled = false;
      els.downloadButton.disabled = false;
      clearError();
      updatePreview();
    } catch (error) {
      showError(error instanceof Error ? error.message : "入力内容を確認してください。");
    }
  }

  async function copyCss() {
    if (!els.cssOutput.value) return;

    try {
      await navigator.clipboard.writeText(els.cssOutput.value);
      const original = els.copyButton.textContent;
      els.copyButton.textContent = "コピーしました";
      setTimeout(() => {
        els.copyButton.textContent = original;
      }, 1400);
    } catch {
      els.cssOutput.select();
      document.execCommand("copy");
    }
  }

  function downloadCss() {
    if (!els.cssOutput.value) return;

    let settings;
    try {
      settings = validateAndReadSettings();
    } catch {
      return;
    }

    const target =
      settings.targetMode === "all"
        ? "all"
        : settings.indexes.join("-");

    const filename = `ccfolia-${settings.pageType}-threshold-${target}.css`;
    const blob = new Blob([els.cssOutput.value], { type: "text/css;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function reset() {
    els.pageTypeOptions.forEach((radio) => {
      radio.checked = radio.value === defaults.pageType;
    });

    els.baseCssOptions.forEach((radio) => {
      radio.checked = radio.value === defaults.baseCss;
    });

    els.targetModes.forEach((radio) => {
      radio.checked = radio.value === defaults.targetMode;
    });

    els.singleIndex.value = defaults.singleIndex;
    els.multipleIndexes.value = defaults.multipleIndexes;
    els.lowMax.value = defaults.lowMax;
    els.midMax.value = defaults.midMax;
    els.normalColor.value = defaults.normalColor;
    els.normalColorText.value = defaults.normalColor;
    els.useNormalColor.checked = defaults.useNormalColor;
    els.midColor.value = defaults.midColor;
    els.midColorText.value = defaults.midColor;
    els.lowColor.value = defaults.lowColor;
    els.lowColorText.value = defaults.lowColor;
    els.animationMode.value = defaults.animationMode;
    els.animationDelay.value = defaults.animationDelay;

    els.cssOutput.value = "";
    els.copyButton.disabled = true;
    els.downloadButton.disabled = true;
    els.outputStatus.textContent = "未作成";
    els.outputStatus.classList.remove("is-ready");

    clearError();
    updatePageType();
    updateTargetFields();
    updatePreview();
  }

  els.pageTypeOptions.forEach((radio) => {
    radio.addEventListener("change", updatePageType);
  });

  els.targetModes.forEach((radio) => {
    radio.addEventListener("change", updateTargetFields);
  });

  [
    els.singleIndex,
    els.multipleIndexes,
    els.lowMax,
    els.midMax,
    els.useNormalColor,
    els.animationMode,
    els.animationDelay,
  ].forEach((element) => {
    element.addEventListener("input", updatePreview);
    element.addEventListener("change", updatePreview);
  });

  [
    [els.normalColor, els.normalColorText],
    [els.midColor, els.midColorText],
    [els.lowColor, els.lowColorText],
  ].forEach(([picker, text]) => {
    picker.addEventListener("input", () => {
      syncColorPair(picker, text, "picker");
      updatePreview();
    });
    text.addEventListener("input", () => {
      syncColorPair(picker, text, "text");
      updatePreview();
    });
  });

  els.generateButton.addEventListener("click", generate);
  els.resetButton.addEventListener("click", reset);
  els.copyButton.addEventListener("click", copyCss);
  els.downloadButton.addEventListener("click", downloadCss);

  updatePageType();
  updateTargetFields();
  updatePreview();
})();
