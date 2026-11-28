# 気候シミュレーター 簡易版(基本値)。ユーザー指示 11-28 19:22「気候シミュレーターで水を作る。初期値は真剣に作る。簡易版」。
# 入力: 世界データ world-data.png(R=高さ×2.55, G=群系 0=海, B=国)。出力: 月ごとの気温・風・降水(水の発生)。
# 仕様の根拠: 「気候を作る入力と手順」(ラグ 気候シミュレーターの検討)。入力=緯度・標高・海の位置・風。
#   気温=緯度の曲線−標高×6.5度/km+季節の振れ(内陸ほど大きい)。降水=海から蒸発した水蒸気を風で運び、冷えると雨になる(山の雨と雨陰も同じ仕組みで出る)。
# 係数はすべて【仮】(地球の帯平均に似せた目分量。ファンタジー世界向けに後で調整する)。実測に合わせた当てはめではない。
# 使い方: python3 -I climate_base.py <world-data.png> <出力ディレクトリ>
import sys, os, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi

CIRC_KM = 8192.0                  # 世界の周長(世界生成の基準)
ELEV_TOP_KM = 6.0                 # 【仮】高さ100(最高峰)=標高6km。陸の下端(高さ20.3)=0km
LAPSE = 6.5                       # 1km上がるごとに下がる気温(度)
KMD = 1.0                         # 【仮】倍率の記録用

def load(path):
    a = np.array(Image.open(path)).astype(np.float32)
    R, G = a[..., 0], a[..., 1]
    land = R >= 51      # 陸=高さが海面(R=49)より上。群系0の陸画素(湖など約2%)も陸に入れる(11-29訂正: 旧は群系>0を条件にして内陸の穴を海扱いしていた)
    H = R / 2.55
    # 半分の解像度(700×350)で計算する。1画素≒11.7km
    h2, w2 = a.shape[0] // 2, a.shape[1] // 2
    land2 = land[:h2 * 2, :w2 * 2].reshape(h2, 2, w2, 2).mean(axis=(1, 3)) > 0.5
    H2 = H[:h2 * 2, :w2 * 2].reshape(h2, 2, w2, 2).mean(axis=(1, 3))
    return land2, H2

def lat_rows(h):
    return 90 - 180 * (np.arange(h) + 0.5) / h            # 各行の緯度(度)

def interp_lat(latabs, xs, ys):
    return np.interp(latabs, xs, ys)

def sea_level_mean_T(lat):                                  # 【仮】年平均気温(海面・帯平均。地球に似せた)
    return interp_lat(np.abs(lat), [0, 15, 30, 45, 60, 75, 90], [27, 26, 20, 8, -2, -17, -25])

def qsat(T):                                                # 飽和水蒸気量(相対値。25度で1。1度あたり約7%)
    return np.exp(0.07 * (T - 25.0))

def wind_field(lat, phi0):
    """風(1ステップに動くマス数)。u=東向き正, v=北向き正。【仮】3つの対流セルの帯: 貿易風(東風)・偏西風・極東風。帯は夏の半球へずれる"""
    le = np.abs(lat - phi0)
    sg = np.sign(lat - phi0)
    u = interp_lat(le, [0, 15, 30, 45, 60, 75, 90], [-1.2, -1.6, 0.0, 1.6, 1.3, -0.8, -0.5])
    # 南北: 熱帯は収束帯へ、中緯度は極向き、極は赤道向き
    v = (-sg * 0.9 * np.exp(-(le / 18.0) ** 2)
         + sg * 0.12 * np.exp(-((le - 45) / 15.0) ** 2)
         - sg * 0.4 * np.exp(-((le - 80) / 10.0) ** 2))
    return u, v

def rain_weights(lat, phi0):
    """降水を強める帯(収束帯・低気圧の帯)と弱める帯(亜熱帯の下降気流)。【仮】"""
    le = np.abs(lat - phi0)
    itcz = np.exp(-(le / 9.0) ** 2)
    storm = np.exp(-((np.abs(lat) - 52) / 10.0) ** 2)
    subs = np.exp(-((np.abs(lat) - 28) / 9.0) ** 2)
    return itcz, storm, subs

def step_advect(q, u, v, cosl, cache):
    """半ラグランジュ法で水蒸気を風上から運ぶ(経度は周期・南北は端で反射)"""
    h, w = q.shape
    yy, xx = cache
    dx = np.clip(u / cosl, -3, 3)                         # 緯度が高いほど経度のマスは狭い
    sx = (xx - dx) % w
    sy = np.clip(yy - (-v), 0, h - 1)                     # 行は上が北なので、北向きv>0は行が減る向き
    qp = np.concatenate([q[:, -2:], q, q[:, :2]], axis=1)
    return ndi.map_coordinates(qp, [sy, sx + 2], order=1, mode='nearest')

def simulate(land, H, nyears=2, steps_first=420, steps_month=150, verbose=True):
    h, w = land.shape
    lat = lat_rows(h)
    latc = lat[:, None] * np.ones((1, w))
    cosl = np.clip(np.cos(np.deg2rad(latc)), 0.2, 1)
    cell_km = CIRC_KM / w                                  # 1マス(赤道で)のkm
    elev = np.where(land, np.clip((H - 20.3) / (100 - 20.3), 0, 1) * ELEV_TOP_KM, 0.0)
    dist_km = ndi.distance_transform_edt(land) * cell_km   # 海からの距離(陸の上)
    cont = np.where(land, 1 - np.exp(-dist_km / 600.0), 0.0)   # 内陸度 0(海岸)〜1(奥地)
    Tmean = sea_level_mean_T(latc)
    yy, xx = np.meshgrid(np.arange(h, dtype=np.float32), np.arange(w, dtype=np.float32), indexing='ij')
    cache = (yy, xx)
    area = np.cos(np.deg2rad(latc))
    q = qsat(Tmean) * 0.5
    Pema = np.where(land, 0.002, 0.006) * np.ones((h, w))        # 最近の雨の指数平均(陸の蒸発の湿り気に使う)
    T_all, P_all, E_all, U_all, V_all = [], [], [], [], []
    total_steps = steps_first
    for yr in range(nyears):
        for m in range(1, 13):
            s = np.sin(2 * np.pi * (m - 4) / 12.0)          # 北の夏(7月)に1
            phi0 = 6.0 * s                                  # 収束帯・風の帯の中心(夏の半球側へ寄る)
            amp = np.abs(latc) * (0.10 + 0.17 * cont)       # 季節の振れ(度)。内陸ほど大きい
            Tsl = Tmean + np.sign(latc) * amp * s           # 海面換算の気温
            Tair = Tsl - LAPSE * elev                       # 標高の分だけ下げる
            Tsea = np.maximum(Tsl, -1.8)
            u1, v1 = wind_field(lat, phi0)
            u = u1[:, None] * np.ones((1, w)); v = v1[:, None] * np.ones((1, w))
            # 地形の効き: 風は高い所で少し弱まる
            fric = 1.0 - 0.3 * np.clip(elev / ELEV_TOP_KM, 0, 1)
            u = u * fric; v = v * fric
            itcz1, storm1, subs1 = rain_weights(lat, phi0)
            itcz = itcz1[:, None]; storm = storm1[:, None]; subs = subs1[:, None]
            qs_air = qsat(Tair)
            qs_sea = qsat(Tsea)
            n = steps_first if (yr == 0 and m == 1) else steps_month
            Pacc = np.zeros((h, w)); Eacc = np.zeros((h, w)); k = 0
            for it in range(n):
                q = step_advect(q, u, v, cosl, cache)
                # 蒸発: 海は飽和の85%へ近づける。陸は気温が0度超でわずか(乾いた陸は蒸発が少ない)
                ev_o = np.where(~land, 0.12 * np.maximum(0.85 * qs_sea - q, 0), 0.0)
                # 陸の蒸発は、最近の雨(湿り気)に比例する=雨が降る所ほど蒸発して水が循環する(内陸への水の供給)
                wet = 0.25 + 0.75 * np.clip(Pema / 0.003, 0, 1)      # 土に残る水の分(雨が無くても少しは蒸発する)
                ev_l = np.where(land & (Tair > 0), 0.12 * wet * np.maximum(0.85 * qs_air - q, 0), 0.0)
                E = ev_o + ev_l
                q = q + E
                # 亜熱帯の下降気流は雨を弱める(下のr2)だけにして、水は消さない(水の収支を保つ)
                # 降水①: 飽和を超えた分(山で冷えれば自然に雨になり、風下では乾く=雨陰)
                excess = np.maximum(q - qs_air, 0)
                r1 = 0.6 * excess
                # 降水②: 相対湿度が高いほど降る基礎的な雨+収束帯・低気圧の帯の雨(下降気流の帯では弱める)
                rh = np.clip(q / qs_air, 0, 1.5)
                base = 0.05 * q * np.clip((rh - 0.40) / 0.5, 0, 1) ** 2
                r2 = base * (1 + 3.0 * itcz + 1.2 * storm) * (1 - 0.7 * subs)
                r2 = np.minimum(r2, np.maximum(q - r1, 0))
                P = r1 + r2
                q = q - P
                Pema = 0.985 * Pema + 0.015 * P
                if it >= n - 60:                            # 月の終わりの60ステップを平均して、その月の値にする
                    Pacc += P; Eacc += E; k += 1
            if yr == nyears - 1:
                T_all.append(Tair.astype(np.float32)); P_all.append((Pacc / k).astype(np.float32)); E_all.append((Eacc / k).astype(np.float32))
                U_all.append(u.astype(np.float32)); V_all.append(v.astype(np.float32))
            if verbose: print('year', yr + 1, 'month', m, 'steps', n, 'q平均', round(float(q.mean()), 3))
    return dict(q_last=q, Pema_last=Pema, T=np.array(T_all), P=np.array(P_all), E=np.array(E_all), U=np.array(U_all), V=np.array(V_all), area=area, land=land, elev=elev, lat=lat, cont=cont)

def calibrate(res, target_global_mm=1000.0):
    """降水の単位を「年間mm」にそろえる。【仮】全球平均が年1000mm(地球ぐらい)になるように1つの倍率で合わせる。形(どこに降るか)は変えない"""
    P = res['P']; area = res['area']
    glob = (P.sum(0) * area).sum() / area.sum()              # 12か月の合計の全球(面積重み)平均
    scale = target_global_mm / glob
    return scale

def pet_month(T):
    """蒸発して失われうる水(可能蒸発散・月mm)。【仮】気温だけの簡単な式: 気温が高いほど大きい"""
    return np.maximum(0, 4.0 * (T + 5.0))

def main(wd, out):
    os.makedirs(out, exist_ok=True)
    land, H = load(wd)
    res = simulate(land, H)
    scale = calibrate(res)
    P = res['P'] * scale                                    # 月ごとの降水(mm/月)。倍率は全球平均年1000mmに合わせた仮
    E = res['E'] * scale
    T = res['T']
    area = res['area']
    Pa = P.sum(0); Ta = T.mean(0)
    PET = np.stack([pet_month(T[i]) for i in range(12)]).sum(0)
    info = {
        'grid': list(land.shape), 'cell_km_equator': CIRC_KM / land.shape[1], 'scale_mm_per_unit': float(scale),
        'global_mean_precip_mm': float((Pa * area).sum() / area.sum()),
        'land_mean_precip_mm': float((Pa * area)[land].sum() / area[land].sum()),
        'ocean_mean_precip_mm': float((Pa * area)[~land].sum() / area[~land].sum()),
        'evap_over_precip_global': float((E.sum(0) * area).sum() / (P.sum(0) * area).sum()),
        'land_mean_T': float((Ta * area)[land].sum() / area[land].sum()),
        'land_frac_P_lt_250': float((Pa[land] < 250).mean()), 'land_frac_P_gt_2000': float((Pa[land] > 2000).mean()),
        'land_frac_arid_P_lt_half_PET': float((Pa[land] < 0.5 * PET[land]).mean()),
    }
    np.savez_compressed(out + '/climate_base.npz', T=(T * 10).astype(np.int16), P=(P * 10).astype(np.uint16), land=land, elev=res['elev'].astype(np.float16))
    json.dump(info, open(out + '/climate_base_info.json', 'w'), ensure_ascii=False, indent=1)
    np.save(out + '/_P.npy', P); np.save(out + '/_T.npy', T); np.save(out + '/_U.npy', res['U']); np.save(out + '/_V.npy', res['V'])
    print(json.dumps(info, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
