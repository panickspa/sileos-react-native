/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-shadow */
import {GoogleGenerativeAI} from '@google/generative-ai';
import {default_domain, getDynData} from './api';
import {apiKey} from './api';
import {
  openDatabase,
  enablePromise,
  SQLiteDatabase,
  ResultSet,
} from 'react-native-sqlite-storage';
import {turvar} from './indicator';
// import { black, grad5 } from './color';

export interface variable {
  var_id: number;
  kategori_data: string;
  judul: string;
  satuan: string;
  wilayah: string;
  domain: string;
  var_id_domain: string;
}

interface Paginations {
  page: number;
  per_page: number;
  pages: number;
  count: number;
  total: number;
}
interface VarObject {
  var_id: number;
  title: string;
  sub_id: number;
  sub_name: string;
  def: string;
  notes: string;
  vertical: number;
  unit: string;
  graph_id: number;
  graph_name: string;
}
interface VarApi {
  status: string | 'OK';
  'data-availability': string | 'available';
  data: [Paginations, Array<VarObject>];
}

interface VarResp {
  val: number;
  label: string;
  unit: string;
  subj: string;
  def: string;
  decimal: string;
  note: string;
}
export interface DataResponse {
  status: string | 'OK';
  'data-availability': string | 'available';
  var: Array<VarResp>;
  turvar: Array<turvar>;
  labelvervar: string;
  vervar: Array<turvar>;
  tahun: Array<turvar>;
  turtahun: Array<turvar>;
  datacontent: {[key: string]: number};
}

const genAI = new GoogleGenerativeAI('AIzaSyA7mV7s3ujTaLRvaterMDrivA633G5EJJ8');

const getParts = (q: string) => {
  return [
    {text: 'input: Who are you ?'},
    {
      text: "output: I'm Pegasus, I am part of BPS Minahasa Utara Regency, How can I help you?",
    },
    {text: 'input: Siapa kamu ?'},
    {
      text: 'output: Saya pegasus, saya pegawai virtual dan bagian dari BPS Kabupaten Minahasa Utara, apa yang saya perlu bantu?',
    },
    {
      text: 'input: pegasus',
    },
    {
      text: 'input: apakah judul-judul variabel menurut bulan?',
    },
    {
      text: 'output: semua judul-judul di database dengan periode bulan semua memiliki bulan',
    },
    {
      text: 'Pegasus adalah Petugas Pelayanan Khusus BPS Kabupaten Minahasa Utara yang siap membantu',
    },
    {text: `input: ${q}`},
    {text: 'output: '},
  ];
};
// Model LLM
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// get DB Conn
export const getDBConnection = async () => {
  enablePromise(true);
  try {
    let d = await openDatabase(
      {
        name: 'data.db',
        createFromLocation: 1,
        // createFromLocation: 'Library/data.db',
        // createFromLocation: '~/www/data.db',
      },
      () => {},
      err => {
        console.log(err);
      },
    );
    return d;
  } catch (error) {
    throw error;
  }
};

export const createVariablesTable = async (db: SQLiteDatabase) => {
  console.log('creating variables table');
  const query = `
    CREATE TABLE IF NOT EXISTS variables_76 (
        var_id              INTEGER,
        judul               TEXT,
        kategori_data       TEXT,
        satuan              TEXT,
        wilayah             TEXT,
        wilayah_upper       TEXT,
        wilayah_lower       TEXT,
        domain              TEXT,
        judul_upper         TEXT,
        judul_lower         TEXT,
        kategori_data_upper TEXT,
        kategori_data_lower TEXT,
        var_id_domain       TEXT    PRIMARY KEY
    );
  `;
  try {
    return await db.executeSql(query);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createMessagesHistoryTable = async (db: SQLiteDatabase) => {
  // console.log('creating messages history');
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
        type TEXT,
        message TEXT
    );
  `;
  try {
    let ex = await db.executeSql(query);
    console.log(ex);
    return ex;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

interface Message {
  type: 'AI' | 'user';
  message: string | object;
}

interface Domain {
  domain_id: string;
  domain_name: string;
  domain_url: string;
}

interface DomainResponse {
  status: 'OK' | string;
  'data-availability': 'available' | string;
  data: [
    {
      page: number;
      pages: number;
      total: number;
    },
    Array<Domain>,
  ];
}

export const insertMessages = async (
  db: SQLiteDatabase,
  message: [Message, Message],
) => {
  const query = `INSERT INTO messages (type, message)
  VALUES ( ? , ? ) , ( ?, ? )`;
  try {
    return await db.executeSql(query, [
      message[0].type,
      typeof message[0].message === 'string'
        ? message[0].message
        : JSON.stringify(message[0].message),
      message[1].type,
      typeof message[1].message === 'string'
        ? message[1].message
        : JSON.stringify(message[1].message),
    ]);
  } catch (error) {
    return error;
  }
};

export const clearMessages = async (db: SQLiteDatabase) => {
  try {
    return await db.executeSql('DELETE FROM messages');
  } catch (error) {
    return error;
  }
};

export const getAllMessage = async (db: SQLiteDatabase) => {
  try {
    return await db.executeSql('SELECT * FROM messages');
  } catch (error) {
    return error;
  }
};

export const createLastUpdateTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS updates_variables (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        domain TEXT,
        page   TEXT
    );
  `;
  try {
    return await db.executeSql(query);
  } catch (error) {
    return error;
  }
};

export const checkLastUpdate = async (db: SQLiteDatabase) => {
  const select = 'SELECT * FROM updates_variables LIMIT 1';
  let d = await db.executeSql(select);
  return d[0];
};

type domain_id = string;
type page_ = number;
export const updateHistorySyncVariables = async (param: [domain_id, page_]) => {
  // console.log("update history", param)
  const db: SQLiteDatabase = await getDBConnection();
  const c = await checkLastUpdate(db);
  let d = c.rows.raw();
  // console.log(d);
  if (c.rows.length === 1) {
    if (d[0]) {
      if (d[0].id) {
        await db.executeSql(
          'UPDATE updates_variables SET domain = ? , page = ? WHERE id = ? ;',
          [param[0], param[1], d[0].id],
        );
      }
    }
  } else {
    await db.executeSql(
      'INSERT INTO updates_variables VALUES ( 1 , ? , ? )',
      param,
    );
  }
};

export const ifExistVariablesTable = async (db: SQLiteDatabase) => {
  const query = 'PRAGMA table_info(variables);';
  let res = await db.executeSql(query);
  return res;
};

export const ifExistLastUpdateTable = async (db: SQLiteDatabase) => {
  const query = 'PRAGMA table_info(update_variables);';
  let res = await db.executeSql(query);
  return res;
};

// clearing variables
export const clearVariables = async () => {
  const db: SQLiteDatabase = await getDBConnection();
  await db.executeSql('DELETE FROM variables;');
};

// parsing JSON to insert values
export const variablesValueString = (e: Array<variable>) => {
  let p = e.reduce((prev: string, values: variable) => {
    return `${prev}\n( "${values.var_id}", 
       "${values.kategori_data}",
       "${values.kategori_data.toLowerCase()}",
       "${values.kategori_data.toLocaleUpperCase()}",
       "${values.judul}",
       "${values.judul.toLocaleLowerCase()}",
       "${values.judul.toLocaleUpperCase()}",
       "${values.satuan}",
       "${values.wilayah}",
       "${values.wilayah.toLocaleLowerCase()}",
       "${values.wilayah.toLocaleUpperCase()}",
       "${values.domain}",
       "${values.var_id}_${values.domain}"
   ),`;
  }, '');
  return p.substring(0, p.length - 1);
};

// Inserting variables on data.db
export const insertVariables = async (values: string, db: SQLiteDatabase) => {
  // const db: SQLiteDatabase = await getDBConnection();
  try {
    await db.executeSql(`INSERT INTO variables_76 (var_id, kategori_data, kategori_data_upper, kategori_data_lower, judul, judul_lower, judul_upper, satuan, wilayah, wilayah_lower, wilayah_upper, domain, var_id_domain)
        VALUES
        ${values}
    `);
    // console.log(insert, values,'insert success')
  } catch (error) {
    // console.log(error, values, 'insert fail')
  }
};

// Get Var with timeout
const getVarWithTimeout = (uri: string, timeout: number = 250) =>
  new Promise((res, rej) => {
    let interval = setTimeout(async () => {
      try {
        let v = await fetch(uri);
        let v_json: DataResponse = await v.json();
        res(v_json);
        clearInterval(interval);
      } catch (error) {
        console.log(error);
        rej(error);
        clearInterval(interval);
      }
    }, timeout);
  });

// Get All Domain
export const getAllDomain = () =>
  fetch(
    'https://webapi.bps.go.id/v1/api/domain/type/all/key/23b53e3e77445b3e54c11c60604350bf/',
  );

// Refresh DataSet
export const updateDataSet = async (
  variablesTable: ResultSet,
  db: SQLiteDatabase,
) => {
  // console.log('get domains');
  let domains = await getAllDomain();
  // console.log('convert to json');
  let domains_json: DomainResponse = await domains.json();
  domains_json.data[1] = domains_json.data[1].filter(
    e => String(e.domain_id) === String('7106'),
  );
  // if (domains_json.status == 'OK') {
  //   let minut_domain: Array<Domain> = [
  //     {
  //       domain_id: '7106',
  //       domain_name: 'Minahasa Utara',
  //       domain_url: 'https://minutkab.bps.go.id',
  //     },
  //   ];

  //   domains_json.data[1] = minut_domain.concat(
  //     domains_json.data[1].filter(e => e.domain_id != '7106'),
  //   );
  // }
  // const db = await getDBConnection();
  let last = await checkLastUpdate(db);
  let i_dns = 0;
  let d_last = last.rows.raw();
  if (last.rows.length === 1) {
    i_dns = domains_json.data[1].findIndex(
      e => String(e.domain_id) === String(d_last[0].domain),
    );
  }
  // console.log('fetch api');
  // console.log(JSON.stringify(variablesTable.rows.raw()));
  for (let dns = i_dns; i_dns < domains_json.data[1].length; dns++) {
    // console.log(dns, )
    let f: any | Response | VarApi = await fetch(
      `https://webapi.bps.go.id/v1/api/list/model/var/domain/${domains_json.data[1][dns].domain_id}/key/23b53e3e77445b3e54c11c60604350bf/`,
    );
    f = await f.json();
    let d: [Paginations, Array<VarObject>] = f.data;
    let n_page = last.rows.length === 1 ? d_last[0].page : 1;
    let page = d[0];
    while (n_page <= page.pages) {
      let d_loop = f.data;
      // console.log('check d_loop 1 ', domains_json.data[1][dns].domain_id);
      if (d_loop) {
        // console.log('check d_loop 2 ', domains_json.data[1][dns].domain_id);
        if (d_loop[1]) {
          // console.log('check d_loop 3 ', domains_json.data[1][dns].domain_id);
          for (let i = 0; i < page.per_page; i++) {
            // console.log('check d_loop 4 ', domains_json.data[1][dns].domain_id, i);
            if (d_loop[1][i]) {
              // console.log('check d_loop 5 ', domains_json.data[1][dns].domain_id, i);
              if (d_loop[1][i].var_id) {
                // console.log('get var with timeout', domains_json.data[1][dns].domain_id, d_loop[1][i].var_id, i);
                let v: DataResponse | any = await getVarWithTimeout(
                  `https://webapi.bps.go.id/v1/api/list/model/data/domain/${domains_json.data[1][dns].domain_id}/var/${d_loop[1][i].var_id}/key/23b53e3e77445b3e54c11c60604350bf/`,
                  100,
                );
                // console.log('data fetched', domains_json.data[1][dns].domain_id, d_loop[1][i].var_id, i, JSON.stringify(v));

                if (v['data-availability'] != 'list-not-available') {
                  if (variablesTable.rows.length > 0) {
                    // let vData = variablesTable
                    let var_found = variablesTable.rows
                      .raw()
                      .findIndex((e: variable) =>
                        e
                          ? e.var_id
                            ? e.var_id_domain ==
                              `${v.var[0].val}_${domains_json.data[1][dns].domain_id}`
                            : false
                          : false,
                      );
                    updateHistorySyncVariables([
                      domains_json.data[1][dns].domain_id,
                      n_page,
                    ]);
                    // console.log("found", var_found);
                    // console.log('var found', var_found, domains_json.data[1][dns].domain_id, i);
                    if (var_found < 0) {
                      // console.log('inserting variable', var_found, domains_json.data[1][dns].domain_id, i);
                      await insertVariables(
                        variablesValueString([
                          {
                            var_id: v.var[0].val,
                            judul: v.var[0].label,
                            kategori_data: v.var[0].subj,
                            satuan: v.var[0].unit,

                            wilayah:
                              domains_json.data[1][dns].domain_id == '0000'
                                ? 'Indonesia'
                                : domains_json.data[1][dns].domain_name,
                            domain: domains_json.data[1][dns].domain_id,
                            var_id_domain: `${v.var[0].val}_${domains_json.data[1][dns].domain_id}`,
                          },
                        ]),
                        db,
                      );
                      updateHistorySyncVariables([
                        domains_json.data[1][dns].domain_id,
                        n_page,
                      ]);
                      // console.log('var inserted', var_found);
                    }
                  } else {
                    await insertVariables(
                      variablesValueString([
                        {
                          var_id: v.var[0].val,
                          judul: v.var[0].label,
                          kategori_data: v.var[0].subj,
                          satuan: v.var[0].unit,

                          wilayah:
                            domains_json.data[1][dns].domain_id == '0000'
                              ? 'Indonesia'
                              : domains_json.data[1][dns].domain_name,
                          domain: domains_json.data[1][dns].domain_id,
                          var_id_domain: `${v.var[0].val}_${domains_json.data[1][dns].domain_id}`,
                        },
                      ]),
                      db,
                    );
                    updateHistorySyncVariables([
                      domains_json.data[1][dns].domain_id,
                      n_page,
                    ]);
                    // console.log('var inserted from empty');
                  }
                }
              }
            }
          }
        }
      }
      n_page = n_page + 1;
      f = await getVarWithTimeout(
        `https://webapi.bps.go.id/v1/api/list/model/var/domain/${
          domains_json.data[1][dns].domain_id
        }/page/${n_page + 1}/key/23b53e3e77445b3e54c11c60604350bf/`,
        5,
      );
      // console.log('f ', f);
      if (f.data) {
        page = f.data[0];
      }
      // console.log('page', page);
    }
  }
};

export const forceUpdate = async (db: SQLiteDatabase) => {
  // console.log(forceUpdate);
  await db.executeSql('DELETE FROM variables_76;');
  await db.executeSql('DELETE FROM updates_variables;');
  let var_dataset: [ResultSet] = await db.executeSql(
    'SELECT * FROM variables_76',
  );
  await updateDataSet(var_dataset[0], db);
};

// Get data from SQLLite
async function getData(query: string, db: SQLiteDatabase) {
  let data: [ResultSet] = await db.executeSql(query);
  return data;
}

// SQL Query Chain from Gemini
export async function chain(
  pertanyaan: string,
  attempt = 7,
  db: SQLiteDatabase,
) {
  let vs = await db.executeSql('SELECT * from variables_76');
  let exclusion = [
    'pantun',
    'cerita',
    'siapa anda',
    'siapa kamu',
    'apa itu pegasus',
    'siapa pegasus',
    'pegasus',
  ];
  // console.log(exclusion.findIndex(e => pertanyaan.includes(e)));

  if (pertanyaan.toLowerCase() == 'hapus pesan') {
    await clearMessages(db);
  }

  if (pertanyaan.toLowerCase() == 'clear messages') {
    await clearMessages(db);
  }

  if (pertanyaan.toLowerCase() == 'bantu aku') {
    return 'Halo Saya Pegasus Assistant, berikan saja pertanyaan apapun kepada saya, jika ingin menghapus pesan silahkan untuk memberikan pertanyaan ** hapus pesan ** atay ** clear messages **';
  }
  if (exclusion.findIndex(e => pertanyaan.includes(e)) > -1) {
    return genText(pertanyaan);
  }
  if (vs[0].rows.length < 50) {
    return 'Maaf saya masih mengumpulkan data dari BPS Kabupaten Minahasa Utara, silahkan coba lagi beberapa saat';
  }
  let a = 0;
  const prompt = `
    Berdasarkan schema tabel dibawah, tulis sebuah SQL query berdasarkan dibawah berikut:
    --------------------
    SQL SCHEMA: CREATE TABLE variables_76 (var_id INTEGER PRIMARY KEY, subjek TEXT, judul TEXT, kategori_data TEXT, satuan TEXT, wilayah TEXT, wilayah_lower TEXT, wilayah_upper TEXT, domain TEXT, judul_upper TEXT, judul_lower TEXT, kategori_data_upper TEXT, kategori_data_lower TEXT)
    --------------------
    QUESTION: cari judul, judul_upper, judul_lower, var_id, domain, wilayah yang sesuai dengan pertanyaan '${pertanyaan}' dan kesampingkan kata yang berhubungan dengan bulan
    --------------------
    SQL QUERY:`;
  while (a < attempt) {
    // console.log('percoban sql ke ', a + 1);
    try {
      const q = await model.generateContent([prompt]);
      let q_text = q.response.text();
      console.log(q_text);
      let q_ = q_text
        .substring(q_text.indexOf('```sql'), q_text.indexOf('\n```'))
        .replaceAll(/```sql/g, '')
        .replaceAll(/```+/g, '');
      try {
        let data: [ResultSet] = await getData(q_, db);
        // console.log('dara', data[0].rows.raw());
        if (data[0].rows.length > 0) {
          a = attempt;
          // console.log('data length ', data[0].rows.length);
          return data[0].rows.raw();
        }
        if (a === attempt) {
          return genText(pertanyaan);
        }
      } catch (error) {
        // console.log(q_, attempt);
        if (a === attempt) {
          return genText(pertanyaan);
        }
      }
    } catch (error) {
      // console.log(error);
      return 'Maaf layanan kami sedang mengalami gangguan silahkan coba tanyakan kembali kepada saya beberapa saat lagi';
    }
    a = a + 1;
  }
  return genText(pertanyaan);
}

// Analyze data from dynamic table
export async function analyze(v: number) {
  let d = await getDynData({
    domain: default_domain,
    var: v,
    apiKey: apiKey,
  });
  const a = await model.generateContent([
    `berikan analisis deskriptif dari ${transformApi(d)}`,
  ]);
  return {
    natural_response: a.response.text(),
    data: JSON.stringify(d),
  };
}

export async function analyzeDataFromHTML(html: string) {
  const a = await model.generateContent([
    `berikan analisis deskriptif dari ${html}`,
  ]);
  return {
    natural_response: a.response.text(),
    data: JSON.stringify(html),
  };
}

// Generate Text
export async function genText(t: string) {
  let parts = getParts(t);
  try {
    const a = await model.generateContent({
      contents: [{role: 'user', parts}],
    });
    return a.response.text();
  } catch (error) {
    return 'Maaf Pegasus baru kecapekan dan pusing, tunggu beberapa menit saat lagi';
  }
}

export function transformApi(data: DataResponse) {
  let turvarLength = Number(data.turvar[0].val) === 0 ? 0 : data.turvar.length;

  let turtahunLength =
    Number(data.turtahun[0].val) === 0 ? 0 : data.turtahun.length;

  let spanLabelVervar =
    2 + (turvarLength > 0 ? 1 : 0) + (turtahunLength > 0 ? 1 : 0);
  let tahunSpan =
    (turtahunLength > 0 ? turtahunLength : 1) *
    (turvarLength > 0 ? turvarLength : 1);
  let tahunTd = data.tahun.reduce((prev, curr) => {
    return `${prev}<td class="h-tahun" colspan="${tahunSpan}">${curr.label}</td>`;
  }, '');

  let varSpan =
    turvarLength > 0
      ? turtahunLength > 0
        ? turvarLength * turtahunLength * data.tahun.length
        : turvarLength * data.tahun.length
      : turtahunLength > 0
      ? turtahunLength * data.tahun.length
      : data.tahun.length;
  let turtahunTd = data.turtahun.reduce((prev, curr) => {
    return `${prev}<td ${
      turvarLength > 0 ? `colspan="${turvarLength}"` : ''
    } class="h-turtahun">${curr.label}</td>`;
  }, '');
  let turtahunTd_ = '';
  for (let ti_ = 0; ti_ < data.tahun.length; ti_++) {
    turtahunTd_ = turtahunTd_ + turtahunTd;
  }
  turtahunTd = turtahunTd_;
  let turvarTd =
    turvarLength === 0
      ? ''
      : data.turvar.reduce((prev, curr) => {
          return `${prev}<td class="h-turvar">${curr.label}</td>`;
        }, '');
  let turvarTd_ = '';
  for (let tri = 1; tri <= data.turtahun.length; tri++) {
    // console.log(tri, 'tri')
    for (let ti = 1; ti <= data.tahun.length; ti++) {
      // console.log(ti, 'ti')
      turvarTd_ = turvarTd_ + turvarTd;
    }
  }
  turvarTd = turvarTd_;

  let tNumber = '';
  for (let i = 1; i <= varSpan + 1; i++) {
    tNumber = `${tNumber}<td>(${i})</td>`;
  }
  tNumber = `<tr class="t-number">${tNumber}</tr>`;

  let header = `<thead><tr><td class="h-labelvervar" rowspan="${spanLabelVervar}">${
    data.labelvervar
  }</td><td class="h-variable"${varSpan > 1 ? ` colspan="${varSpan}" ` : ''}>${
    data.var[0].label
  }${
    data.var[0].unit
      ? data.var[0].unit == ''
        ? ''
        : ` (${data.var[0].unit}) `
      : ''
  }</td></tr><tr>${tahunTd}</tr>${
    turtahunLength > 0 ? `<tr class="r-turtahun">${turtahunTd}</tr>` : ''
  }${
    turvarLength > 0 ? `<tr class="r-turvar">${turvarTd}</tr>` : ''
  }${tNumber}</thead>`;
  type value_ = number | string | Number | String;
  interface value_turtahun_turvar {
    turtahun: value_;
    turvar: value_;
  }
  let body = data.vervar.reduce((prev, curr) => {
    let tahun = data.tahun
      .reduce((prev, curr) => {
        let turtahun = data.turtahun
          .reduce((prev, curr: turvar) => {
            let turvar: Array<{
              turvar: number | string | Number | String;
              turtahun: number | string | Number | String;
            }> = data.turvar
              .reduce(
                (prev: Array<number | string | Number | String>, curr) => {
                  return prev.concat([curr.val]);
                },
                [] as value_[],
              )
              .map((e: number | string | Number | String) => ({
                turvar: e,
                turtahun: curr.val,
              }));
            return prev.concat(turvar);
          }, [] as value_turtahun_turvar[])
          .map(e => `${e.turvar}${curr.val}${e.turtahun}`);
        return prev.concat(turtahun);
      }, [] as string[])
      .reduce((prevT, currT) => {
        return `${prevT}<td class="b-data">${formatNumber(
          data.datacontent[`${curr.val}${data.var[0].val}${currT}`],
        )}</td>`;
      }, '');
    return `${prev}<tr><td class="b-data-label">${curr.label}</td>${tahun}</tr>`;
  }, '');
  return `<table>${header}<tbody>${body}<tbody></table>`;
}

export const tableApiStyle = `body{
  margin: 0;
  padding: 0;
}
* {
  text-align: justify;
}
table {
        border-color: black;
        border-spacing: 0;
        border-radius: 10px;
    }
.table{
  border-radius: 10px 10px 0 0 0
}
thead tr td {
    padding: 0.5em;
    color: white;
    background-color: #002851;
    text-align: center;
    border: none;
    font-weight: bold;
}
.b-data-label{
    padding-left: 1em;
}
tbody tr:nth-child(even){
    background-color: #CCE9FF;
}
tbody tr:nth-child(odd){
    background-color: #e4f1fc;
}
thead tr.t-number td{
    background-color: #004282;
}
.b-data{
    text-align: right;
    padding: 0.5em 1em 0.5em 0.2em;
}
.card{
    background-color: #004282;
    padding: 1em;
    color: white;
}`;
// let table = `<table>${header}<tbody>${body}<tbody></table>`

function formatNumber(e: any) {
  // console.log('data ', e);
  return e
    ? Number(e) === 0
      ? '—'
      : new Intl.NumberFormat('id-ID', {maximumSignificantDigits: 3}).format(
          Number(e),
        )
    : '—';
}
