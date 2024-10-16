/* eslint-disable @typescript-eslint/no-shadow */
import {GoogleGenerativeAI, SchemaType} from '@google/generative-ai';
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

const model2 = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        sql_publikasi: {
          type: SchemaType.STRING,
        },
        sql_variable: {
          type: SchemaType.STRING,
        },
        topik: {
          type: SchemaType.STRING,
        },
      },
    },
  },
});

// get DB Conn
enablePromise(true);

export const getDBReadOnlyConnection = async () => {
  try {
    let d = await openDatabase(
      {
        name: 'data_9.db',
        // createFromLocation: 1,
        readOnly: true,
        // createFromLocation: 'Library/data.db',
        createFromLocation: '~/www/data_9.db',
      },
      () => {},
      err => {
        console.log(err);
      },
    );
    return d;
  } catch (error) {
    console.log(error);
  }
};

export const getDBConnection = async () => {
  try {
    let d = await openDatabase(
      {
        name: 'data_9.db',
        // createFromLocation: 1,
        createFromLocation: '~/www/data_9.db',
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
    console.log(error);
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
    // console.log(ex);
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

export interface DomainResponse {
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

export const getAllMessage = async () => {
  try {
    let db_ = await getDBReadOnlyConnection();
    if (db_) {
      let result = await db_.executeSql('SELECT * FROM messages');
      return result;
    }
  } catch (error) {
    return error;
  }
};

export const createLastUpdateTable = async (db: SQLiteDatabase) => {
  console.log('createlast update table');
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
  // console.log('update history', param);
  const db: SQLiteDatabase | undefined = await getDBConnection();
  const dbRead: SQLiteDatabase | undefined = await getDBReadOnlyConnection();
  if (dbRead) {
    if (db) {
      const c = await checkLastUpdate(dbRead);
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
    }
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
  const db: SQLiteDatabase | undefined = await getDBConnection();
  if (db) {
    await db.executeSql('DELETE FROM variables;');
  }
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

export interface PublikasiData {
  pub_id: string;
  title: string;
  abstract: string;
  issn: string;
  rl_date: string;
  updt_date: string;
  cover: string;
  pdf: string;
  size: string;
}

export interface PublikasiDataResponse {
  status: string | 'OK';
  'data-availability': string | 'available';
  data: [
    {
      page: number;
      pages: number;
      per_page: number;
      count: number;
      total: number;
    },
    Array<PublikasiData>,
  ];
}

export const getPublication = (uri: string, timeout: number = 250) =>
  new Promise<PublikasiData>((res, rej) => {
    let interval = setTimeout(async () => {
      try {
        let v = await fetch(uri);
        let v_json: PublikasiDataResponse = await v.json();
        if (
          v_json.status === 'OK' &&
          v_json['data-availability'] === 'available'
        ) {
          let data: PublikasiData = v_json.data[1][0];
          res(data);
        } else {
          rej(v_json);
        }
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

// Refresh DataSet Minahasa Utara
export const updateMinutDataset = async (
  variablesTable: ResultSet,
  db: SQLiteDatabase,
  dbRead: SQLiteDatabase,
) => {
  try {
    let last = await checkLastUpdate(dbRead);
    let d_last = last.rows.raw();
    let f: any | Response | VarApi = await fetch(
      'https://webapi.bps.go.id/v1/api/list/model/var/domain/7106/key/23b53e3e77445b3e54c11c60604350bf/',
    );
    f = await f.json();
    let d: [Paginations, Array<VarObject>] = f.data;
    let n_page = last.rows.length === 1 ? Number(d_last[0].page) : 1;
    let page = d[0];
    console.log('page', last.rows.raw()[0], page.pages);
    while (n_page <= page.pages) {
      // console.log(1, '7106', n_page, page.pages);
      let d_loop = f.data;
      if (d_loop) {
        if (d_loop[1]) {
          for (let i = 0; i < page.per_page; i++) {
            // console.log('iterating pages', i, n_page, page);
            if (d_loop[1][i]) {
              if (d_loop[1][i].var_id) {
                // let check = await checkLastUpdate(dbRead);
                // console.log(check.rows.raw()[0]);
                let v: DataResponse | any = await getVarWithTimeout(
                  `https://webapi.bps.go.id/v1/api/list/model/data/domain/7106/var/${d_loop[1][i].var_id}/key/23b53e3e77445b3e54c11c60604350bf/`,
                  100,
                );
                // eslint-disable-next-line eqeqeq
                if (v['data-availability'] != 'list-not-available') {
                  if (variablesTable.rows.length > 0) {
                    let var_found = variablesTable.rows
                      .raw()
                      .findIndex((e: variable) =>
                        e
                          ? e.var_id
                            ? // eslint-disable-next-line eqeqeq
                              e.var_id_domain == '7106'
                            : false
                          : false,
                      );
                    if (var_found < 0) {
                      await insertVariables(
                        variablesValueString([
                          {
                            var_id: v.var[0].val,
                            judul: v.var[0].label,
                            kategori_data: v.var[0].subj,
                            satuan: v.var[0].unit,

                            wilayah: 'Minahasa Utara',
                            domain: '7106',
                            var_id_domain: `${v.var[0].val}_7106`,
                          },
                        ]),
                        db,
                      );
                      updateHistorySyncVariables(['7106', n_page]);
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
                          domain: '7106',
                          var_id_domain: `${v.var[0].val}_7106`,
                        },
                      ]),
                      db,
                    );
                    updateHistorySyncVariables(['7106', n_page]);
                  }
                }
                // if (check.rows.length < 1) {
                //   console.log("pages change")
                //   n_page = page.pages;
                // } else {
                // }
              }
            }
          }
        }
      }
      // updateHistorySyncVariables(['7106', n_page]);
      n_page = Number(n_page) + 1;
      console.log('npage', n_page);
      f = await getVarWithTimeout(
        `https://webapi.bps.go.id/v1/api/list/model/var/domain/${'7106'}/page/${n_page}/key/23b53e3e77445b3e54c11c60604350bf/`,
        5,
      );
      // console.log(f);
      if (f.data) {
        page = f.data[0];
      }
    }
    updateHistorySyncVariables(['7106', 99]);
  } catch (error) {
    console.log(error);
  } finally {
  }
};

// Refresh DataSet
export const updateDataSet = async (
  variablesTable: ResultSet,
  db: SQLiteDatabase,
  dbRead: SQLiteDatabase,
) => {
  try {
    // console.log('get domains');
    let domains = await getAllDomain();
    // console.log('convert to json');
    let domains_json: DomainResponse = await domains.json();
    // eslint-disable-next-line eqeqeq
    if (domains_json.status == 'OK') {
      let minut_domain: Array<Domain> = [
        {
          domain_id: '7106',
          domain_name: 'Minahasa Utara',
          domain_url: 'https://minutkab.bps.go.id',
        },
        // {
        //   domain_id: '7106',
        //   domain_name: 'Minahasa Utara',
        //   domain_url: 'https://minutkab.bps.go.id',
        // },
        {
          domain_id: '7100',
          domain_name: 'Sulawesi Utara',
          domain_url: 'https://sulut.bps.go.id',
        },
        {
          domain_id: '7171',
          domain_name: 'Manado',
          domain_url: 'https://manadokota.bps.go.id',
        },
        {
          domain_id: '7172',
          domain_name: 'Bitung',
          domain_url: 'https://bitungkota.bps.go.id',
        },
        {
          domain_id: '7174',
          domain_name: 'Kotamobagu',
          domain_url: 'https://kotamobagukota.bps.go.id',
        },
        {
          domain_id: '7102',
          domain_name: 'Minahasa',
          domain_url: 'https://minahasakab.bps.go.id',
        },
        {
          domain_id: '7173',
          domain_name: 'Tomohon',
          domain_url: 'https://tomohonkota.bps.go.id',
        },
        {
          domain_id: '7101',
          domain_name: 'Bolaang Mongondow',
          domain_url: 'https://bolmongkab.bps.go.id',
        },
        {
          domain_id: '7103',
          domain_name: 'Kepulauan Sangihe',
          domain_url: 'https://sangihekab.bps.go.id',
        },
        {
          domain_id: '7104',
          domain_name: 'Kepulauan Talaud',
          domain_url: 'https://talaudkab.bps.go.id',
        },
        {
          domain_id: '7105',
          domain_name: 'Minahasa Selatan',
          domain_url: 'https://minselkab.bps.go.id',
        },
        {
          domain_id: '7107',
          domain_name: 'Bolaang Mongondow Utara',
          domain_url: 'https://bolmutkab.bps.go.id',
        },
        {
          domain_id: '7108',
          domain_name: 'Siau Tagulandang Biaro',
          domain_url: 'https://sitarokab.bps.go.id',
        },
        {
          domain_id: '7109',
          domain_name: 'Minahasa Tenggara',
          domain_url: 'https://mitrakab.bps.go.id',
        },
        {
          domain_id: '7110',
          domain_name: 'Bolaang Mongondow Selatan',
          domain_url: 'https://bolselkab.bps.go.id',
        },
        {
          domain_id: '7111',
          domain_name: 'Bolaang Mongondow Timur',
          domain_url: 'https://boltimkab.bps.go.id',
        },
      ];

      domains_json.data[1] = minut_domain;
    }
    // const db = await getDBConnection();
    let last = await checkLastUpdate(dbRead);
    let i_dns = 0;
    let d_last = last.rows.raw();
    if (last.rows.length === 1) {
      i_dns = domains_json.data[1].findIndex(
        e => String(e.domain_id) === String(d_last[0].domain),
      );
    }
    let f: any | Response | VarApi = await fetch(
      `https://webapi.bps.go.id/v1/api/list/model/var/domain/${domains_json.data[1][0].domain_id}/key/23b53e3e77445b3e54c11c60604350bf/`,
    );
    f = await f.json();
    let d: [Paginations, Array<VarObject>] = f.data;
    let n_page = last.rows.length === 1 ? Number(d_last[0].page) : 1;
    let page = d[0];
    // console.log('fetch api');
    // console.log(JSON.stringify(variablesTable.rows.raw()));
    for (let dns = i_dns; dns < domains_json.data[1].length; dns++) {
      // console.log(
      //   'i_dns',
      //   i_dns,
      //   'domains_json.data[1].length',
      //   domains_json.data[1].length,
      //   'domain',
      //   domains_json.data[1][dns].domain_id,
      // );
      while (n_page <= page.pages) {
        let d_loop = f.data;
        if (d_loop) {
          if (d_loop[1]) {
            for (let i = 0; i < page.per_page; i++) {
              if (d_loop[1][i]) {
                if (d_loop[1][i].var_id) {
                  // let check = await checkLastUpdate(dbRead);
                  // if (check.rows.length < 1) {
                  //   n_page = page.pages;
                  //   dns = 0;
                  // } else {
                  // }
                  // console.log(
                  //   'get var',
                  //   d_loop[1][i].var_id,
                  //   'on page',
                  //   n_page,
                  // );
                  let v: DataResponse | any = await getVarWithTimeout(
                    `https://webapi.bps.go.id/v1/api/list/model/data/domain/${domains_json.data[1][dns].domain_id}/var/${d_loop[1][i].var_id}/key/23b53e3e77445b3e54c11c60604350bf/`,
                    100,
                  );
                  // eslint-disable-next-line eqeqeq
                  if (v['data-availability'] != 'list-not-available') {
                    if (variablesTable.rows.length > 0) {
                      // let vData = variablesTable
                      let var_found = variablesTable.rows
                        .raw()
                        .findIndex((e: variable) =>
                          e
                            ? e.var_id
                              ? // eslint-disable-next-line eqeqeq
                                e.var_id_domain ==
                                `${v.var[0].val}_${domains_json.data[1][dns].domain_id}`
                              : false
                            : false,
                        );
                      if (var_found < 0) {
                        await insertVariables(
                          variablesValueString([
                            {
                              var_id: v.var[0].val,
                              judul: v.var[0].label,
                              kategori_data: v.var[0].subj,
                              satuan: v.var[0].unit,
                              wilayah:
                                domains_json.data[1][dns].domain_id === '0000'
                                  ? 'Indonesia'
                                  : domains_json.data[1][dns].domain_name,
                              domain: domains_json.data[1][dns].domain_id,
                              var_id_domain: `${v.var[0].val}_${domains_json.data[1][dns].domain_id}`,
                            },
                          ]),
                          db,
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

                            wilayah:
                              // eslint-disable-next-line eqeqeq
                              domains_json.data[1][dns].domain_id == '0000'
                                ? 'Indonesia'
                                : domains_json.data[1][dns].domain_name,
                            domain: domains_json.data[1][dns].domain_id,
                            var_id_domain: `${v.var[0].val}_${domains_json.data[1][dns].domain_id}`,
                          },
                        ]),
                        db,
                      );
                    }
                  }
                }
              }
            }
          }
        }
        updateHistorySyncVariables([
          domains_json.data[1][dns].domain_id,
          n_page,
        ]);
        n_page = Number(n_page) + 1;
        f = await getVarWithTimeout(
          `https://webapi.bps.go.id/v1/api/list/model/var/domain/${domains_json.data[1][dns].domain_id}/page/${n_page}/key/23b53e3e77445b3e54c11c60604350bf/`,
          5,
        );
        // f = await f.json();
        // console.log('f ', f);
        if (f.data) {
          page = f.data[0];
        }
        // console.log('page', page);
      }
      n_page = 1;
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
};

export const forceUpdate = async (
  db: SQLiteDatabase,
  dbRead: SQLiteDatabase,
) => {
  // console.log(forceUpdate);
  await db.executeSql('DELETE FROM variables_76;');
  await db.executeSql('DELETE FROM updates_variables;');
  let var_dataset: [ResultSet] = await db.executeSql(
    'SELECT * FROM variables_76',
  );
  await updateDataSet(var_dataset[0], db, dbRead);
};

// Get data from SQLLite
async function getData(
  query: string,
  db: SQLiteDatabase,
): Promise<[ResultSet]> {
  return new Promise((res, rej) => {
    db.readTransaction(
      tx => {
        tx.executeSql(query, [], (tx, resulSet) => {
          res([resulSet]);
        });
      },
      err => rej(err),
    );
  });
}
export const selectAllVariable = (
  db: SQLiteDatabase,
  query: string,
): Promise<[ResultSet]> =>
  new Promise((res, rej) => {
    db.readTransaction(
      tx =>
        tx.executeSql(query, [], (tx, resultSet) => {
          res([resultSet]);
        }),
      err => rej(err),
    );
  });

// interface ChainRequestConstructor {
//   attempt: number|7;
//   pertanyaan: string;
//   db: SQLiteDatabase;
// }

// class AttemptEvent extends Event {
//   data: number;
//   // type: string;
//   constructor(type: string, data: number){
//     super(type);
//     this.data = data;
//   }
// }

type Handler<E> = (event: E) => void;

interface GeneratedTextEvent {
  genText: string;
}
interface ResultQueryEvent {
  resultQuery: [ResultSet] | [];
}
interface AttemptEvent {
  attempt: number;
}

export class EventDispatcher<E> {
  private handlers: Handler<E>[] = [];
  fire(event: E) {
    for (let h of this.handlers) {
      h(event);
    }
  }
  register(handler: Handler<E>) {
    this.handlers.push(handler);
  }
}
export interface DomainEvent {
  domain: string | number;
  name: string;
}
export interface PageDatasetEvent {
  page: number;
  page_all: number;
  per_page: number;
  total: number;
}

export interface Publikasi {
  title: string;
  title_lower: string;
  text: string;
}

export class Chain {
  // data: number;
  // type: string;
  private a: number;
  private pertanyaan: string;
  private attempt: number;
  private dbRead: Promise<SQLiteDatabase | undefined>;
  private db: Promise<SQLiteDatabase | undefined>;
  private genText: string;
  private resultsQuery: [ResultSet] | [];

  constructor(pertanyaan: string, attempt: number = 7) {
    this.pertanyaan = pertanyaan;
    this.db = getDBConnection();
    this.dbRead = getDBReadOnlyConnection();
    this.attempt = attempt;
    this.genText = '';
    this.resultsQuery = [];
    this.a = 0;
  }

  private addAttempt = new EventDispatcher<AttemptEvent>();
  public onAttempt(handler: Handler<AttemptEvent>) {
    this.addAttempt.register(handler);
  }
  private fireAttempt(event: AttemptEvent) {
    this.addAttempt.fire(event);
  }

  private generateText = new EventDispatcher<GeneratedTextEvent>();
  public onGenerateText(handler: Handler<GeneratedTextEvent>) {
    this.generateText.register(handler);
  }
  private fireGenerateText(event: GeneratedTextEvent) {
    this.generateText.fire(event);
  }

  private resultQuery = new EventDispatcher<ResultQueryEvent>();
  public onResultQuery(handler: Handler<ResultQueryEvent>) {
    this.resultQuery.register(handler);
  }
  private fireResultQuery(event: ResultQueryEvent) {
    this.resultQuery.fire(event);
  }

  public setPertanyaan(pertanyaan: string) {
    this.pertanyaan = pertanyaan;
  }

  public getPertanyaan() {
    return this.pertanyaan;
  }

  async doubleChain() {
    // console.log('chaining ...')
    this.a = 0;
    // console.log('db read write');
    try {
      let db = await this.db;
      // console.log('db read')
      let dbRead = await this.dbRead;
      // console.log('exec variables_76 select all')
      if (db) {
        if (dbRead) {
          let exclusion = [
            'pantun',
            'cerita',
            'siapa anda',
            'siapa kamu',
            'apa itu pegasus',
            'siapa pegasus',
            'pegasus',
            'halo',
            'hai',
            'halo pegasus',
            'hai pegasus',
            'hi pegasus',
            'aloha pegasus',
            'syalom pegasus',
          ];
          // console.log(exclusion.findIndex(e => pertanyaan.includes(e)));

          // let db = await this.db;
          // let dbRead = await this.dbRead;
          // eslint-disable-next-line eqeqeq
          if (this.pertanyaan.toLowerCase() == 'hapus pesan') {
            // console.log('hapus pesan')
            await clearMessages(db);
            return '';
          }
          // eslint-disable-next-line eqeqeq
          if (this.pertanyaan.toLowerCase() == 'clear messages') {
            // console.log('hapus pesan')
            await clearMessages(db);
            return '';
          }
          // eslint-disable-next-line eqeqeq
          if (this.pertanyaan.toLowerCase() == 'bantu aku') {
            let jawaban =
              'Halo Saya Pegasus Assistant, berikan saja pertanyaan apapun kepada saya, jika ingin menghapus pesan silahkan untuk memberikan pertanyaan ** hapus pesan ** atay ** clear messages **';
            this.fireGenerateText({
              genText: jawaban,
            });
            return jawaban;
            // return 'Halo Saya Pegasus Assistant, berikan saja pertanyaan apapun kepada saya, jika ingin menghapus pesan silahkan untuk memberikan pertanyaan ** hapus pesan ** atay ** clear messages **';
          }
          if (exclusion.findIndex(e => this.pertanyaan.includes(e)) > -1) {
            // console.log("gen text exclusion");
            this.genText = await genText(this.pertanyaan);
            // this.textGenerated(this.genText);
            this.fireGenerateText({
              genText: this.genText,
            });
            return this.genText;
          }
          const prompt = `Berdasarkan schema tabel dibawah, tulis sebuah SQL query SQLite 3 dengan berdasarkan dibawah berikut: 
        -------------------- 
        SQL TEMPLATE PUBLIKASI: SELECT DISTINCT title FROM publikasi WHERE text MATCH '$topik' ORDER BY cast(year as INT) desc limit 5
        --------------------
        SQL TEMPLATE VARIABLE: SELECT * FROM variable WHERE judul MATCH '$topik' limit 15
        -------------------- 
        QUESTION: cari data di tabel publikasi dan variable yang sesuai dengan topik data dari pertanyaan '${this.pertanyaan}'
        -------------------- 
        SQL QUERY:`;
          const parts = [
            {text: 'input: Who are you ?'},
            {
              text: "output: I'm Pegasus, I am part of BPS Minahasa Utara Regency, How can I help you?",
            },
            {text: 'input: Siapa kamu ?'},
            {
              text: 'output: Saya pegasus, saya pegawai virtual dan bagian dari BPS Kabupaten Minahasa Utara, apa yang saya perlu bantu?',
            },
            {text: 'input: bagaimana cara mengetahui pertumbuhan ekonomi?'},
            {
              text: 'output: pertumbuhan ekonomi dapat diketahui dengan laju pertumbuhan PDRB (Produk Domestik Regional Bruto) atau PDB (Produk Domestik Bruto) untuk skala nasional',
            },
            {
              text: `input: Berdasarkan schema tabel dibawah, tulis sebuah SQL query SQLite 3 dengan berdasarkan dibawah berikut: 
        -------------------- 
        SQL TEMPLATE PUBLIKASI: SELECT * FROM publikasi WHERE text MATCH '$topik' limit 10
        --------------------
        SQL TEMPLATE VARIABLE: SELECT * FROM variable WHERE judul MATCH '$topik' limit 15
        -------------------- 
        QUESTION: cari data di tabel publikasi dan variable yang sesuai dengan topik data dari pertanyaan 'berapa pertumbuhan ekonomi?'
        -------------------- 
        SQL QUERY:`,
            },
            {
              text: 'output: {"sql_publikasi": "SELECT * FROM publikasi WHERE title MATCH \'pertumbuhan produk domestik regional bruto atas dasar harga konstan minahasa utara\' limit 10", "sql_variable":"SELECT * FROM variable WHERE judul MATCH "pertumbuhan produk domestik regional bruto atas dasar harga konstan minahasa utara limit 15" topik: "pertumbuhan ekonomi"}',
            },
            {text: `input: ${prompt}`},
            {text: 'output: '},
          ];
          for (let a = this.a; a < this.attempt; a++) {
            const q = await model2.generateContent({
              contents: [{role: 'user', parts: parts}],
            });
            let q_text = q.response.text();
            console.log(q_text);
            let q_json = JSON.parse(q_text);

            let data: [ResultSet] = await getData(
              q_json.sql_publikasi
                // eslint-disable-next-line no-useless-escape
                .replaceAll(/NEAR\(\'/g, 'NEAR(')
                // eslint-disable-next-line no-useless-escape
                .replaceAll(/\'\)\'/g, ")'"),
              dbRead,
            );

            let data2: [ResultSet] = await getData(
              q_json.sql_variable
                // eslint-disable-next-line no-useless-escape
                .replaceAll(/NEAR\(\'/g, 'NEAR(')
                // eslint-disable-next-line no-useless-escape
                .replaceAll(/\'\)\'/g, ")'"),
              dbRead,
            );
            console.log(data2[0].rows.length > 0 || data[0].rows.length > 0);
            if (data2[0].rows.length > 0 || data[0].rows.length > 0) {
              a = this.attempt;
              let publikasi_ = data[0].rows.raw();
              let titles = [...new Set(publikasi_.map(e => e.title))]
                .map(e => {
                  let tahun_data = [...e.matchAll(/\d{4}/g)];
                  return {
                    title: e,
                    count: tahun_data[tahun_data.length - 1],
                  };
                })
                .sort((a, b) => {
                  return Number(b.count) - Number(a.count);
                });
              return [titles, data2[0].rows.raw()];
            }
          }
          this.genText = await genText(this.pertanyaan);
          this.fireGenerateText({
            genText: this.genText,
          });
          return this.genText;
        }
      }
    } catch (error) {
      console.log(error);
      this.genText =
        'Maaf layanan kami sedang mengalami gangguan silahkan coba tanyakan kembali kepada saya beberapa saat lagi';
      this.fireGenerateText({
        genText: this.genText,
      });
      return this.genText;
    }
  }

  async chain() {
    // console.log('chaining ...')
    this.a = 0;
    // console.log('db read write');
    try {
      let db = await this.db;
      // console.log('db read')
      let dbRead = await this.dbRead;
      // console.log('exec variables_76 select all')
      if (db) {
        if (dbRead) {
          let vs = await db.executeSql('SELECT * from variables_76');
          let exclusion = [
            'pantun',
            'cerita',
            'siapa anda',
            'siapa kamu',
            'apa itu pegasus',
            'siapa pegasus',
            'pegasus',
            'halo',
            'hai',
            'halo pegasus',
            'hai pegasus',
            'hi pegasus',
            'aloha pegasus',
            'syalom pegasus',
          ];
          // console.log(exclusion.findIndex(e => pertanyaan.includes(e)));

          // let db = await this.db;
          // let dbRead = await this.dbRead;
          // eslint-disable-next-line eqeqeq
          if (this.pertanyaan.toLowerCase() == 'hapus pesan') {
            // console.log('hapus pesan')
            await clearMessages(db);
            return '';
          }
          // eslint-disable-next-line eqeqeq
          if (this.pertanyaan.toLowerCase() == 'clear messages') {
            // console.log('hapus pesan')
            await clearMessages(db);
            return '';
          }

          // eslint-disable-next-line eqeqeq
          if (this.pertanyaan.toLowerCase() == 'bantu aku') {
            let jawaban =
              'Halo Saya Pegasus Assistant, berikan saja pertanyaan apapun kepada saya, jika ingin menghapus pesan silahkan untuk memberikan pertanyaan ** hapus pesan ** atay ** clear messages **';
            this.fireGenerateText({
              genText: jawaban,
            });
            return jawaban;
            // return 'Halo Saya Pegasus Assistant, berikan saja pertanyaan apapun kepada saya, jika ingin menghapus pesan silahkan untuk memberikan pertanyaan ** hapus pesan ** atay ** clear messages **';
          }
          if (exclusion.findIndex(e => this.pertanyaan.includes(e)) > -1) {
            // console.log("gen text exclusion");
            this.genText = await genText(this.pertanyaan);
            // this.textGenerated(this.genText);
            this.fireGenerateText({
              genText: this.genText,
            });
            return this.genText;
          }
          if (vs[0].rows.length < 50) {
            let jawaban =
              'Maaf saya masih mengumpulkan data dari BPS Kabupaten Minahasa Utara, silahkan coba lagi beberapa saat';
            this.fireGenerateText({
              genText: jawaban,
            });
            return jawaban;
            // return 'Maaf saya masih mengumpulkan data dari BPS Kabupaten Minahasa Utara, silahkan coba lagi beberapa saat';
          }
          // let a = 0;
          const prompt = `
        Berdasarkan schema tabel dibawah, tulis sebuah SQL query berdasarkan dibawah berikut:
        --------------------
        SQL SCHEMA: CREATE TABLE variables_76 (var_id INTEGER PRIMARY KEY, subjek TEXT, judul TEXT, kategori_data TEXT, satuan TEXT, wilayah TEXT, wilayah_lower TEXT, wilayah_upper TEXT, domain TEXT, judul_upper TEXT, judul_lower TEXT, kategori_data_upper TEXT, kategori_data_lower TEXT)
        --------------------
        QUESTION: cari judul, judul_upper, judul_lower, var_id, domain, wilayah yang sesuai dengan pertanyaan '${this.pertanyaan}' dan kesampingkan kata yang berhubungan dengan bulan
        --------------------
        SQL QUERY:`;
          for (let a = this.a; a < this.attempt; a++) {
            // console.log('attempt ', a, this.attempt);
            // this.a = this.a + 1;
            // this.emit(this.attemptEventName, a + 1);
            this.fireAttempt({
              attempt: a,
            });
            // console.log('percoban sql ke ', a);
            try {
              const q = await model.generateContent([prompt]);
              let q_text = q.response.text();
              // console.log('sql response ', q_text);
              let q_ = q_text
                .substring(q_text.indexOf('```sql'), q_text.indexOf('\n```'))
                .replaceAll(/```sql/g, '')
                .replaceAll(/```+/g, '')
                .replace(
                  ';',
                  `${
                    this.pertanyaan.includes('semua') ||
                    this.pertanyaan.includes('all')
                      ? ' LIMIT 10;'
                      : ';'
                  }`,
                );
              // console.log(q_);
              try {
                let data: [ResultSet] = await getData(q_, dbRead);
                // console.log('data', data[0].rows.raw());
                if (data[0].rows.length > 0) {
                  a = this.attempt;
                  // console.log('data length ', data[0].rows.length);
                  this.resultsQuery = data;
                  this.fireResultQuery({
                    resultQuery: data,
                  });
                  return data[0].rows.raw();
                }
                if (a === this.attempt) {
                  this.genText = await genText(this.pertanyaan);
                  this.fireGenerateText({
                    genText: this.genText,
                  });
                  return this.genText;
                }
              } catch (error) {
                // console.log(q_, attempt);
                if (a === this.attempt) {
                  this.genText = await genText(this.pertanyaan);
                  this.fireGenerateText({
                    genText: this.genText,
                  });
                  return this.genText;
                }
              }
            } catch (error) {
              // console.log(error);
              this.genText =
                'Maaf layanan kami sedang mengalami gangguan silahkan coba tanyakan kembali kepada saya beberapa saat lagi';
              this.fireGenerateText({
                genText: this.genText,
              });
              return this.genText;
            }
            // this.a = this.a + 1;
          }
          this.genText = await genText(this.pertanyaan);
          this.fireGenerateText({
            genText: this.genText,
          });
          return this.genText;
        }
      }
    } catch (err) {
      console.log(err);
      this.genText =
        'Maaf layanan kami sedang mengalami gangguan silahkan coba tanyakan kembali kepada saya beberapa saat lagi';
      this.fireGenerateText({
        genText: this.genText,
      });
      return this.genText;
    } finally {
    }
  }
}

// SQL Query Chain from Gemini
export async function chain(
  pertanyaan: string,
  attempt = 7,
  db: SQLiteDatabase,
  dbRead: SQLiteDatabase,
) {
  try {
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
      console.log('percoban sql ke ', a + 1);
      try {
        const q = await model.generateContent([prompt]);
        let q_text = q.response.text();
        // console.log(q_text);
        let q_ = q_text
          .substring(q_text.indexOf('```sql'), q_text.indexOf('\n```'))
          .replaceAll(/```sql/g, '')
          .replaceAll(/```+/g, '')
          .replace(
            ';',
            `${
              pertanyaan.includes('semua') || pertanyaan.includes('all')
                ? ' LIMIT 10;'
                : ';'
            }`,
          );
        try {
          let data: [ResultSet] = await getData(q_, dbRead);
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
  } catch (err) {
    console.log(err);
  } finally {
  }
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
  try {
    const a = await model.generateContent([
      `berikan analisis deskriptif dari ${html}`,
    ]);
    // console.log(a.response.text());
    return {
      natural_response: a.response.text(),
      data: JSON.stringify(html),
    };
  } catch (error) {
    return {
      natural_response:
        'Maaf sekarang Pegasus kecapekan sehingga tidak bisa menganalisa data yang kompleks',
      data: JSON.stringify(html),
    };
  }
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
      ? // eslint-disable-next-line eqeqeq
        data.var[0].unit == ''
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
