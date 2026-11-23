# 面ごとのUV展開(伸び率そのまま)。各三角形を3Dの実寸のまま平らに開き、1枚の絵(アトラス)に並べる。
# 絵はその展開の上で作る: 色=地図の位置から引く(群系・高さ・雪)、細かい模様=3Dの位置で作る(斜面で伸びない)。  11-22 21:50 ユーザー指示
import numpy as np, cv2
from scipy import ndimage as ndi

def build(P, Z, F, Tbase_bgr, VS=1.1, S=2048, pad=2, seed=1, noise_amp=0.30, mask=None):
    """P:(n,2)点の地図位置 Z:(n,)高さ F:(m,3)面の点番号 Tbase_bgr:(H,W,3)色の地図(模様なし)。
    返す: アトラス画像(S,S,3 uint8 BGR)、面ごとの3頂点のUV (m,3,2)、密度(3D1単位あたりの画素)"""
    H0, W0 = Tbase_bgr.shape[:2]
    A = np.stack([P[F, 0], P[F, 1], Z[F] * VS], axis=2)       # 3D(x, y, 高さ*VS)
    # 各三角形を平らに: 一番長い辺をx軸に
    m = len(F); L2 = np.zeros((m, 3, 2)); 
    for i in range(m):
        a, b, c = A[i]; es = [np.linalg.norm(b - a), np.linalg.norm(c - b), np.linalg.norm(a - c)]
        k = int(np.argmax(es)); pts = [a, b, c]; a, b, c = pts[k], pts[(k + 1) % 3], pts[(k + 2) % 3]
        e1 = b - a; l = np.linalg.norm(e1) + 1e-9; u = e1 / l; w = c - a; cx = w @ u; cy = np.linalg.norm(w - cx * u)
        q = np.array([[0, 0], [l, 0], [cx, cy]]); order = [(3 - k) % 3, (4 - k) % 3, (5 - k) % 3]   # 元の頂点順に戻す
        out = np.zeros((3, 2)); out[k] = q[0]; out[(k + 1) % 3] = q[1]; out[(k + 2) % 3] = q[2]; L2[i] = out
    mn = L2.min(1); mx = L2.max(1); bw = mx[:, 0] - mn[:, 0]; bh = mx[:, 1] - mn[:, 1]
    for dens in np.arange(2.0, 0.2, -0.05):                                   # 収まる最大の密度を探す
        w_ = np.ceil(bw * dens).astype(int) + 2 * pad + 1; h_ = np.ceil(bh * dens).astype(int) + 2 * pad + 1
        order = np.argsort(-h_); X = np.zeros(m, int); Y = np.zeros(m, int); x = y = row = 0; ok = True
        for i in order:
            if x + w_[i] > S: x = 0; y += row; row = 0
            if y + h_[i] > S: ok = False; break
            X[i], Y[i] = x, y; x += w_[i]; row = max(row, h_[i])
        if ok: break
    if not ok: raise RuntimeError(f'アトラスに収まらない bw最大{bw.max():.1f} bh最大{bh.max():.1f} nan{np.isnan(L2).sum()} 面{m} 最終密度{dens:.2f} y{y} S{S} w_max{w_.max()} h_max{h_.max()}')
    AX = np.full((S, S), -1, np.float32); AY = np.full((S, S), -1, np.float32); AZ = np.full((S, S), 0, np.float32)
    P3 = np.zeros((S, S, 3), np.float32)
    uvs = np.zeros((m, 3, 2), np.float32)
    for i in range(m):
        x0, y0 = X[i], Y[i]
        gx = (np.arange(w_[i]) - pad + 0.5) / dens + mn[i, 0]; gy = (np.arange(h_[i]) - pad + 0.5) / dens + mn[i, 1]
        GX, GY = np.meshgrid(gx, gy)
        p0, p1, p2 = L2[i]; d = (p1[1] - p2[1]) * (p0[0] - p2[0]) + (p2[0] - p1[0]) * (p0[1] - p2[1])
        if abs(d) < 1e-9: continue
        l0 = ((p1[1] - p2[1]) * (GX - p2[0]) + (p2[0] - p1[0]) * (GY - p2[1])) / d
        l1 = ((p2[1] - p0[1]) * (GX - p2[0]) + (p0[0] - p2[0]) * (GY - p2[1])) / d
        l2 = 1 - l0 - l1
        Q = l0[..., None] * A[i, 0] + l1[..., None] * A[i, 1] + l2[..., None] * A[i, 2]   # 3Dの位置(外側は外挿)
        P3[y0:y0 + h_[i], x0:x0 + w_[i]] = Q
        uvs[i] = np.stack([(x0 + pad + (L2[i][:, 0] - mn[i, 0]) * dens) / S, 1 - (y0 + pad + (L2[i][:, 1] - mn[i, 1]) * dens) / S], 1)
    used = (P3 != 0).any(2)
    xm = np.clip(P3[..., 0], 0, W0 - 1.001); ym = np.clip(P3[..., 1], 0, H0 - 1.001)
    col = cv2.remap(Tbase_bgr.astype(np.float32), xm, ym, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    # 細かい模様は3Dの位置で作る(斜面で伸びない)。3段の値ノイズ
    rs = np.random.RandomState(seed + 7); nz = np.zeros((S, S), np.float32)
    for cell, amp in ((3.0, 0.5), (9.0, 1.2), (24.0, 1.6)):
        g = rs.randn(int(W0 / cell) + 3, int(H0 / cell) + 3, int(130 / cell) + 3).astype(np.float32)
        co = np.stack([P3[..., 0] / cell, P3[..., 1] / cell, P3[..., 2] / cell]).reshape(3, -1)
        nz += ndi.map_coordinates(g, co, order=1, mode='nearest').reshape(S, S) * amp
    nz /= (np.abs(nz[used]).max() + 1e-6)
    out = np.clip(col * (1 + noise_amp * nz[..., None]), 0, 255)
    out[~used] = (206, 223, 235)[::-1]
    # 陸の透明度(平坦な絵の陸の縁)。立体の縁は面でなく絵の海岸線で決める
    al = cv2.remap(mask.astype(np.float32), xm, ym, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE) if mask is not None else np.ones((S, S), np.float32)
    al = np.where(used, al, 0)
    return out.astype(np.uint8), uvs, float(dens), np.clip(al * 255, 0, 255).astype(np.uint8)
