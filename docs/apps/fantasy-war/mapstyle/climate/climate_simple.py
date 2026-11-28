# 気候シミュレーター 簡易版(ガウス分布版)。ユーザー指示 11-29 01:53「簡易版でよい。計算いらん。分布の正規で計算しなよ」。
# 水の移流の計算はしない。緯度ごとの降水を「ガウス分布の山の重ね合わせ」で出し、山の風上・風下・内陸・標高は簡単な係数で補い、揺らぎもガウスで足す。
# 山の高さ・陸海・緯度だけが入力。1秒ほどで終わる。係数は【仮】(地球の公開値に目印を合わせた=赤道の山は約2000mm・北緯約6度、亜熱帯の極小は緯度20度付近)。
# 使い方: python3 -I climate_simple.py <world-data.png> <出力ディレクトリ> [seed]
import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import climate_base as cb
from scipy import ndimage as ndi

def G(x, mu, sd): return np.exp(-0.5 * ((x - mu) / sd) ** 2)

def zonal_precip(lat, c):
    """緯度ごとの年降水(mm)の基本の形=ガウスの山の重ね合わせ。cは収束帯の中心緯度。【仮】山の高さ・幅は目分量"""
    itcz = 1500 * G(lat, c, 7.5)                          # 赤道の多雨帯(ピークは約2000mmになる)
    mid = 700 * (G(np.abs(lat), 47.0, 11.0))              # 中緯度の低気圧の帯(南北とも)
    return 150 + itcz + mid                               # 150=どこにでも降る下限(極の乾燥)

def simulate(wd, seed=1):
    land, H = cb.load(wd)
    h, w = land.shape
    lat = cb.lat_rows(h); latc = lat[:, None] * np.ones((1, w))
    cell_km = cb.CIRC_KM / w
    elev = np.where(land, np.clip((H - 20.3) / (100 - 20.3), 0, 1) * cb.ELEV_TOP_KM, 0.0)
    dist_km = ndi.distance_transform_edt(land) * cell_km
    cont = np.where(land, 1 - np.exp(-dist_km / 600.0), 0.0)
    Tmean = cb.sea_level_mean_T(latc)
    # 風の向き(東向き=+1): 貿易風は西向き、偏西風は東向き、極は西向き(3つの対流セルの帯)
    wdir = np.where(np.abs(lat) < 28, -1, np.where(np.abs(lat) < 62, 1, -1))[:, None] * np.ones((1, w))
    Hs = ndi.gaussian_filter(H, 1.5)
    dHdx = (np.roll(Hs, -1, 1) - np.roll(Hs, 1, 1)) / 2.0  # 東向きの高さの増え方
    lift = np.clip(wdir * dHdx / 4.0, -1, 2)                # 風が登る坂=+、降る坂=-
    # 風下の雨陰: 風上で登った分を、風下へ数マス先まで引きずる
    up = np.clip(lift, 0, 2)
    sh = np.zeros_like(up)
    for k, wk in ((2, .5), (4, .4), (7, .3), (11, .2), (16, .1)):
        for sgn in (-1, 1):
            m = (wdir == sgn)
            sh += np.where(m, wk * np.roll(up, sgn * k, 1), 0)
    orog = 1 + 0.8 * np.clip(lift, 0, 2) + 0.4 * np.clip(lift, -1, 0) - 0.45 * np.clip(sh, 0, 1.4)
    orog = np.clip(orog, 0.15, 3.0)
    elevf = np.exp(-elev / 4.0)                              # 高い所は空気が乾く
    contf = np.where(land, 0.45 + 0.55 * np.exp(-dist_km / 1500.0), 1.0)   # 内陸ほど水蒸気が減る
    rs = np.random.RandomState(seed)
    noise = ndi.gaussian_filter(rs.randn(h, w), 5); noise = noise / noise.std()
    flut = np.exp(0.18 * noise)                              # ガウスの揺らぎ(1.0を中心に約±18%)
    area = np.cos(np.deg2rad(latc)).clip(0.05, None)
    T_all, P_all = [], []
    for m in range(1, 13):
        s = np.sin(2 * np.pi * (m - 4) / 12.0)
        c = 6.0 + 6.0 * s                                    # 収束帯の中心: 年平均で北緯6度・夏の半球側へ±8度
        Pz = zonal_precip(latc, c) / 12.0
        P = Pz * np.where(land, orog * elevf * contf, 1.0) * flut
        amp = np.abs(latc) * (0.10 + 0.17 * cont)
        Tsl = Tmean + np.sign(latc) * amp * s
        T_all.append((Tsl - cb.LAPSE * elev).astype(np.float32)); P_all.append(P.astype(np.float32))
    P = np.array(P_all); T = np.array(T_all)
    scale = 1000.0 / ((P.sum(0) * area).sum() / area.sum())   # 全球平均を年1000mmに合わせる(仮の倍率)
    P = P * scale
    return land, T, P, scale

def main(wd, out, seed=1):
    os.makedirs(out, exist_ok=True)
    land, T, P, scale = simulate(wd, seed)
    h, w = land.shape; lat = cb.lat_rows(h); area = (np.cos(np.deg2rad(lat))[:, None] * np.ones((1, w))).clip(0.05, None)
    Pa = P.sum(0)
    np.savez_compressed(out + '/climate_simple.npz', T=(T * 10).astype(np.int16), P=(P * 10).astype(np.uint16), land=land)
    np.save(out + '/_P.npy', P); np.save(out + '/_T.npy', T)
    np.save(out + '/_U.npy', np.zeros_like(P)); np.save(out + '/_V.npy', np.zeros_like(P))
    wm = lambda x, m: float((x * area)[m].sum() / area[m].sum())
    info = {'method': 'gauss', 'scale': float(scale), 'global_mean_precip_mm': wm(Pa, np.ones_like(land)), 'land_mean_precip_mm': wm(Pa, land), 'ocean_mean_precip_mm': wm(Pa, ~land)}
    json.dump(info, open(out + '/climate_simple_info.json', 'w'), ensure_ascii=False, indent=1)
    print(info)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 1)
