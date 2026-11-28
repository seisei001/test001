# 地球の基準データ作り(気候シミュレーターを模倣させる元)。ユーザー指示 11-29 02:31「地球の世界地図と降雨量の分布と地形を先に作る。365日分」。
# 入力(NOAAから取得。公開データ): CPC全球日降水(0.5度・陸のみ・2015,2016) https://downloads.psl.noaa.gov/Datasets/cpc_global_precip/precip.YYYY.nc
#   標高 ETOPO 2022 60秒 https://www.ngdc.noaa.gov/thredds/fileServer/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc
# 出力: earth05.npz(z=標高m, zsd=荒さ, P=2年×365日×360×720 mm/日)。0.5度・北が上・経度-180〜180。注意: CPCは陸のみ(海の雨は無い)。緯度は最初から北が上(反転しない)。
import numpy as np, xarray as xr, sys
d = xr.open_dataset(sys.argv[1]); z = d['z'].values.astype(np.float32); lat = d['lat'].values
if lat[0] < lat[-1]: z = z[::-1]
b = 30; zz = z.reshape(360, b, 720, b).mean(axis=(1, 3)); zsd = z.reshape(360, b, 720, b).std(axis=(1, 3))
P = np.array([xr.open_dataset(f)['precip'].values[:365] for f in sys.argv[2:4]]).astype(np.float32)
P = np.roll(P, 360, axis=3)                                   # 経度0〜360 → -180〜180
np.savez_compressed(sys.argv[4], z=zz, zsd=zsd, P=P.astype(np.float16))
