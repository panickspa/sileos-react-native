export const default_domain = process.env.DEFAULT_DOMAIN
  ? process.env.DEFAULT_DOMAIN
  : '7106';
export const apiKey: string = process.env.BPS_API_KEY
  ? process.env.BPS_API_KEY
  : '';
export const version = process.env.API_VERSION ? process.env.API_VERSION : 'v1';
const currentDate = new Date();

const optVal = (e: [any, any]) => (e[1] ? `${e[0]}/${e[1]}/` : '');

const optValNum = (e: [any | 'var_id', any | 1]) =>
  e[1] > -1 ? `${e[0]}/${e[1]}/` : '';

export interface req {
  domain: string | '7106' | String;
  lang?: string | String | 'ind';
  page?: Number | number | 0;
  month?: string | String | any;
  year?: string | String | any;
  keyword?: string | String | any;
  subcat?: string | String | any;
  apiKey: string | String;
  version?: number | Number | string | String | any;
  area?: string | String | number | Number;
  subject?: string | String | number | Number;
  vervar?: string | String | number | Number;
  id?: string | String | number | Number;
  var?: string | String | number | Number;
  turvar?: string | String | number | Number;
  th?: string | String | number | Number;
  turth?: string | String | number | Number;
}

export const getPublication = (
  req: req = {
    domain: default_domain,
    lang: 'ind',
    page: 0,
    month: '',
    year: '',
    keyword: '',
    apiKey: '',
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/publication/domain/${
      req.domain
    }/${optVal(['page', req.page])}${optVal(['lang', req.lang])}${optVal([
      'month',
      req.month,
    ])}${optVal(['year', req.year])}${optVal(['keyword', req.keyword])}key/${
      req.apiKey
    }`,
  )
    .then(resp => resp.json())
    .catch(err => err);
export const getDetPublication = (
  req: req = {
    domain: default_domain,
    lang: 'ind',
    id: 'REQUIRED',
    apiKey: '',
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/view/model/publication/domain/${req.domain}/lang/${req.lang}/id/${req.id}/key/${req.apiKey}/`,
  )
    .then(resp => resp.json())
    .catch(err => err);

export const getSubject = (req: req) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/subject/domain/${
      req.domain
    }/${optVal(['lang', req.lang])}${optValNum(['subcat', req.subcat])}${optVal(
      ['page', req.page],
    )}key/${apiKey}/`,
  ).then(r => r.json());

export const getVar = (
  req: req = {
    domain: default_domain,
    page: 0,
    year: currentDate.getFullYear(),
    area: '',
    vervar: '',
    subject: 0,
    apiKey: apiKey,
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/var/domain/${
      req.domain
    }/${req.subject ? `subject/${req.subject}/` : ''}${optVal([
      'page',
      req.page,
    ])}${optVal(['year', req.year])}${optVal(['area', req.area])}${optVal([
      'vervar',
      req.vervar,
    ])}key/${req.apiKey}/`,
  ).then(r => r.json());

export const getSubCat = (
  req = {
    domain: default_domain,
    lang: 'ind',
    page: 0,
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/subcat/domain/${
      req.domain
    }/${optVal(['lang', req.lang])}${optVal(['page', req.page])}key/${apiKey}`,
  ).then(r => r.json());

export const getVervar = (
  req: req = {
    domain: default_domain,
    var: '',
    page: 0,
    apiKey: apiKey,
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/vervar/domain/${
      req.domain
    }/${optVal(['var', req.var])}${optVal(['page', req.page])}key/${
      req.apiKey
    }/`,
  ).then(r => r.json());

export const getPeriodData = (
  req: req = {
    domain: default_domain,
    var: '',
    page: 0,
    apiKey: apiKey,
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/th/domain/${
      req.domain
    }/${optVal(['var', req.var])}${optVal(['page', req.page])}key/${
      req.apiKey
    }/`,
  ).then(r => r.json());

export const getDerPeriodData = (
  req: req = {
    domain: default_domain,
    var: '',
    page: 0,
    apiKey: apiKey,
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/turth/domain/${
      req.domain
    }/${optVal(['var', req.var])}${optVal(['page', req.page])}key/${apiKey}/`,
  ).then(r => r.json());

export const getDerVar = (
  req: req = {
    domain: default_domain,
    var: '',
    page: 0,
    apiKey: apiKey,
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/turvar/domain/${
      req.domain
    }/${optVal(['var', req.var])}${optVal(['page', req.page])}key/${apiKey}/`,
  );
export const getDynData = (
  req: req = {
    domain: default_domain,
    var: '',
    turvar: 0,
    vervar: 0,
    th: 0,
    turth: 0,
    apiKey: apiKey,
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${version}/api/list/model/data/lang/ind/domain/${
      req.domain
    }/var/${req.var}/${optVal(['turvar', req.turvar])}${optVal([
      'vervar',
      req.vervar,
    ])}${optVal(['th', req.th])}${optVal(['turth', req.turth])}key/${apiKey}/`,
  )
    .then(r => r.json())
    .catch(err => err);

/* exported method */
export const getPressReleaseDetail = (
  domain: string | String | number | Number,
  id: string | String | number | Number,
  versions: string | String = version,
  apiKeys: String | string = apiKey,
) =>
  fetch(
    `https://webapi.bps.go.id/${versions}/api/view/domain/${domain}/model/pressrelease/lang/ind/id/${id}/key/${apiKeys}/`,
  )
    .then(resp => resp.json())
    .catch(err => err);

export const getPressReleaseList = (
  req: req = {
    domain: default_domain,
    page: 1,
    apiKey: apiKey,
    version: version,
    keyword: '',
  },
) =>
  fetch(
    `https://webapi.bps.go.id/${
      req.version ? req.version : version
    }/api/list/model/pressrelease/lang/ind/domain/${req.domain}/${
      req.keyword ? `keyword/${req.keyword}/` : ''
    }${optValNum(['page', req.page])}key/${req.apiKey}/`,
  )
    .then(resp => {
      // console.log(resp._bodyBlob);
      return resp.json();
    })
    .catch(err => err);
