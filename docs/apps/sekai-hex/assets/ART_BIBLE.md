# 世界ハニカム 絵の規格書(v1)
決定日 2026-11-03。AIに絵を作らせる時は、必ず下の「共通の指示文」を先頭に付け、物の名前と数だけを変える。

## 1. 固定する決まり
- カメラ: 斜め上45度から見下ろす(地図の傾きと同じ)。真上・真横・等角(ひし形タイル)は不可。
- 光: 左上から。影は物の右下側に落ちる向きの陰影を絵の中に描く。地面に落ちる影は描かない(地図側で付ける)。
- 背景: 真っ白(#FFFFFF)の単色。影・床・枠・文字・説明は入れない。
- 画風: ゲーム用の手描き風イラスト。輪郭は暗い茶〜こげ茶の細い線。彩度は中くらい。色数は多すぎない。
- 1枚の紙: 2048×2048、部品は最大6個(3列×2行)、部品の間は広く空ける、部品が枠からはみ出さない。
- 部品の大きさ: 1個あたり700px以上(最低400px)。
- 向き: 建物・乗り物・動物は右斜め前向き。左右対称の物は正面でよい。

## 2. 大きさの目安(同じ紙の中でも比率を守る)
人=1(身長1.7m相当) / 馬=1.6 / 家=3〜4 / 木=3〜6 / 城門=5 / 城=10〜15 / 船(小)=3 / 船(大)=10 / ドラゴン=6。
指示文には「大きさの比率は人を1として…」と入れる。

## 3. 遠景用と近景用を分けて作る
- 近景用(今のもの): 細部まで描く。
- 遠景用(新規): 輪郭を太く、細部を省き、色を大きなかたまりで。山・森・街・城・港・畑・砂丘・氷原など。画面で30〜60pxになっても見分けられること。
- 見分けの基本は輪郭(シルエット)。同じ高さ・同じ幅の物を並べない。

## 4. 気候と季節
- 植物・動物・モンスターは気候ごとに1組(別紙の表)。季節は温帯林・草原だけ春夏秋冬の4通り。他は1通り。
- 同じ種類(例: 森)は、気候で見た目を変えるが、ゲーム上の効果は同じ。

## 5. 受け入れ検査(1枚ごと)
1. カメラが斜め上45度か 2. 光が左上か 3. 背景が白一色か 4. 大きさの比率が合うか 5. 輪郭が暗い細線か
→ 5項目のうち1つでも外れたら作り直し。作り直しの理由は記録して、次の指示文に足す。
- 1種類につき8〜16枚作らせて、良い物を選ぶ。まず10個だけ地図に入れて画面で確認してから、全部を作る。

## 6. 共通の指示文(毎回これを先頭に付ける)
```
Game illustration asset sheet for a fantasy strategy map. Hand-painted game art, thin dark-brown outlines, medium saturation, limited palette. Camera: three-quarter view looking down at about 45 degrees (not isometric diamond, not top-down, not side-on). Light comes from the upper left; shading is painted inside the object, no cast shadow on the ground. Pure white background (#FFFFFF), no floor, no frame, no text, no labels. 2048x2048 canvas, 3 columns x 2 rows, exactly 6 separate items, wide empty space between items, nothing touching the edges. Each item at least 700 px. Keep relative sizes consistent: a human is 1, a horse 1.6, a house 3-4, a tree 3-6. Facing right-front. Items: [ここに6個の名前]
```
