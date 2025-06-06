/* eslint-disable */
import {apiKey, default_domain, getDynData} from './api';
/*
    subject id
        subcat 26 : Indeks Pembangunan Manusia var 37 : IPM
            vervar : wilayah 7106
        subcat 12 : Kependudukan var 45: jumlah penduduk
            vervar : kecamatan 7106000
        subcat 12 : Kependudukan var 85: Sex Ratio
            vervar : kecamatan 7106000
        subcat 6 : tenaga kerja var 70: TPT
        vervar : wilayah 7106
        subcat 23 : Kemiskinan var 44: Jumlah Penduduk Miskin
            vervar : wilayah 7106
        subcat 23 : Kemiskinan var 47: Presentase Penduduk Miskin
            vervar : wilayah 7106
        subcat 11: PDRB var 62 : PDRB Kabupaten Atas Dasar Harga Berlaku Menurut Lapangan Usaha
            vervar: PDRB total 8
        subcat 11: PDRB var 65 : PDRB Kabupaten Minahasa Utara Atas Dasar Harga Konstan Menurut Lapangan Usaha
            vervar: PDRB total 8

    tahun :
        2010 -> 110
        2020 -> 120

    turtahun = 0
*/
type TypeKey =
  | 'jp'
  | 'sr'
  | 'tpak'
  | 'ipm'
  | 'ahk'
  | 'hls'
  | 'ipm'
  | 'ahk'
  | 'hls'
  | 'rrls'
  | 'ppkp'
  | 'tpt'
  | 'jpm'
  | 'ppm'
  | 'ikk'
  | 'lpe'
  | 'pdrbHB'
  | 'pdrbHK'
  | any;

type Type = {[key in TypeKey]: indicator};

interface indicator {
  var: number;
  subcat: number;
  vervar: number;
}

const indStratList: Type = {
  jp: {
    var: 45,
    subcat: 12,
    vervar: 7106000,
  },
  sr: {
    var: 85,
    subcat: 12,
    vervar: 7106000,
  },
  ihk:{
    var: 2,
    subcat: 536,
    vervar: 12
  },
  inflasimtm:{
    var: 160,
    subcat: 536,
    vervar: 12
  },
  inflasiyoy:{
    var: 162,
    subcat: 536,
    vervar: 12
  },
  inflasiytd:{
    var: 161,
    subcat: 536,
    vervar: 12
  },
  tpak: {
    var: 94,
    subcat: 6,
    vervar: 7106,
  },
  ipm: {
    var: 37,
    subcat: 26,
    vervar: 7106,
  },
  ahk: {
    var: 48,
    subcat: 26,
    vervar: 7106,
  },
  hls: {
    var: 49,
    subcat: 26,
    vervar: 7106,
  },
  rrls: {
    var: 50,
    subcat: 26,
    vervar: 7106,
  },
  ppkp: {
    var: 51,
    subcat: 26,
    vervar: 7106,
  },
  tpt: {
    var: 70,
    subcat: 6,
    vervar: 7106,
  },
  jpm: {
    var: 44,
    subcat: 23,
    vervar: 7106,
  },
  ppm: {
    var: 47,
    subcat: 23,
    vervar: 7106,
  },
  ikk: {
    var: 93,
    subcat: 23,
    vervar: 7106,
  },
  lpe: {
    var: 54,
    subcat: 11,
    vervar: 18,
  },
  pdrbHB: {
    var: 62,
    subcat: 11,
    vervar: 18,
  },
  pdrbHK: {
    var: 65,
    subcat: 11,
    vervar: 18,
  },
};

export interface variabel {
  val: String | string | number | Number;
  label: String | string | number | Number;
  id: String | string | number | Number;
  unit: String | string;
  subj: String | string;
  def: string | String;
  decimal: string | String | Number | number;
  note: string | String;
}

export interface turvar {
  val: String | string | number | Number;
  label: String | string | number | Number;
}

export interface data {
  turvar: Array<turvar>;
  tahun: Array<turvar>;
  turtahun: Array<turvar>;
  var: Array<variabel>;
  datacontent: any;
}

export interface dataIndicator {
  var: Number | String;
  title: String;
  unit: String;
  value: Number;
  turvar: turvar;
  tahun: String | Number;
  turtahun: String;
  indicator_id: String | Number;
}

export interface itemdata {
  turvar: Array<turvar>;
  data: Array<dataIndicator>;
}

export const convertData = (data: data, verv: any) => {
  // let key = `${indStratList.jpm.vervar}${indStratList.jpm.var}`
  const converted = {
    turvar: data.turvar,
    data: data.turvar
      .map((turvar, i) => {
        return data.tahun
          .map((tahun, j) => {
            return data.turtahun
              .map((turtahun, l) => {
                let k = `${verv}${data.var[0].val}${turvar.val}${tahun.val}${turtahun.val}`;
                return {
                  var: data.var[0].val,
                  title:
                    data.var[0].val == 45
                      ? 'Jumlah Penduduk Menurut Jenis Kelamin'
                      : data.var[0].val == 62
                      ? 'PDRB ADHB Menurut Lapangan Usaha'
                      : data.var[0].val == 65
                      ? 'PDRB ADHK Menurut Lapangan Usaha'
                      : data.var[0].val == 54
                      ? 'Laju Pertumbuhan Ekonomi'
                      : data.var[0].val == 2
                      ? 'IHK (2022=100) Menurut Kelompok Pengeluaran'
                      : data.var[0].val == 160
                      ? 'Inflasi m-to-m (2022=100) Menurut Kelompok Pengeluaran'
                      : data.var[0].val == 161
                      ? 'Inflasi y-to-d (2022=100) Menurut Kelompok Pengeluaran'
                      : data.var[0].val == 162
                      ? 'Inflasi y-on-y (2022=100) Menurut Kelompok Pengeluaran'
                      : data.var[0].label,
                  unit: data.var[0].unit == 'Tahun' ? '' : data.var[0].unit,
                  value: data.datacontent[k],
                  turvar: turvar,
                  tahun: tahun.label,
                  turtahun: turtahun.label,
                  turtahun_val: Number(`${tahun.label}${String(turtahun.val).length == 1 ? `0${turtahun.val}` : turtahun.val}`),
                  indicator_id: k,
                };
              })
              .flat();
          })
          .flat();
      })
      .flat()
      .flat()
      .filter(e => e.value)
      .sort((a, b) => {
        // let left = Number(`${b.tahun}${String(b.turtahun_val).length == 1 ? `0${String(b.turtahun_val)}`: String(b.turtahun_val)}`)
        // let right = Number(`${a.tahun}${String(a.turtahun_val).length == 1 ? `0${String(a.turtahun_val)}`: String(a.turtahun_val)}`)
        return  b.turtahun_val - a.turtahun_val 
      }),
  };
  // console.log(converted.turvar)
  // if(converted.data.length > 2) {
  //   return converted.data.sort(
  //     function(a, b){
  //       return Number(b.tahun - a.tahun)
  //     }
  //   ).splice(0,3)
  //   console.log(t.length)
  // }
  // return converted
  if (converted.data[0].tahun) {
    let dataL = converted.data[0].var == 2 || converted.data[0].var == 160 || converted.data[0].var == 161 || converted.data[0].var == 162 ? 6 : 3
    return converted.data.length > 3
      ? data.turvar.length > 1
        ? {
            turvar: converted.turvar,
            data: converted.data
              .splice(0, dataL * data.turvar.length)
              .sort((a, b) => a.turtahun_val-b.turtahun_val),
          }
        : {
            turvar: converted.turvar,
            data: converted.data
              .splice(0, dataL)
              .sort((a, b) => a.turtahun_val-b.turtahun_val),
          }
      : {
          turvar: converted.turvar,
          data: converted.data.sort(
            (a, b) => a.turtahun_val-b.turtahun_val,
          ),
        };
  } else {
    return converted;
  }
};

export const getAll = () =>
  Promise.all(
    Object.keys(indStratList).map((e: string) => {
      return getDynData({
        domain: default_domain,
        var: indStratList[e].var,
        vervar: indStratList[e].vervar,
        apiKey: apiKey,
      })
        .then(resp => {
          if (resp.status == 'OK')
            if (resp['data-availability'] == 'available') {
              return convertData(resp, indStratList[e].vervar);
              // return resp
            } else return resp;
          else return resp;
        })
        .catch(err => {
          console.log(err)
          return err;
        });
    }),
  );

export const getJumlahPenduduk = getDynData({
  domain: default_domain,
  var: indStratList.jp.var,
  vervar: indStratList.jp.vervar,
  apiKey: apiKey,
})
  .then(resp => {
    if (resp.status == 'OK')
      if (resp['data-availability'] == 'available') {
        //    return convertData(resp, indStratList.jp.vervar)
        return resp;
      } else return resp;
    else return resp;
  })
  .catch(err => {
    return err;
  });

export const getSexRatio = () =>
  getDynData({
    domain: default_domain,
    var: indStratList.sr.var,
    vervar: indStratList.sr.vervar,
    apiKey: apiKey,
  })
    .then(resp => {
      if (resp.status == 'OK')
        if (resp['data-availability'] == 'available') {
          //    return convertData(resp, indStratList.sr.vervar)
          return resp;
        } else return resp;
      else return resp;
    })
    .catch(err => err);

export const getJumlahPendudukMiskin = () =>
  getDynData({
    domain: default_domain,
    var: indStratList.jpm.var,
    vervar: indStratList.jpm.vervar,
    apiKey: apiKey,
  })
    .then(resp => {
      if (resp.status == 'OK')
        if (resp['data-availability'] == 'available') {
          //    return convertData(resp, indStratList.jpm.vervar)
          return resp;
        } else return resp;
      else return resp;
    })
    .catch(err => err);

export const getKetenagakerjaan = getDynData({
  domain: default_domain,
  var: indStratList.tpt.var,
  vervar: indStratList.tpt.vervar,
  apiKey: apiKey,
})
  .then(resp => {
    if (resp.status == 'OK')
      if (resp['data-availability'] == 'available') {
        //    return convertData(resp, indStratList.tpt.vervar)
        return resp;
      } else return resp;
    else return resp;
  })
  .catch(err => err);

export const getIPM = () =>
  getDynData({
    domain: default_domain,
    var: indStratList.ipm.var,
    vervar: indStratList.ipm.vervar,
    apiKey: apiKey,
  })
    .then(resp => {
      if (resp.status == 'OK')
        if (resp['data-availability'] == 'available') {
          //    return convertData(resp, indStratList.ipm.vervar)
          return resp;
        } else return resp;
      else return resp;
    })
    .catch(err => {
      return err;
    });

export const getPDRBHK = () => {
  return getDynData({
    domain: default_domain,
    var: indStratList.pdrbHB.var,
    vervar: indStratList.pdrbHB.vervar,
    apiKey: apiKey,
  }).then(resp => {
    if (resp.status == 'OK')
      if (resp['data-availability'] == 'available') {
        // return convertData(resp, indStratList.pdrbHB.vervar)
        return resp;
      } else return resp;
    else return resp;
  });
};

export const getPDRBHB = () => {
  return getDynData({
    domain: default_domain,
    var: indStratList.pdrbHK.var,
    vervar: indStratList.pdrbHK.vervar,
    apiKey: apiKey,
  }).then(resp => {
    if (resp.status == 'OK')
      if (resp['data-availability'] == 'available') {
        // return convertData(resp, indStratList.pdrbHK.vervar)
        return resp;
      } else return resp;
    else return resp;
  });
};
