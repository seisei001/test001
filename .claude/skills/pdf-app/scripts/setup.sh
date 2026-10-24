#!/bin/sh
# PDFアプリの動作確認用の部品を用意する(外部CDNに繋がらない環境でも、npmから同じ部品を取得して差し替えるため)
# 使い方: sh .claude/skills/pdf-app/scripts/setup.sh   (環境変数 PDFAPP_WORK で作業フォルダを変更可。既定: /tmp/pdfapp-work)
set -e
WORK="${PDFAPP_WORK:-/tmp/pdfapp-work}"
mkdir -p "$WORK/lib" && cd "$WORK/lib"
[ -f package.json ] || npm init -y >/dev/null
# アプリが読み込んでいる版と同じにする(docs/apps/pdf-editor/index.html の <script> / FONT_URL / TESS_URL と一致させること)
npm i pdf-lib@1.17.1 @pdf-lib/fontkit@1.1.1 pdfjs-dist@3.11.174 \
  @expo-google-fonts/m-plus-1p@0.4.2 \
  @expo-google-fonts/sawarabi-mincho@0.4.1 \
  @expo-google-fonts/m-plus-rounded-1c@0.4.1 \
  tesseract.js@5.1.1 tesseract.js-core@5.1.0 @tesseract.js-data/jpn @tesseract.js-data/eng 2>&1 | tail -2
npm i onnxruntime-web@1.22.0 pdfmarkdown-ppocrv5-models@1.0.0 jsqr@1.4.0 @neslinesli93/qpdf-wasm@0.3.0 2>&1 | tail -2   # 高精度OCR(PaddleOCR PP-OCRv5)
# 最高精度OCR(NDLOCR-Lite)のモデル: テストではGitHub rawの代わりにここから返す(アプリが使うコミットと同じもの)
[ -d "$WORK/ndl/ndlocr-lite" ] || { mkdir -p "$WORK/ndl" && (cd "$WORK/ndl" && git clone --depth 1 https://github.com/ndl-lab/ndlocr-lite 2>&1 | tail -1); }
echo "OK: $WORK/lib"
