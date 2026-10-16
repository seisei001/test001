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
  tesseract.js@5.1.1 tesseract.js-core@5.1.0 @tesseract.js-data/jpn @tesseract.js-data/eng 2>&1 | tail -2
echo "OK: $WORK/lib"
