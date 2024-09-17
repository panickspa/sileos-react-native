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

export interface variable {
  var_id: number;
  kategori_data: string;
  judul: string;
  satuan: string;
  wilayah: string;
  domain: string;
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
  datacontent: Object;
}

const genAI = new GoogleGenerativeAI('AIzaSyA7mV7s3ujTaLRvaterMDrivA633G5EJJ8');

// Model LLM
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// get DB Conn
export const getDBConnection = async () => {
  enablePromise(true);
  let d = await openDatabase({
    name: 'data.db',
    createFromLocation: 1,
    // location: 'Library',
  });
  return d;
};

export const createVariablesTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS variables (
        var_id              INTEGER PRIMARY KEY,
        judul               TEXT,
        kategori_data       TEXT,
        satuan              TEXT,
        wilayah             TEXT,
        domain              TEXT,
        judul_upper         TEXT,
        judul_lower         TEXT,
        kategori_data_upper TEXT,
        kategori_data_lower TEXT,
        subjek_lower        TEXT,
        subjek_upper        TEXT
    );
  `;
  try {
    return await db.executeSql(query);
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const createMessagesHistoryTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
        type TEXT,
        message TEXT
    );
  `;
  try {
    return await db.executeSql(query);
  } catch (error) {
    return error;
  }
};

interface Message {
  type: 'AI' | 'user';
  message: string | object;
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
    CREATE TABLE IF NOT EXISTS update_variables (
        updated_at TEXT
    );
  `;
  try {
    return await db.executeSql(query);
  } catch (error) {
    return error;
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
       "${values.domain}"
   ),`;
  }, '');
  return p.substring(0, p.length - 1);
};

// Inserting variables on data.db
export const insertVariables = async (values: string) => {
  const db: SQLiteDatabase = await getDBConnection();
  try {
    await db.executeSql(`INSERT INTO variables (var_id, kategori_data, kategori_data_upper, kategori_data_lower, judul, judul_lower, judul_upper, satuan, wilayah, domain)
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
    setTimeout(async () => {
      try {
        let v = await fetch(uri);
        let v_json: DataResponse = await v.json();
        res(v_json);
      } catch (error) {
        rej(error);
      }
    }, timeout);
  });

// Refresh DataSet
export const updateDataSet = async (variablesTable: ResultSet) => {
  let f: any | Response | VarApi = await fetch(
    'https://webapi.bps.go.id/v1/api/list/model/var/domain/7106/key/23b53e3e77445b3e54c11c60604350bf/',
  );
  f = await f.json();
  let d: [Paginations, Array<VarObject>] = f.data;
  let n_page = 0;
  let page = d[0];
  while (n_page < page.pages) {
    let d_loop = f.data;
    for (let i = 0; i < page.per_page; i++) {
      let v: DataResponse | any = await getVarWithTimeout(
        `https://webapi.bps.go.id/v1/api/list/model/data/domain/7106/var/${d_loop[1][i].var_id}/key/23b53e3e77445b3e54c11c60604350bf/`,
      );
      if (variablesTable.rows.length > 0) {
        // let vData = variablesTable
        let var_found = variablesTable.rows
          .raw()
          .findIndex((e: variable) =>
            e.var_id ? Number(e.var_id) === Number(v.var[0].val) : false,
          );
        // console.log('var found', var_found);
        if (var_found > -1) {
          await insertVariables(
            variablesValueString([
              {
                var_id: v.var[0].val,
                judul: v.var[0].label,
                kategori_data: v.var[0].subj,
                satuan: v.var[0].unit,
                wilayah: 'Minahasa Utara',
                domain: String(default_domain),
              },
            ]),
          );
        }
      } else {
        await insertVariables(
          variablesValueString([
            {
              var_id: v.var[0].val,
              judul: v.var[0].label,
              kategori_data: v.var[0].subj,
              satuan: v.var[0].unit,
              wilayah: 'Minahasa Utara',
              domain: String(default_domain),
            },
          ]),
        );
      }
    }
    n_page = n_page + 1;
    f = await fetch(
      `https://webapi.bps.go.id/v1/api/list/model/var/domain/7106/page/${
        n_page + 1
      }/key/23b53e3e77445b3e54c11c60604350bf/`,
    );
    f = await f.json();
  }
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
  let vs = await db.executeSql('SELECT * from variables');
  let exclusion = ['pantun', 'cerita'];
  // console.log(exclusion.findIndex(e => pertanyaan.includes(e)));
  // eslint-disable-next-line eqeqeq
  if (pertanyaan.toLowerCase() == 'hapus pesan') {
    await clearMessages(db);
  }
  // eslint-disable-next-line eqeqeq
  if (pertanyaan.toLowerCase() == 'clear messages') {
    await clearMessages(db);
  }

  // eslint-disable-next-line eqeqeq
  if (pertanyaan.toLowerCase() == 'bantu aku') {
    return "Halo Saya Pegasus Assistant, berikan saja pertanyaan apapun kepada saya, jika ingin menghapus pesan silahkan untuk memberikan pertanyaan 'hapus pesan' atay 'clear messages'";
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
    SQL SCHEMA: CREATE TABLE variables (var_id INTEGER PRIMARY KEY, subjek TEXT, judul TEXT, kategori_data TEXT, satuan TEXT, wilayah TEXT, domain TEXT, judul_upper TEXT, judul_lower TEXT, kategori_data_upper TEXT, kategori_data_lower TEXT)
    --------------------
    QUESTION: cari judul, judul_upper, judul_lower, var_id yang sesuai dengan pertanyaan '${pertanyaan}' di Minahasa Utara
    --------------------
    SQL QUERY:`;
  while (a < attempt) {
    console.log('percoban sql ke ', a + 1);
    try {
      const q = await model.generateContent([prompt]);
      let q_text = q.response.text();
      let q_ = q_text.replaceAll(/```sql/g, '').replaceAll(/```/g, '');
      try {
        let data: [ResultSet] = await getData(q_, db);
        // console.log('dara', data[0].rows.raw());
        if (data[0].rows.length > 0) {
          a = attempt;
          console.log('data length ', data[0].rows.length);
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
      console.log(error);
      return 'Maaf kami layanan kami sedang mengalami gangguan silahkan coba tanyakan kembali kepada saya beberapa saat lagi';
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
  const a = await model.generateContent([t]);
  return a.response.text();
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
    return `${prev}<td${
      turvarLength > 0 ? `span="${turvarLength}"` : ''
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

  let body = data.vervar.reduce((prev, curr) => {
    let tahun = data.tahun
      .reduce((prev, curr) => {
        let turtahun = data.turtahun
          .reduce((prev, curr) => {
            let turvar = data.turvar
              .reduce((prev, curr) => {
                return prev.concat([curr.val]);
              }, [])
              .map(e => ({turvar: e, turtahun: curr.val}));
            return prev.concat(turvar);
          }, [])
          .map(e => `${e.turvar}${curr.val}${e.turtahun}`);
        return prev.concat(turtahun);
      }, [])
      .reduce((prevT, currT) => {
        // return {
        //     key: `${curr.val}${data.var[0].val}${e}`,
        //     label: curr.label
        // }
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
