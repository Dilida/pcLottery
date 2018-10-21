<template>
  <div class="history-table relative-position">
    <q-table
      class="table-normal bead-pastview"
      :data="methodGetTableBody()"
      :columns="methodGetTableTitle()"
      row-key="name"
      :pagination.sync="pagination"
      no-data-label="暂无数据"
      no-results-label="暂无数据"
      rowsNumber="20"
      :hide-bottom="true"
    >
      <tr slot="header" slot-scope="props">
        <!-- 标题 -->
        <q-th
          v-for="(item) in tableTitle"
          :key="item.name"
          :props="props"
          v-if="item.colspan"
          :colspan="item.colspan" >
          {{item.label}}
        </q-th>
      </tr>
        <!-- 表格 -->
      <q-tr
        slot="body"
        slot-scope="props"
        :props="props" >
        <q-td
          class=""
          v-for="col in props.cols"
          :key="col.name"
          :props="props" >
          <!-- number -->
          <div v-if="/winNumber/ig.test(col.name) && !Array.isArray(col.value)" >
            <span
              :class="`bead-lottery-${lotteryId} num_${col.value}`" >
              {{col.value}}
            </span>
          </div>
          <!-- string -->
          <span v-else-if="typeof col.value === 'string' && col.name === 'block'" >
            <a :href="blockChainUrl" target="_blank">
              {{col.value}}
            </a>
          </span>
          <span v-else-if="typeof col.value === 'string' && col.name !== 'block'" >
            {{col.value}}
          </span>
          <!-- array -->
          <div v-else >
            <span
              v-for="(item, index) in Array.from(col.value)"
              :key="index"
              :class="index === 0 ?
                `bead-lottery-${lotteryId} num_${item}` :
                ``" >
              {{item}}
            </span>
          </div>
        </q-td>
      </q-tr>
    </q-table>
    <!-- 分页 -->
    <pagination
      :paginationConfig="paginationConfig"
      @requestData="methodPageCountChange">
    </pagination>
    <q-inner-loading :visible="loadingVisible">
      <q-spinner :size="40" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { keys } from 'lodash';
import pagination from 'components/pagination';
import { lotteryConst } from 'src/consts/lotteryConst';

export default {
  name: 'historyTable',
  components: {
    pagination,
  },
  props: {
    lotteryId: {
      type: Number,
      required: true,
    },
    tableBody: {
      type: [Array, Object],
      required: true,
    },
    paginationConfig: {
      type: [Object],
      required: true,
    },
  },
  watch: {
    tableBody(newVal, oldVal) {
      if (newVal.page !== oldVal.page) return;
      this.methodChangeLoadingVisible();
    },
    lotteryId(newVal) {
      this.lotteryId = newVal;
    },
  },
  computed: {
    blockChainUrl() {
      if (lotteryConst.blockChainList.has(this.lotteryId)) {
        return lotteryConst.blockChainList.get(this.lotteryId);
      }
      return null;
    },

  },
  mounted() {},
  data() {
    return {
      loadingVisible: false,
      tableTitle: [],
      tableData: [],
      pagination: {
        // 当前每页显示的行数
        rowsPerPage: this.paginationConfig.count,
      },
      pastViewTitle: {
        // 时时彩, 11x5
        1: {
          issueAlias: '期数', winNumber: ['第一球', '第二球', '第三球', '第四球', '第五球'], total: '总和', longer: '龙虎',
        },
        // 秒秒彩
        2: {
          issueAlias: '投注时间', winNumber: ['第一球', '第二球', '第三球', '第四球', '第五球'], total: '总和', longer: '龙虎',
        },
        // 快3
        3: {
          issueAlias: '期数', winNumber: '开奖号码', total: '总和', sizer: '大小',
        },
        // pk10
        4: {
          issueAlias: '期数', winNumber: ['第一名', '第二名', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'], total: '冠亚和', longer: '1-5龙虎',
        },
        // 六合彩
        5: {
          issueAlias: '期数', winNumber: ['正码一', '正码二', '正码三', '正码四', '正码五', '正码六', '特码'], doubleData: [],
        },
        // PC蛋蛋 幸運28
        6: {
          issueAlias: '期数', winNumber: ['第一球', '第二球', '第三球', '总和'], sizer: '大小', doubler: '单双', colorWave: '色波',
        },
        // 快8
        7: {
          issueAlias: '期数', winNumber: '开奖号码', totalPan: '总和盘面',
        },
        // 广西快十
        8: {
          issueAlias: '期数', winNumber: ['第一球', '第二球', '第三球', '第四球', '第五球'], doubler: '单双', longer: '龙虎',
        },
        // 广东快十, 幸运农场
        9: {
          issueAlias: '期数', winNumber: ['第一球', '第二球', '第三球', '第四球', '第五球', '第六球', '第七球', '第八球'], totalPan: '总和盘面',
        },
        // 区块链彩
        10: {
          issueAlias: '期数', winNumber: ['第一球', '第二球', '第三球', '第四球', '第五球'], block: '区块高度', total: '总和', longer: '龙虎',
        },
      },
    };
  },
  methods: {
    methodPageCountChange(value) {
      this.$emit('methodPageCountChange', value);
    },
    // 组成表格标题
    methodGetTableTitle() {
      const columns = [];
      keys(this.tableBody[0]).forEach((firstDataKey) => {
        if (typeof this.tableBody[0][firstDataKey] === 'string') {
          // String
          columns.push({
            name: firstDataKey,
            required: true,
            label: this.methodGetTitle(this.lotteryId, firstDataKey),
            align: 'center',
            field: firstDataKey,
            sortable: false,
            colspan: 1,
          });
        } else if (Array.isArray(this.tableBody[0][firstDataKey])) {
          // Array
          if (Array.isArray(this.methodGetTitle(this.lotteryId, firstDataKey))) {
            this.methodGetTitle(this.lotteryId, firstDataKey).forEach((item, index) => {
              columns.push({
                name: `${firstDataKey}${index}`,
                required: true,
                label: item,
                align: 'center',
                field: `${firstDataKey}${index}`,
                sortable: false,
                colspan: 1,
              });
            });
          }
        } else {
          // Object
          keys(this.tableBody[0][firstDataKey]).forEach((doubleDataKey) => {
            if (this.tableBody[0][firstDataKey][doubleDataKey].length === 0) {
              const index = 0;
              columns.push({
                name: `${doubleDataKey}${index}`,
                required: true,
                label: this.methodGetTitle(this.lotteryId, doubleDataKey),
                align: 'center',
                field: `${doubleDataKey}${index}`,
                sortable: false,
                colspan: 1,
              });
            } else {
              this.tableBody[0][firstDataKey][doubleDataKey].forEach((elm, index) => {
                columns.push({
                  name: `${doubleDataKey}${index}`,
                  required: true,
                  label: index === 0 ? this.methodGetTitle(this.lotteryId, doubleDataKey) : null,
                  align: 'center',
                  field: `${doubleDataKey}${index}`,
                  sortable: false,
                  colspan: index === 0 ? this.tableBody[0][firstDataKey][doubleDataKey].length : 0,
                });
              });
            }
          });
        }
      });

      this.tableTitle = columns;
      return columns;
    },
    // 根据值，回传列标题
    methodGetTitle(lotteryId, key) {
      let idx = 0;
      // const returnValue = null;
      switch (lotteryId) {
        // 秒秒彩
        case 116:
          idx = 2;
          break;
        // 快3
        case 6:
        case 20:
        case 22:
        case 106:
          idx = 3;
          break;

        // pk10
        case 8:
        case 24:
        case 108:
        case 118:
          idx = 4;
          break;

        // 六合彩
        case 10:
        case 110:
          idx = 5;
          break;

        // PC蛋蛋 幸運28
        case 30:
          idx = 6;
          break;

        // 快8
        case 34:
        case 42:
        case 44:
          idx = 7;
          break;

        // 广西快十, 幸运农场
        case 38:
          idx = 8;
          break;

        // 广东快十
        case 40:
        case 46:
          idx = 9;
          break;

        // 区块链彩
        case 48:
        case 50:
        case 52:
          idx = 10;
          break;

        default:
        // 时时彩
        // 2, 12, 14, 26, 102, 112, 114, 116, 118, 120
        // 11选5
        // 4, 16, 18, 104
          idx = 1;
          break;
      }
      return this.pastViewTitle[idx][key];
    },
    // 组成表格内容
    methodGetTableBody() {
      const tableData = [];
      let currentTableData = {};
      this.tableBody.forEach((item, index) => {
        currentTableData = {};
        keys(item).forEach((key, objIndex) => {
          if (typeof this.tableBody[index][key] === 'string') {
            // String
            currentTableData[key] = this.tableBody[index][key];
          } else if (Array.isArray(this.tableBody[index][key])) {
            // Array
            if ((this.lotteryId === 10 || this.lotteryId === 110) && objIndex === 2) {
              keys(currentTableData).forEach((curKey, idx) => {
                if (idx !== 0) {
                  const ar = [];
                  ar.push(currentTableData[curKey]);
                  ar.push(this.tableBody[index][key][idx - 1]);
                  currentTableData[curKey] = ar;
                }
              });
            } else {
              this.tableBody[index][key].forEach((arrayKey, idx) => {
                currentTableData[`${key}${idx}`] = arrayKey;
              });
            }
          } else {
            // Object
            keys(this.tableBody[index][key]).forEach((objectKey) => {
              if (this.tableBody[index][key][objectKey].length === 0) {
                const idx = 0;
                currentTableData[`${objectKey}${idx}`] = '--';
              } else {
                this.tableBody[index][key][objectKey].forEach((val, idx) => {
                  currentTableData[`${objectKey}${idx}`] = val;
                });
              }
            });
          }
        });
        tableData.push(currentTableData);
      });
      return tableData;
    },
    methodChangeLoadingVisible() {
      this.loadingVisible = true;
      setTimeout(() => {
        this.loadingVisible = false;
      }, 400);
    },
  },
};
</script>

<style lang="stylus">
.pager-count
    display none
</style>
