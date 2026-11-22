# 川と湖を、地図と同じ位置(UV同位置)の透明な層(RGBA)にする。川=流量の対数で太さ、湖=青灰の面+細い墨の縁。山の上には描かない。
import numpy as np, cv2
from scipy import ndimage as ndi

def over(rgb, a, col, b):
    oa = b + a * (1 - b)
    out = (np.array(col, np.float32) * b[..., None] + rgb * (a * (1 - b))[..., None]) / np.maximum(oa, 1e-6)[..., None]
    return out, oa

def make(D, lake, land0, H, out, seed=1, qpct=97.0, S=3):
    H0, W0 = D.shape
    lkz = cv2.GaussianBlur(lake.astype(np.float32), (0, 0), 1.5)
    lki = np.clip(lkz * 1.6 - 0.25, 0, 1); ring = np.clip(1 - np.abs(lkz - 0.5) * 5, 0, 1)
    ok = land0 & ~ndi.binary_dilation(lake, iterations=1)
    qmin = float(np.percentile(D[ok & (D > 0)], qpct)); qmax = float(D[ok].max())
    ys, xs = np.nonzero(ok & (D >= qmin))
    lq = np.log10(D[ys, xs] / qmin) / max(np.log10(max(qmax, qmin * 10) / qmin), 1e-3)
    rvc = np.zeros((H0 * S, W0 * S), np.float32)
    for y, x, t in zip(ys, xs, lq):
        cv2.circle(rvc, (int(x * S + S // 2), int(y * S + S // 2)), int(round((0.45 + 1.15 * t ** 0.7) * S / 2 + 0.3)), 1.0, -1, cv2.LINE_AA)
    rvc = cv2.GaussianBlur(rvc, (0, 0), 1.6 * S / 3); rvc = np.clip(rvc * 1.6, 0, 1)
    rv = cv2.resize(rvc, (W0, H0), interpolation=cv2.INTER_AREA) * (land0 | lake)
    hi = np.clip((H - 48.0) / 12, 0, 1); rv = rv * (1 - hi) * (1 - lki)       # 山の上・湖の中には描かない
    rgb = np.zeros((H0, W0, 3), np.float32); a = np.zeros((H0, W0), np.float32)
    rgb, a = over(rgb, a, (120, 176, 196), 0.92 * lki)
    rgb, a = over(rgb, a, (70, 90, 100), 0.6 * ring * (lkz > 0.05))
    rgb, a = over(rgb, a, (60, 104, 140), 0.85 * rv)
    O = np.dstack([rgb[..., ::-1], a * 255]).astype(np.uint8)       # BGRA
    cv2.imwrite(out, O)
    return {'川の画素': int((rv > 0.3).sum()), '湖の画素': int(lki.__gt__(0.5).sum()), '川のしきい値(流量)': round(qmin, 3), '最大': round(qmax, 1)}
