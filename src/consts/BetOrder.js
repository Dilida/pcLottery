import _ from 'lodash';

// ===================== 下注 =========================

/**
 * 计算投注数
 * @param {Int} a
 * @param {Int} b
 */
export const productRange = (a, b) => {
  let [prd, i] = [a, a];

  while (i < b) {
    i += 1;
    prd *= i;
  }
  return prd;
};

/**
 * [鼠,牛][鼠,虎] 计算组合数
 * @param {Int} n 投注数
 * @param {Int} r 组合数
 */
export const lianMaRule = (obj, r) => {
  const n = obj.length;
  if (n === r) { return 1; }
  if (n < r) { return 0; }
  r = (r < n - r) ? n - r : r;
  return productRange(r + 1, n) / productRange(1, n - r);
};

/**
 * 多投1注
 * @param {Int} n 投注数
 * @param {Int} r 最低投注数
 */
export const oneRule = (obj, r) => {
  const n = obj.length;
  if (n >= r) {
    return 1;
  }
  return 0;
};

/**
 * @name 广东快十，连二连直，下注注数计算
 */
export const groupRule = (obj) => {
  const zero = obj.filter(f => f.group === 0);
  const one = obj.filter(f => f.group === 1);
  if (zero.length > 0 && one.length > 0) return zero.length * one.length;
  return 0;
};

// ===================== 下注清单 =========================

/**
 * 格式化赔率
 * @param {String, Number} val
 */
export const payoffFormat = val => (Number(val) / 10000).toFixed(3);

export const monAmt = num => (/^[-+]?\d+(\.\d*)?$/.test(num) ? num * 100 : '');

/**
 * @name 下注清单，取得连肖组合
 *
 * @param {arr} arr
 * @param {Int} size 要组合的数字 三个一组 或 两个一组
 */
export const getCombination = (arr, size, result = [], allResult = []) => {
  const arrLen = arr.length;
  if (size > arrLen) {
    return allResult;
  }
  if (size === arrLen) {
    allResult.push([].concat(result, arr));
  } else {
    arr.forEach((arrItem, i) => {
      const newResult = [].concat(result);
      newResult.push(arrItem);
      if (size === 1) {
        allResult.push(newResult);
      } else {
        const newArr = [].concat(arr);
        newArr.splice(0, i + 1);
        getCombination(newArr, size - 1, newResult, allResult);
      }
    });
  }
  return allResult;
};

/**
 * @name 下注清单，广东快十，连二连直，选注组合
 * @param {Array} arr
 * @param {Object} parent
 */
export const getGroup = (arr) => {
  const zero = arr.filter(f => f.group === 0);
  const one = arr.filter(f => f.group === 1);
  const all = [];
  if (zero.length > 0 && one.length > 0) {
    zero.forEach((z) => {
      z.playName = '连二连直';
      one.forEach((o) => {
        all.push([z, o]);
      });
    });
  }
  return all;
};


/**
 * 前端显示 与后端投注需要的文字不同 需作替换
 */
export const betContent = new Map([
  [1011205, '红'], [1011206, '蓝'], [1011207, '绿'], [1012205, '红'], [1012206, '蓝'],
  [1012207, '绿'], [1021101, '大'], [1021102, '小'], [1021103, '单'], [1021104, '双'],
  [1021105, '大'], [1021106, '小'], [1021107, '单'], [1021108, '双'], [1021109, '天肖'],
  [1021110, '地肖'], [1021111, '前肖'], [1021112, '后肖'], [1021113, '家肖'], [1021114, '野肖'],
  [1021115, '大'], [1021116, '小'], [1021117, '大单'], [1021118, '大双'], [1021119, '小单'],
  [1021120, '小双'], [1021201, '大'], [1021202, '小'], [1021203, '单'], [1021204, '双'],
  [1031201, '大'], [1031202, '小'], [1031203, '单'], [1031204, '双'], [1041105, '大'],
  [1041106, '小'], [1041107, '单'], [1041108, '双'], [1041109, '大'], [1041110, '小'],
  [1041111, '红'], [1041112, '蓝'], [1041113, '绿'], [1042105, '大'], [1042106, '小'],
  [1042107, '单'], [1042108, '双'], [1042109, '大'], [1042110, '小'], [1042111, '红'],
  [1042112, '蓝'], [1042113, '绿'], [1043105, '大'], [1043106, '小'], [1043107, '单'],
  [1043108, '双'], [1043109, '大'], [1043110, '小'], [1043111, '红'], [1043112, '蓝'],
  [1043113, '绿'], [1044105, '大'], [1044106, '小'], [1044107, '单'], [1044108, '双'],
  [1044109, '大'], [1044110, '小'], [1044111, '红'], [1044112, '蓝'], [1044113, '绿'],
  [1045105, '大'], [1045106, '小'], [1045107, '单'], [1045108, '双'], [1045109, '大'],
  [1045110, '小'], [1045111, '红'], [1045112, '蓝'], [1045113, '绿'], [1046105, '大'],
  [1046106, '小'], [1046107, '单'], [1046108, '双'], [1046109, '大'], [1046110, '小'],
  [1046111, '红'], [1046112, '蓝'], [1046113, '绿'], [1051205, '大'], [1051206, '小'],
  [1051207, '单'], [1051208, '双'], [1051209, '大'], [1051210, '小'], [1051211, '红'],
  [1051212, '蓝'], [1051213, '绿'], [1052205, '大'], [1052206, '小'], [1052207, '单'],
  [1052208, '双'], [1052209, '大'], [1052210, '小'], [1052211, '红'], [1052212, '蓝'],
  [1052213, '绿'], [1053205, '大'], [1053206, '小'], [1053207, '单'], [1053208, '双'],
  [1053209, '大'], [1053210, '小'], [1053211, '红'], [1053212, '蓝'], [1053213, '绿'],
  [1054205, '大'], [1054206, '小'], [1054207, '单'], [1054208, '双'], [1054209, '大'],
  [1054210, '小'], [1054211, '红'], [1054212, '蓝'], [1054213, '绿'], [1055205, '大'],
  [1055206, '小'], [1055207, '单'], [1055208, '双'], [1055209, '大'], [1055210, '小'],
  [1055211, '红'], [1055212, '蓝'], [1055213, '绿'], [1056205, '大'], [1056206, '小'],
  [1056207, '单'], [1056208, '双'], [1056209, '大'], [1056210, '小'], [1056211, '红'],
  [1056212, '蓝'], [1056213, '绿'], [1071101, '红'], [1071102, '蓝'], [1071103, '绿'],
  [1071201, '红'], [1071202, '蓝'], [1071203, '绿'], [1071204, '和'], [1071301, '单'],
  [1071302, '双'], [1071303, '大'], [1071304, '小'], [1071401, '单'], [1071402, '双'],
  [1071403, '大'], [1071404, '小'], [1071501, '单'], [1071502, '双'], [1071503, '大'],
  [1071504, '小'], [1081101, '0'], [1081102, '1'], [1081103, '2'], [1081104, '3'],
  [1081105, '4'], [1081201, '0'], [1081202, '1'], [1081203, '2'], [1081204, '3'],
  [1081205, '4'], [1081206, '5'], [1081207, '6'], [1081208, '7'], [1081209, '8'],
  [1081210, '9'], [1091101, '2'], [1091102, '3'], [1091103, '4'], [1091104, '5'],
  [1091105, '6'], [1091106, '7'], [1091107, '单'], [1091108, '双'], [1101201, '0'],
  [1101202, '1'], [1101203, '2'], [1101204, '3'], [1101205, '4'], [1101206, '5'],
  [1101207, '6'], [1101208, '7'], [1101209, '8'], [1101210, '9'],
]);

// item.parentId
const mobile = [
  {
    name: 'col-4',
    cids: [
      181101, 181102, 181103, 181201, 181202, 181203, 181204, 181205, 181206,
      381101, 381102, 381103, 21605, 21606, 21607, 1010000, 1050000, 1030000,
      1011100, 1012100, 1031100, 1051100, 1052000,
      // 正特
      1051100, 1052100, 1053100, 1054100, 1055100, 1056100,
      // 1051200, 1052200, 1053200, 1054200, 1055200, 1056200,
      // 连码
      1061100, 1063100, 1065100, 1066100,
      // 广东快十趣味
      401101, 401102, 401103, 401200,
    ],
  },
  {
    name: 'bet-item--5 bet-ball',
    cids: [
      22000, 22100, 22200, 22300, 22400, 22500,
      121200,
      42100, 42200, 42300, 42400, 42500,
      42600, 43100, 43200, 43300, 43400,
      43500, 43600, 43700, 43800, 43900,
    ],
  },
  {
    name: 'bet-item--5',
    cids: [
      1171000,
    ],
  },
  {
    name: 'bet-item__name',
    cids: [
      1171100,
    ],
  },
  {
    name: 'bet-item--4 bet-ball',
    cids: [
      403200, 403100, 403300, 403400,
      402100, 402200, 402300, 402400, 402500,
      382100, 382200, 382300, 382400,
      182100, 182200, 182300, 182400, 182500,
    ],
    fun: (cid) => {
      const num = parseInt(cid.toString().substr(0, 3), 10);
      const last = parseInt(cid.toString().substr(-2, 2), 10);
      if (num === 383 && (last >= 9 && last <= 29)) return true;
      return false;
    },
  },
  {
    name: 'bet-item--k3-one row col-6 bet-k3',
    cids: [61100],
  },
  {
    name: 'bet-item--k3-3same row col-6 bet-k3',
    cids: [63100],
  },
  {
    name: 'col-12 bet-sheng-xiao',
    cids: [
      1101100, 1101200,
      1111100, 1111200, 1111300, 1111400, // 连肖
      1141100, 1141200, 1141300, 1141400, // 连尾
      1081200, 1121100, 1131000, 1131100, 1151190,
    ],
  },
];
// item.parentId
const pc = [
  {
    name: 'bet-item-column--10 bet-item-round',
    cids: [
    // 自选不中
      1171000,
    ],
  },
  {
    name: 'bet-item-column--5',
    cids: [
      1010000, 1050000, 1030000,
      1011100, 1012100, 1031100, 1051100, 1052000,
      // 正特
      1051100, 1052100, 1053100, 1054100, 1055100, 1056100,
      // 1051200, 1052200, 1053200, 1054200, 1055200, 1056200,
      // 连码
      1061100, 1063100, 1065100, 1066100,
      1100000, 1110000, 1140000, 1080000, 1120000, 1130000, 1150000,
      // 1161100, // 五行特码
      22000, 22100, 22200, 22300, 22400, 22500,
      121200,
      42100, 42200, 42300, 42400, 42500,
      42600, 43100, 43200, 43300, 43400,
      43500, 43600, 43700, 43800, 43900,
      // 快乐8 趣味
      182100, 182200, 182300, 182400, 182500,
      // 广西快十 任选
      382100, 382200, 382300, 382400,
    ],
  },
  {
    name: 'bet-item-column--4',
    cids: [
      1090000,
      // 1160000,
    ],
  },
  {
    name: 'bet-item-column--4',
    cids: [
      1010000, 1020000, 1070000, 1030000, 1040000, 1050000, 1060000,
    ],
    fun: (cid) => {
      const num = parseInt(cid.toString().substr(0, 3), 10);
      const last = parseInt(cid.toString().substr(-2, 2), 10);
      if (num === 383 && (last >= 9 && last <= 29)) return true;
      return false;
    },
  },
  {
    name: 'bet-item-column--3',
    cids: [
    // 快3
      61100, 63100, 63200,
      // 广东快十趣味
      401200,
    ],
  },
  // 六合彩-特码五行特别给class
  {
    name: 'bet-item--lhc-tmwx',
    cids: [
      1161100,
    ],
  },
  {
    name: 'bet-item-column--1',
    cids: [
      1161100,
    ],
  },
  {
    name: 'bet-item-column--2',
    cids: [
      1101100, 1101200,
      1111100, 1111200, 1111300, 1111400, // 连肖
      1141100, 1141200, 1141300, 1141400, // 连尾
      1081200, 1121100, 1131000, 1131100, 1151190,
      // 广东快十趣味
      401300, 401400, 401500, 401600,
      // 广西快十趣味
      381200, 381300, 381400, 381500,
    ],
  },
];

export const getItemClass = (cid, type = 'pc') => {
  let itemClass = mobile;
  if (type === 'pc') {
    itemClass = pc;
  }
  const obj = itemClass.find((f) => {
    if (f.cids && f.cids.includes(cid)) {
      return true;
    }
    if (f.fun && f.fun(cid)) {
      return true;
    }
    return false;
  });
  if (obj) return obj.name;
  return false;
};

// ===================== 玩法树 =========================
/**
 * @name 取出子玩法
 * @param {Array} parrent 原內容
 * @param {Array} restree 新內容
 */
export const flattenTree = (parrent, restree = []) => {
  restree = [...restree, ...parrent];

  let child = [];
  parrent.forEach((ch) => {
    if (ch.childrens) {
      ch.childrens = _.orderBy(ch.childrens, ['orderCount']);
      ch.childrens.forEach((i) => {
        child = [...child, i];
      });
    }
  });
  if (child.length > 0) {
    return flattenTree(child, restree);
  }
  return restree;
};
/**
 * 建立ARRAY
 * @param {Int} range 需产生的数字
 */
export const arrayRange = range => Array.from(Array(range).keys()).map(i => i + 1);

// 六合彩连尾
export const lianWeiList = ['0尾', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾'];
// 连尾0-9 & 数字
export const lianWei = () => {
  const play = arrayRange(49).map(i => ({
    value: i % lianWeiList.length,
    name: i.toString().padStart(2, 0),
  }));
  const list = lianWeiList.map((item, i) => ({
    name: item,
    value: i,
    key: play.filter(f => f.value === i),
  }));
  return list;
};
// 生肖
export const shengXiaoList = new Map([
  [2020, '鼠'],
  [2021, '牛'],
  [2022, '虎'],
  [2023, '兔'],
  [2024, '龙'],
  [2025, '蛇'],
  [2026, '马'],
  [2027, '羊'],
  [2028, '猴'],
  [2029, '鸡'],
  [2018, '狗'],
  [2019, '猪'],
]);
// 生肖数字
export const shengXiaoCount = shengXiaoList.size;
// 取得本命年生肖排序 及球数
export const getZodiac = () => {
  const year = new Date().getFullYear();
  return shengXiaoList.get(year);
};
export const shengXiao = (range = 49) => {
  const zodiac = getZodiac();

  // 复制原始 翻转
  const reverseShengXiaoList = [...shengXiaoList.values()].reverse();

  // 当年度生肖起始数字
  const zodiacStartNumber = reverseShengXiaoList.indexOf(zodiac);

  // 生肖计算顺序
  const newShengXiao = [...reverseShengXiaoList.slice(zodiacStartNumber),
    ...reverseShengXiaoList.slice(0, zodiacStartNumber)];

  const ballRang = arrayRange(range).map(m => ({
    name: m.toString().padStart(2, 0),
    value: (m - 1) % shengXiaoCount,
  }));
    // 整理
  return [...shengXiaoList.values()].map((item) => {
    const index = newShengXiao.indexOf(item);
    return {
      name: item,
      value: index,
      key: ballRang.filter(f => f.value === index),
    };
  });
};

/**
 * @name 自行产生注号
 * @param {Object} obj 要产生的注号内容参考
 * @param {Int} range 要产生的数字区间
 * @param {Boolean} pad 是不是要补0
 */
export const createListByRange = (obj, range, pad = false) => arrayRange(range).map(m => (
  _.extend({}, obj, { name: pad ? m.toString().padStart(2, 0) : m })
));

/**
 * @name 产生GROUP
 * @param {Object} obj 原始投注内容
 * @param {Int} range 要建立的区间
 * @param {Boolean} pad 补0
 */
export const createGroupList = (obj, range, pad) => _.extend(
  obj,
  {
    childrens: createListByRange(obj.childrens[0], range, pad),
    parentId: obj.cid,
  },
);

export const createGxk10WithBall = (obj) => {
  const playGroup = [{
    name: '两面', key: { min: 1, max: 8 },
  }, {
    name: '球', key: { min: 9, max: 29 },
  }];
  const newChild = playGroup.map((item) => {
    if (item.name !== '两面') item.name = obj.name;
    return {
      cid: obj.cid,
      parentId: obj.cid,
      name: item.name,
      childrens: obj.childrens.filter((f) => {
        const last = parseInt(f.cid.toString().substr(-2, 2), 10);
        return last >= item.key.min && last <= item.key.max;
      }),
    };
  });
  obj.childrens = newChild;
  obj.parentId = obj.cid;
  obj.flatten = true;
  return obj;
};

// 連碼
export const createLianMaList = (obj, range = 49) => {
  obj.childrens = createListByRange(obj.childrens[0], range, true);
  return obj;
};

// 尾数
export const appendLianWeiKey = (obj) => {
  obj.childrens.forEach((item) => {
    item.key = lianWei().find(f => `${f.value}尾` === item.name).key;
  });
  return obj;
};

// 生肖数字
export const appendShengXiaoKey = (obj) => {
  const newKeyObj = shengXiao();
  obj.childrens.forEach((item) => {
    const keyObj = newKeyObj.find(f => f.name === item.name);
    item.key = keyObj.key;
  });
  return obj;
};

// 连肖 产生鼠-猪+数字
export const createShengXiaoAndKey = (obj) => {
  const zodiac = getZodiac();
  const life = obj.childrens.find(f => f.name === '本命');
  const notLife = obj.childrens.find(f => f.name === '非本命');
  const play = obj.childrens.find(f => f.name.includes('连肖'));

  play.childrens = shengXiao().map((item) => {
    item.playName = play.playName;
    item.cid = play.cid;
    if (item.name === zodiac) {
      return _.extend({}, life, item);
    }
    return _.extend({}, notLife, item);
  });
  return play;
};

// 连尾 产生尾数0-9+数字
export const createLianWeiAndKey = (obj) => {
  const zeroWei = obj.childrens.find(f => f.name === '0尾');
  const notZeroWei = obj.childrens.find(f => f.name === '非0尾');
  const play = obj.childrens.find(f => f.name.includes('连尾'));

  play.childrens = lianWei().map((item) => {
    item.playName = play.playName;
    item.cid = play.cid;
    if (item.value === 0) {
      return _.extend({}, zeroWei, item);
    }
    return _.extend({}, notZeroWei, item);
  });
  return play;
};

export const playTreeGroup = [
  {
    label: '区块链彩',
    layout: 'ssc block',
    cids: [48, 50, 52],
  },
  {
    label: '时时彩',
    layout: 'ssc',
    cids: [2, 12, 14, 26, 28, 32, 102, 112, 114, 116, 120],
  },
  {
    label: '11选5',
    layout: '11x5',
    cids: [4, 16, 18, 104],
  },
  {
    label: '六合彩',
    layout: 'lhc',
    cids: [10, 110],
  },
  {
    label: '快三',
    layout: 'k3',
    cids: [6, 20, 22, 106],
  },
  {
    label: 'PK10',
    layout: 'pk10',
    cids: [8, 24, 108, 118],
  },
  {
    label: '幸运28',
    layout: 'xy28',
    cids: [30],
  },
  {
    label: '快乐8',
    layout: 'kl8',
    cids: [34, 42, 44],
  },
  {
    label: '广东快十',
    layout: 'k10a',
    cids: [40, 46],
  },
  {
    label: '广西快十',
    layout: 'k10b',
    cids: [38],
  },
];

/**
 * @name 彩种玩法
 *
 * @param {Array} cids 彩种id
 * @param {Object} kinds 玩法编号:玩法名称
 */
export const playTree = [
  // ssc
  {
    layout: 'ssc',
    cids: [2, 12, 14, 26, 28, 32, 102, 112, 114, 116, 120, 48, 50, 52],
    kinds: [
      {
        cid: 21000,
        clear: false,
        name: '两面',
        groupIds: [[21100, 21200, 21300, 21400, 21500, 21600]],
      },
      {
        cid: 22000,
        clear: false,
        name: '1-5球',
        groupIds: [[22100, 22200, 22300, 22400, 22500]],
      },
      {
        cid: 23000,
        clear: false,
        name: '前中后',
        groupIds: [[23100, 23200, 23300]],
      },
    ],
  },
  // 11x5
  {
    layout: '11x5',
    cids: [4, 16, 18, 104],
    kinds: [
      {
        cid: 41000,
        clear: false,
        name: '两面',
        groupIds: [[41600, 41100, 41200, 41300, 41400, 41500]],
      },
      {
        cid: 42000,
        clear: false,
        name: '1-5球',
        groupIds: [[42100, 42200, 42300, 42400, 42500]],
      },
      {
        cid: 43000,
        clear: true,
        name: '连码',
        tabIds: [42600, 43100, 43200, 43300, 43400, 43500, 43600, 43700, 43800, 43900],
        groupIds: [
          [42600], [43100], [43200], [43300], [43400],
          [43500], [43600], [43700], [43800], [43900],
        ],
      },
    ],
  },
  // k3
  {
    layout: 'k3',
    cids: [6, 20, 22, 106],
    kinds: [
      {
        cid: 61000,
        clear: false,
        name: '单骰',
        groupIds: [[61100]],
      },
      {
        cid: 62000,
        clear: false,
        name: '不同号',
        groupIds: [[62100]],
      },
      {
        cid: 63000,
        clear: false,
        name: '同号',
        groupIds: [[63100, 63200]],
      },
      {
        cid: 64000,
        clear: false,
        name: '总和',
        groupIds: [[64100]],
      },
    ],
  },
  // pk10
  {
    layout: 'pk10',
    cids: [8, 24, 108, 118],
    kinds: [
      {
        cid: 81000,
        clear: false,
        name: '两面',
        groupIds: [[
          82500, 81100, 81200, 81300, 81400, 81500,
          81600, 81700, 81800, 81900, 82400,
        ]],
      },
      {
        cid: 82000,
        clear: false,
        name: '冠亚和值',
        groupIds: [[82100]],
      },
      {
        cid: 83000,
        clear: false,
        name: '1-5名',
        groupIds: [[83100, 83200, 83300, 83400, 83500]],
      },
      {
        cid: 84000,
        clear: false,
        name: '6-10名',
        groupIds: [[84100, 84200, 84300, 84400, 84500]],
      },
    ],
  },
  // lhc
  {
    layout: 'lhc',
    cids: [10, 110],
    kinds: [
      {
        cid: 1010000,
        clear: true,
        name: '特码',
        tabIds: [1011000, 1012000], // cid
        groupIds: [[1011100, 1011200], [1012100, 1012200]], // cid
      },
      {
        cid: 1100000,
        clear: true,
        name: '平特肖尾',
        groupIds: [[1101100, 1101200]],
      },
      {
        cid: 1020000,
        clear: true,
        name: '两面',
        groupIds: [[1021100, 1021200]],
      },
      {
        cid: 1070000,
        clear: true,
        name: '色波',
        groupIds: [[1071100, 1071200, 1071300, 1071400, 1071500]],
      },
      {
        cid: 1030000,
        clear: true,
        name: '正码',
        groupIds: [[1031100, 1031200]],
      },
      {
        cid: 1040000,
        clear: true,
        name: '正码1-6',
        // tabIds: [1041000, 1042000, 1043000, 1044000, 1045000, 1046000],
        // groupIds: [[1041100], [1042100], [1043100], [1044100], [1045100], [1046100]],
        groupIds: [[1041100, 1042100, 1043100, 1044100, 1045100, 1046100]],
      },
      {
        cid: 1050000,
        clear: true,
        name: '正特',
        tabIds: [1051000, 1052000, 1053000, 1054000, 1055000, 1056000],
        groupIds: [
          [1051100, 1051200],
          [1052100, 1052200],
          [1053100, 1053200],
          [1054100, 1054200],
          [1055100, 1055200],
          [1056100, 1056200],
        ],
      },
      {
        cid: 1060000,
        clear: true,
        name: '连码',
        tabIds: [1061000, 1062000, 1063000, 1064000, 1065000, 1066000],
        groupIds: [[1061100], [1062100], [1063100], [1064100], [1065100], [1066100]],
      },
      {
        cid: 1170000,
        clear: true,
        name: '自选不中',
        groupIds: [[1171100]],
      },
      {
        cid: 1110000,
        clear: true,
        name: '连肖',
        tabIds: [1111100, 1111200, 1111300, 1111400],
        groupIds: [[1111100], [1111200], [1111300], [1111400]],
      },
      {
        cid: 1140000,
        clear: true,
        name: '连尾',
        tabIds: [1141100, 1141200, 1141300, 1141400],
        groupIds: [[1141100], [1141200], [1141300], [1141400]],
      },
      {
        cid: 1080000,
        clear: true,
        name: '特码头尾',
        groupIds: [[1081100, 1081200]],
      },
      {
        cid: 1090000,
        clear: true,
        name: '总肖',
        groupIds: [[1091100]],
      },
      {
        cid: 1120000,
        clear: true,
        name: '特肖',
        groupIds: [[1121100]],
      },
      {
        cid: 1130000,
        clear: true,
        name: '合肖',
        groupIds: [[1131100]],
      },
      {
        cid: 1150000,
        clear: true,
        name: '正肖',
        groupIds: [[1151100]],
      },
      {
        cid: 1160000,
        clear: true,
        name: '特码五行',
        groupIds: [[1161100]],
      },
    ],
  },
  // xy28
  {
    layout: 'xy28',
    cids: [30],
    kinds: [
      {
        cid: 121000,
        clear: false,
        name: '混合',
        groupIds: [[121100]],
      }, {
        cid: 122000,
        clear: false,
        name: '特码和值',
        groupIds: [[121200]],
      },
    ],
  },
  // kl8
  {
    layout: 'kl8',
    cids: [34, 42, 44],
    kinds: [
      {
        cid: 181000,
        clear: true,
        name: '趣味',
        groupIds: [[181100, 181200]],
      }, {
        cid: 182000,
        clear: true,
        name: '任选',
        tabIds: [182100, 182200, 182300, 182400, 182500],
        groupIds: [[182100], [182200], [182300], [182400], [182500]],
      },
    ],
  },
  // 广东k10
  {
    layout: 'k10a',
    cids: [40, 46],
    kinds: [
      {
        cid: 401000,
        clear: false,
        name: '趣味',
        groupIds: [[401100, 401200, 401300, 401400, 401500, 401600]],
      },
      {
        cid: 402000,
        clear: true,
        name: '任选',
        tabIds: [402100, 402200, 402300, 402400, 402500],
        groupIds: [[402100], [402200], [402300], [402400], [402500]],
      },
      {
        cid: 403000,
        clear: true,
        name: '连码',
        tabIds: [403100, 403200, 403300, 403400],
        groupIds: [[403100], [403200], [403300], [403400]],
      },
      {
        cid: 404000,
        clear: false,
        name: '1-4球',
        groupIds: [[404100, 404200, 404300, 404400]],
      },
      {
        cid: 405000,
        clear: false,
        name: '5-8球',
        groupIds: [[405100, 405200, 405300, 405400]],
      },
    ],
  },
  // 广西k10
  {
    layout: 'k10b',
    cids: [38],
    kinds: [
      {
        cid: 381000,
        clear: false,
        name: '趣味',
        groupIds: [[381100, 381200, 381300, 381400, 381500]],
      },
      {
        cid: 382000,
        clear: true,
        name: '任选',
        tabIds: [382100, 382200, 382300, 382400],
        groupIds: [[382100], [382200], [382300], [382400]],
      },
      {
        cid: 383000,
        clear: true,
        name: '1-5球',
        tabIds: [383100, 383200, 383300, 383400, 383500],
        groupIds: [[383100], [383200], [383300], [383400], [383500]],
      }],
  },
];

// 组合投注方式
// normal 标准
// combine 连码 选注完全相同数字 max = min
// grouped 组选 min ~ max 且不重复
// yzycombine 设置为普通 一中一 连码玩法
// combination
export const playType = {
  combine: [
    182100, 182200, 182300, 182400, 182500,
    43100, 43200, 43300, 43400, 43500, 43600, 43700,
    1130000, 1170000,
    382200, 382300, 382400,
    403100, 403300, 403400, 402200, 402300, 402400, 402500,
    43800, 43900,
    1061000, 1062000, 1063000, 1064000, 1065000, 1066000,
    1060000,
  ],
  // grouped: [43800, 43900],
  // yzycombine: [42600],
  // combination: [1061000, 1062000, 1063000, 1064000, 1065000, 1066000],
  group: [
    1110000, 1111100, 1111200, 1111300, 1111400,
    1140000, 1141100, 1141200, 1141300, 1141400,
  ], // 连肖/合肖和自選不中
  k10group: [403200], // 广东快十 连码 连二连直
};

// 选注规则
export const selectRules = {
  // kl8
  182100: {
    max: 1,
    list: obj => createGroupList(obj, 80, true),
    fun: (obj, limit = 1) => oneRule(obj, limit),
  },
  182200: {
    max: 2,
    list: obj => createGroupList(obj, 80, true),
    fun: (obj, limit = 2) => oneRule(obj, limit),
  },
  182300: {
    max: 3,
    list: obj => createGroupList(obj, 80, true),
    fun: (obj, limit = 3) => oneRule(obj, limit),
  },
  182400: {
    max: 4,
    list: obj => createGroupList(obj, 80, true),
    fun: (obj, limit = 4) => oneRule(obj, limit),
  },
  182500: {
    max: 5,
    list: obj => createGroupList(obj, 80, true),
    fun: (obj, limit = 5) => oneRule(obj, limit),
  },
  // 11x5
  43000: {
    list: (obj) => {
      if (obj.parentId === 42600) return obj;
      return createListByRange(obj, 11);
    },
  },
  42600: {
    max: 1,
    list: (obj) => {
      obj.parentId = obj.cid;
      return obj;
    },
    fun: (obj, limit = 1) => oneRule(obj, limit),
  },
  43100: {
    max: 2,
    list: obj => createGroupList(obj, 11),
    fun: (obj, limit = 2) => oneRule(obj, limit),
  },
  43200: {
    max: 3,
    list: obj => createGroupList(obj, 11),
    fun: (obj, limit = 3) => oneRule(obj, limit),
  },
  43300: {
    max: 4,
    list: obj => createGroupList(obj, 11),
    fun: (obj, limit = 4) => oneRule(obj, limit),
  },
  43400: {
    max: 5,
    list: obj => createGroupList(obj, 11),
    fun: (obj, limit = 5) => oneRule(obj, limit),
  },
  43500: {
    max: 6,
    list: obj => createGroupList(obj, 11),
    fun: (obj, limit = 6) => oneRule(obj, limit),
  },
  43600: {
    max: 7,
    list: obj => createGroupList(obj, 11),
    fun: (obj, limit = 7) => oneRule(obj, limit),
  },
  43700: {
    max: 8,
    list: obj => createGroupList(obj, 11),
    fun: (obj, limit = 8) => oneRule(obj, limit),
  },
  43800: {
    max: 5,
    fun(obj) {
      const xslen = obj.length;
      return parseInt(xslen * ((xslen - 1) / 2), 10);
    },
    list: obj => createGroupList(obj, 11),
  },
  43900: {
    max: 5,
    fun(obj) {
      const xslen = obj.length;
      return parseInt(((xslen * (xslen - 1)) * (xslen - 2)) / 6, 10);
    },
    list: obj => createGroupList(obj, 11),
  },
  // lhc
  1100000: {
    // fun: obj => obj.length,
  },
  // 平特肖尾 一肖
  1101100: {
    list: obj => appendShengXiaoKey(obj),
  },
  // 平特肖尾 尾数
  1101200: {
    list: obj => appendLianWeiKey(obj),
  },
  // 连码
  1061000: { // 三全中
    max: 10,
    fun: (obj, limit = 3) => lianMaRule(obj, limit),
  },
  1061100: {
    list: obj => createLianMaList(obj),
  },
  1062000: { // 三中二
    max: 7,
    fun: (obj, limit = 3) => lianMaRule(obj, limit),
  },
  1062100: {
    list: (obj) => {
      obj.payoffGroup = obj.childrens;
      obj = createLianMaList(obj);
      obj.childrens.forEach((item) => {
        item.oddsData.orpayoff = obj.payoffGroup.map(m => m.oddsData.payoff);
      });
      return obj;
    },
  },
  1063000: { // 二全中
    max: 7,
    fun: (obj, limit = 2) => lianMaRule(obj, limit),
  },
  1063100: {
    list: obj => createLianMaList(obj),
  },
  1064000: { // 二中特
    max: 7,
    fun: (obj, limit = 2) => lianMaRule(obj, limit),
  },
  1064100: {
    list: (obj) => {
      obj.payoffGroup = obj.childrens;
      obj = createLianMaList(obj);
      obj.childrens.forEach((item) => {
        item.oddsData.orpayoff = obj.payoffGroup.map(m => m.oddsData.payoff);
      });
      return obj;
    },
  },
  1065000: { // 特串
    max: 7,
    fun: (obj, limit = 2) => lianMaRule(obj, limit),
  },
  1065100: {
    list: obj => createLianMaList(obj),
  },
  1066000: { // 四全中
    max: 4,
    fun: (obj, limit = 4) => lianMaRule(obj, limit),
  },
  1066100: {
    list: obj => createLianMaList(obj),
  },
  // 特码头尾
  1080000: {
    // fun: obj => obj.length,
  },
  1081200: {
    list: obj => appendLianWeiKey(obj),
  },
  // 连肖 二连肖
  1111100: {
    limit: 2,
    fun: (obj, limit = 2) => lianMaRule(obj, limit),
    combin: (data, limit = 2) => getCombination(data, limit),
    list: obj => createShengXiaoAndKey(obj),
  },
  // 连肖 三连肖
  1111200: {
    limit: 3,
    combin: (data, limit = 3) => getCombination(data, limit),
    fun: (obj, limit = 3) => lianMaRule(obj, limit),
    list: obj => createShengXiaoAndKey(obj),
  },
  // 连肖 四连肖
  1111300: {
    limit: 4,
    combin: (data, limit = 4) => getCombination(data, limit),
    fun: (obj, limit = 4) => lianMaRule(obj, limit),
    list: obj => createShengXiaoAndKey(obj),
  },
  // 连肖 五连肖
  1111400: {
    limit: 5,
    combin: (data, limit = 5) => getCombination(data, limit),
    fun: (obj, limit = 5) => lianMaRule(obj, limit),
    list: obj => createShengXiaoAndKey(obj),
  },
  // 特肖
  1120000: {
    // fun: obj => obj.length,
  },
  1121100: {
    list: obj => appendShengXiaoKey(obj),
  },
  // 合肖
  1130000: {
    max: 11,
    fun: (obj, limit = 2) => oneRule(obj, limit),
  },
  1131100: {
    list: (obj) => {
      obj.payoffGroup = obj.childrens;
      obj.payoffGroup.forEach((payoff) => {
        payoff.payoffFormat = payoffFormat(payoff.oddsData.payoff);
      });
      obj.childrens = shengXiao(48).map(item => ({
        name: item.name,
        key: item.key,
        cid: obj.cid,
        parentId: obj.parentId,
      }));
      return obj;
    },
  },
  // 二连尾
  1141100: {
    limit: 2,
    fun: (obj, limit = 2) => lianMaRule(obj, limit),
    combin: (data, limit = 2) => getCombination(data, limit),
    list: obj => createLianWeiAndKey(obj),
  },
  // 三连尾
  1141200: {
    limit: 3,
    combin: (data, limit = 3) => getCombination(data, limit),
    fun: (obj, limit = 3) => lianMaRule(obj, limit),
    list: obj => createLianWeiAndKey(obj),
  },
  // 四连尾
  1141300: {
    limit: 4,
    combin: (data, limit = 4) => getCombination(data, limit),
    fun: (obj, limit = 4) => lianMaRule(obj, limit),
    list: obj => createLianWeiAndKey(obj),
  },
  // 五连尾
  1141400: {
    limit: 5,
    combin: (data, limit = 5) => getCombination(data, limit),
    fun: (obj, limit = 5) => lianMaRule(obj, limit),
    list: obj => createLianWeiAndKey(obj),
  },
  1151100: {
    list: (obj) => {
      obj.payoffGroup = obj.childrens;
      obj.childrens = shengXiao().map((item) => {
        const cid = item.value === 0 ? 1151101 : 1151106; // 本命/非本命
        const play = obj.payoffGroup.find(f => f.cid === cid);
        _.extend(item, {
          parentId: 1151190,
          cid: 1151190,
          oddsData: play.oddsData,
        });
        return item;
      });
      return obj;
    },
  },
  1161100: {
    list: (obj) => {
      // console.log(obj);
      // TODO: 2018年暫用 待java開發CAIPIAOH5-2092
      const teMaWuXingList = [
        { name: '金', key: [4, 5, 18, 19, 26, 27, 34, 35, 48, 49] },
        { name: '木', key: [1, 8, 9, 16, 17, 30, 31, 38, 39, 46, 47] },
        { name: '水', key: [6, 7, 14, 15, 22, 23, 36, 37, 44, 45] },
        { name: '火', key: [2, 3, 10, 11, 24, 25, 32, 33, 40, 41] },
        { name: '土', key: [12, 13, 20, 21, 28, 29, 42, 43] },
      ];
      // teMaWuXing(); // TODO: 已開始待完成
      obj.childrens.forEach((item) => {
        const key = teMaWuXingList.find(f => f.name === item.name);
        key.key = key.key.map(name => ({ name: name.toString().padStart(2, 0) }));
        _.extend(item, key);
      });
      return obj;
    },
  },
  1170000: { // 自选不中
    max: 12,
    fun: (obj, limit = 5) => oneRule(obj, limit),
  },
  1171100: {
    list: (obj, range = 49) => {
      obj.payoffGroup = obj.childrens;
      obj.payoffGroup.forEach((payoff) => {
        payoff.payoffFormat = payoffFormat(payoff.oddsData.payoff);
      });
      obj.childrens = createListByRange(obj, range, true).map((item) => {
        ['childrens', 'payoffGroup'].forEach((key) => {
          _.unset(item, key);
        });
        return item;
      });
      return obj;
    },
  },
  // 广西快十
  382100: {
    max: 1,
    list: obj => createGroupList(obj, 21, false),
  },
  382200: {
    max: 2,
    fun: (obj, limit = 2) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 21, false),
  },
  382300: {
    max: 3,
    fun: (obj, limit = 3) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 21, false),
  },
  382400: {
    max: 4,
    fun: (obj, limit = 4) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 21, false),
  },
  // 广西快十 1-5球
  383100: {
    list: obj => createGxk10WithBall(obj),
  },
  383200: {
    list: obj => createGxk10WithBall(obj),
  },
  383300: {
    list: obj => createGxk10WithBall(obj),
  },
  383400: {
    list: obj => createGxk10WithBall(obj),
  },
  383500: {
    list: obj => createGxk10WithBall(obj),
  },
  // 广东快十 任选
  402100: {
    max: 1,
    list: obj => createGroupList(obj, 20, false),
  },
  402200: {
    max: 2,
    fun: (obj, limit = 2) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 20, false),
  },
  402300: {
    max: 3,
    fun: (obj, limit = 3) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 20, false),
  },
  402400: {
    max: 4,
    fun: (obj, limit = 4) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 20, false),
  },
  402500: {
    max: 5,
    fun: (obj, limit = 5) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 20, false),
  },
  // 广东快十 连码
  403100: {
    max: 2,
    fun: (obj, limit = 2) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 20, false),
  },
  403300: {
    max: 3,
    fun: (obj, limit = 3) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 20, false),
  },
  403400: {
    max: 3,
    fun: (obj, limit = 3) => oneRule(obj, limit),
    list: obj => createGroupList(obj, 20, false),
  },
  403200: {
    fun: obj => groupRule(obj),
    combin: (obj, parent) => getGroup(obj, parent),
    list: (obj) => {
      const newChild = ['前码', '后码'].map((item, i) => ({
        cid: obj.cid,
        parentId: obj.cid,
        name: item,
        group: i,
        childrens: arrayRange(20).map(m =>
          _.extend({}, obj.childrens[0], { name: m, group: i })),
      }));
      obj.childrens = newChild;
      obj.flatten = true;
      return obj;
    },
  },
};

export const findPlay = (tree, cid) => tree.find(f => f.cid === cid);

/**
 * format Payoff
 */
export const formatItemPayoff = (groups) => {
  if (_.has(groups, 'childrens')) {
    groups.childrens.forEach((group) => {
      group.orpayoff = _.get(group, 'oddsData.payoff');
      group.payoffFormat = group.orpayoff ? payoffFormat(group.orpayoff) : '';
      group.playName = groups.name;
      // 两组payoff
      if (_.has(group, 'oddsData.orpayoff')) {
        group.orpayoff = group.oddsData.orpayoff;
        group.payoffFormat = group.orpayoff.map(m => payoffFormat(m)).join('/');
      }
    });
  }
  return groups;
};

/**
 * @name 取得玩法组
 * @param {Array} cids 玩法id
 * @param {Object} tree 扁平化后的玩法树
 */
export const filterPlayDatas = (groupIds, tree) => {
  const groups = [];
  groupIds.forEach((cids) => {
    tree.filter(f => cids.includes(f.cid))
      .forEach((item) => {
        // BY item.cid 作客制化内容
        if (_.has(selectRules, `${item.cid}.list`)) {
          const listFun = _.get(selectRules, `${item.cid}.list`);
          item = listFun(item);
        }
        if (_.get(item, 'flatten', false)) { // 广西快十
          item.childrens.forEach((child) => {
            child = formatItemPayoff(child);
            groups.push(child);
          });
        } else {
          item = formatItemPayoff(item);
          groups.push(item);
        }
      });
  });
  return groups;
};

/**
 * @name 取得有分页后的玩法组
 * @param {Int} parentId 上层玩法id
 * @param {Object} tree 扁平化后的玩法树
 */
export const filterPlayTabNames = (cids, tree) => {
  if (!cids) return cids;
  const tabs = tree.filter(f => cids.includes(f.cid))
    .map(m => ({
      value: m.cid, label: m.name, i: m.orderCount, tabId: m.cid,
    }));
  return tabs;
};

