<template>
  <div class="pagination">
    <span class="pager-count">共{{ paginationConfig.totalNumber }}条</span>
    <q-btn-group class="pager-btn">
      <q-btn @click="prevPage()" v-show="currentPage !== 1 && totalPage !== 1">上一页</q-btn>
      <q-btn
          v-for="p in beginArr" :key="p"
          :class="currentPage === p ? 'active' : ''"
          @click="requestData(p, paginationConfig.count)"
      >
        <span class="pager-num">{{ p }}</span>
      </q-btn>
      <q-btn v-if="endArr.length !== 0">...</q-btn>
      <q-btn
          v-for="p in endArr" :key="p"
          :class="currentPage === p ? 'active' : ''"
          @click="requestData(p, paginationConfig.count)"
      >
        <span class="pager-num">{{ p }}</span>
      </q-btn>
      <q-btn @click="nextPage()" v-show="currentPage !== totalPage && totalPage !== 1">下一页</q-btn>
    </q-btn-group>
  </div>
</template>

<script>
/**
 * *从父层传递过来得资料
 *
 * paginationConfig: {
 *  type: Object,
 *  totalNumber: 总共几笔
 *  count: 每页几笔
 *  page: 回传页数
 *  renderPageCount: 希望显示的页数数量 (其余以 ... 表示), 沒傳值默認全顯示
 * }
*/

/**
 * *从元件传递过去父层的事件
 * requestData觸發父层查询事件 (父層查詢事件case by case)
 * 需要传递得物件
 * {
 *  page: 查询页数
 *  count: 每页几笔
 * }
 */

export default {
  name: 'pagination',
  props: {
    paginationConfig: {
      type: Object,
    },
  },
  data() {
    return {
      beginArr: [],
      endArr: [],
      renderPageCount: 5, // 希望显示的页数数量 (其余以 ... 表示), 总页数必须至少超过此数量 + 2 否则全顯示
      resetFlag: false,
    };
  },
  computed: {
    totalPage() {
      const result = Math.ceil(this.paginationConfig.totalNumber / this.paginationConfig.count);
      return result === 0 ? 1 : result;
    },
    currentPage() {
      return this.paginationConfig.page;
    },
  },
  mounted() {
    if (this.totalPage === 1) {
      this.beginArr = [1];
    }
  },
  watch: {
    totalPage() {
      this.beginArr = [];
      this.endArr = [];
      this.resetFlag = false;
      if ((this.totalPage - 2) < this.renderPageCount) {
        for (let i = 1; i <= this.totalPage; i += 1) {
          this.beginArr.push(i);
        }
      } else {
        this.resetFlag = true;
        for (let i = 1; i <= this.renderPageCount; i += 1) {
          this.beginArr.push(i);
        }
        this.endArr = [this.totalPage];
      }
    },
  },
  methods: {
    prevPage() {
      if (this.currentPage !== 1) {
        const page = this.currentPage - 1;
        this.requestData(page, this.paginationConfig.count);
        if (this.resetFlag) {
          this.resetPagination(page);
        }
      }
    },
    nextPage() {
      if (this.currentPage !== this.totalPage) {
        const page = this.currentPage + 1;
        this.requestData(page, this.paginationConfig.count);
        if (this.resetFlag) {
          this.resetPagination(page);
        }
      }
    },
    requestData(p, c) {
      this.$emit('requestData', { page: p, count: c });
      if (this.resetFlag) {
        this.resetPagination(p);
      }
    },
    resetPagination(p) {
      const r = this.renderPageCount;
      const result = p + r;
      const newArr = [];
      if (result >= this.totalPage) {
        let condition = 0;
        if (result === this.totalPage) {
          condition = this.totalPage - r - 1;
        } else {
          condition = this.totalPage - r;
        }
        for (let i = this.totalPage; i > condition; i -= 1) {
          newArr.unshift(i);
        }
        this.endArr = newArr;
        this.beginArr = [1];
      } else {
        for (let i = 0; i < r; i += 1) {
          newArr.push(i + p);
        }
        this.beginArr = newArr;
        this.endArr = [this.totalPage];
      }
    },
  },
};
</script>
