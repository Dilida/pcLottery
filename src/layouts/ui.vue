<template>
  <q-layout class="ui"> <!-- Be sure to play with the Layout demo on docs -->

  <q-tabs inverted >
    <!-- Tabs - notice slot="title" -->
    <q-tab class="tabs__tab" default slot="title" name="tab-type" label="文字" />
    <q-tab class="tabs__tab" slot="title" name="tab-color" label="顏色" />
    <q-tab class="tabs__tab" slot="title" name="tab-button" label="按鈕" />
    <q-tab class="tabs__tab" slot="title" name="tab-form" label="表單" />
    <q-tab class="tabs__tab" slot="title" name="tab-list" label="列表" />
    <q-tab class="tabs__tab" slot="title" name="tab-popup" label="彈窗" />
    <q-tab class="tabs__tab" slot="title" name="tab-lottery" label="彩票號球" />
    <q-tab class="tabs__tab" slot="title" name="tab-icon" label="icon" />

    <!-- 文字 -->
    <q-tab-pane class="tabs__content" name="tab-type">

      <div class="row">
        <q-list class="col-6">
          <q-list-header>
            标题
          </q-list-header>
          <q-item>
            <h1>h1标题字</h1>
          </q-item>
          <q-item>
            <h2>h2标题字</h2>
          </q-item>
          <q-item>
            <h3>h3标题字</h3>
          </q-item>
          <q-item>
            <h4>h4标题字</h4>
          </q-item>
          <q-item>
            <h5>h5标题字</h5>
          </q-item>
          <q-item>
            <h6>h6标题字</h6>
          </q-item>
        </q-list>


        <q-list class="col-6">
          <q-list-header>
            内文
          </q-list-header>
          <q-item>
            <div class="text-xlg">特大型文字</div>
          </q-item>
          <q-item>
            <div class="text-lg">大型文字</div>
          </q-item>
          <q-item>
            <div class="text-md">预设文字</div>
          </q-item>
          <q-item>
            <div class="text-sm">小型文字</div>
          </q-item>
          <q-item>
            <div class="text-xsm">特小型文字</div>
          </q-item>
        </q-list>
      </div>

    </q-tab-pane>

    <!-- 顏色 -->
    <q-tab-pane class="tabs__content" name="tab-color">
      <div class="row">

        <q-list class="col-4 ui-color">
          <q-list-header>
            quasar 主色
          </q-list-header>
          <q-item>
            <span class="ui-color-block bg-primary"></span> 主色 $primary
          </q-item>
          <q-item>
            <span class="ui-color-block bg-secondary"></span> 次色 $secondary
          </q-item>
          <q-item>
            <span class="ui-color-block bg-tertiary"></span> 文字 $tertiary
          </q-item>
          <q-item>
            <span class="ui-color-block bg-positive"></span> 成功 $positive
          </q-item>
          <q-item>
            <span class="ui-color-block bg-negative"></span> 失敗 $negative
          </q-item>
          <q-item>
            <span class="ui-color-block bg-info"></span> 資訊 $info
          </q-item>
          <q-item>
            <span class="ui-color-block bg-warning"></span> 警告 $warning
          </q-item>
        </q-list>

        <q-list class="col-4 ui-color">
          <q-list-header>
            双面长龙
          </q-list-header>
          <q-item>
            <span class="ui-color-block bg-dslong-1"></span> $dslong-1 /3期
          </q-item>
          <q-item>
            <span class="ui-color-block bg-dslong-2"></span> $dslong-2 /4期
          </q-item>
          <q-item>
            <span class="ui-color-block bg-dslong-3"></span> $dslong-3 /5期
          </q-item>
          <q-item>
            <span class="ui-color-block bg-dslong-4"></span> $dslong-4 /6期
          </q-item>
          <q-item>
            <span class="ui-color-block bg-dslong-5"></span> $dslong-5 /7期以上
          </q-item>
        </q-list>

        <q-list class="col-4 ui-color">
          <q-list-header>
            號球（区块链彩除外）
          </q-list-header>
          <q-item>
            <span class="ui-color-block bg-bead-round"></span>
            $bead-round 时时彩/11选5
          </q-item>
          <q-item>
            <span class="ui-color-block bg-bead-round-active"></span>
            $bead-round-active 时时彩/11选5
          </q-item>
          <q-item>
            <span class="ui-color-block bg-bead-round-pastview"></span>
            $bead-round-pastview 时时彩/11选5
          </q-item>
          <q-item>
            <span class="ui-color-block bg-bead-red"></span>
            $bead-red 六合彩/幸运28
          </q-item>
          <q-item>
            <span class="ui-color-block bg-bead-blue"></span>
            $bead-blue 六合彩/幸运28
          </q-item>
          <q-item>
            <span class="ui-color-block bg-bead-green"></span>
            $bead-green 六合彩/幸运28
          </q-item>
          <q-item>
            <span class="ui-color-block bg-bead-gray"></span>
            $bead-gray 幸运28
          </q-item>
        </q-list>

        <q-list class="col-4 ui-color">
          <q-list-header>
            路珠（区块链彩除外）
          </q-list-header>
          <q-item>
            <span class="ui-color-block bg-road-big"></span>
            $road-big 大、龙、单、上
          </q-item>
          <q-item>
            <span class="ui-color-block bg-road-small"></span>
            $road-small 小、虎、双、下
          </q-item>
          <q-item>
            <span class="ui-color-block bg-road-mid"></span>
            $road-mid 和、中
          </q-item>
        </q-list>

      </div>

    </q-tab-pane>

    <!-- 按鈕 -->
    <q-tab-pane class="tabs__content" name="tab-button">
      <div class="row">
        <q-list class="ui-btn-list col-4">
          <q-list-header>
            基本样式
          </q-list-header>
          <q-item>
            <q-btn class="btn-primary">確定</q-btn>
            .btn-primary
          </q-item>
          <q-item>
            <q-btn class="btn-secondary">確定</q-btn>
            .btn-secondary
          </q-item>
          <q-item>
            <q-btn class="btn-warning">確定</q-btn>
            .btn-warning
          </q-item>
          <q-item>
            <q-btn class="btn-cancel">取消</q-btn>
            .btn-cancel
          </q-item>
        </q-list>
        <q-list class="ui-btn-list col-4">
          <q-list-header>
            筛选样式
          </q-list-header>
          <q-item>
            <q-btn class="btn-table-filter">未中奖</q-btn>
            .btn-table-filter
          </q-item>
          <q-item>
            <q-btn class="btn-table-filter active">未中奖</q-btn>
            .btn-table-filter.active
          </q-item>
        </q-list>
        <q-list class="ui-btn-list col-4">
          <q-list-header>
            投注按钮
          </q-list-header>
          <q-item>
            <q-btn class="btn-bet">
              <q-icon name="icon-tool icon-bet" />
              下注
            </q-btn>
            .btn-bet
          </q-item>
          <q-item>
            <q-btn class="btn-reset">重置</q-btn>
            .btn-reset
          </q-item>
        </q-list>
        <q-list class="ui-btn-list col-4">
          <q-list-header>
            个人中心-充值按钮
          </q-list-header>
          <q-item>
            <q-btn class="btn-copy">复制</q-btn>
            .btn-copy
          </q-item>
          <q-item>
            <q-btn class="btn-pay">
              <q-icon name="icon-pay icon-pay-wechat"></q-icon>
              微信支付</q-btn>
            .btn-pay
          </q-item>
          <q-item>
            <q-btn class="btn-pay active">
              <q-icon name="icon-pay icon-pay-wechat"></q-icon>
              微信支付</q-btn>
            .btn-pay active
          </q-item>
        </q-list>
        <q-list class="ui-btn-list col-4">
          <q-list-header>
            panel右侧按钮
          </q-list-header>
          <q-item>
            <q-btn class="btn-more">更多</q-btn>
            .btn-more
          </q-item>
        </q-list>
        <q-list class="ui-btn-list col-4">
          <q-list-header>
            size
          </q-list-header>
          <q-item>
            <q-btn class="btn-primary btn-lg">確定</q-btn>
            .btn-lg
          </q-item>
          <q-item>
            <q-btn class="btn-primary btn-md">確定</q-btn>
            .btn-md
          </q-item>
          <q-item>
            <q-btn class="btn-primary btn-sm">確定</q-btn>
            .btn-sm
          </q-item>
        </q-list>

        <q-list class="ui-btn-list col-4">
          <q-list-header>
            TAB组-投注页
          </q-list-header>
          <q-item style="position: relative; width: 190px;">
            <q-btn-group class="btn-group-flat">
              <q-btn class="active">按钮1</q-btn>
              <q-btn>按钮2</q-btn>
              <q-btn>按钮3</q-btn>
            </q-btn-group>
            <div class="btn-group-control">
              <button tabindex="0" type="button"
              class="q-btn inline relative-position q-btn-item non-selectable
              btn-left q-btn-rectangle q-focusable q-hoverable swiper-button-disabled"
              slot="button-prev" role="button" aria-label="Previous slide" aria-disabled="true">
                <div class="q-focus-helper"></div>
                <div class="q-btn-inner row col items-center justify-center"></div>
              </button>
              <button tabindex="0" type="button" class="q-btn inline relative-position
              q-btn-item non-selectable btn-right q-btn-rectangle q-focusable q-hoverable"
              slot="button-next" role="button" aria-label="Next slide" aria-disabled="false">
                <div class="q-focus-helper"></div>
                <div class="q-btn-inner row col items-center justify-center"></div>
              </button>
            </div>
          </q-item>
        </q-list>

        <q-list class="ui-btn-list col-4">
          <q-list-header>
            TAB组-个人中心
          </q-list-header>
          <q-item style="padding:0 15px;">
            <div class="col-12 deposit">
              <div class="q-tabs tabs flex no-wrap q-tabs-position-top q-tabs-inverted">
                <div class="q-tabs-head row q-tabs-align-left text-primary">
                  <div class="q-tabs-scroller row no-wrap">
                    <div class="q-tab column flex-center active
                      relative-position tabs__tab q-tab-only-label text-primary">
                      <div class="q-tab-label">文字</div>
                      <div class="q-tabs-bar"></div>
                    </div>
                    <div class="q-tab column flex-center
                      relative-position tabs__tab q-tab-only-label text-primary">
                      <div class="q-tab-label">文字</div>
                      <div class="q-tabs-bar" style="display: none;"></div>
                    </div>
                    <div class="q-tab column flex-center
                      relative-position tabs__tab q-tab-only-label text-primary">
                      <div class="q-tab-label">文字</div>
                      <div class="q-tabs-bar" style="display: none;"></div>
                    </div>
                  </div>
                </div>
                <div class="q-tabs-panes">
                  <div class="q-tab-pane tabs__content">
                    tab内容 <br />tab内容 <br />
                    <div class="q-tabs tabs-sub flex no-wrap q-tabs-position-top q-tabs-inverted">
                      <div class="q-tabs-head row q-tabs-align-left text-primary">
                        <div class="q-tabs-scroller row no-wrap">
                          <div class="q-tab column flex-center active
                            relative-position tabs__tab q-tab-only-label text-primary">
                            <div class="q-tab-label">文字</div>
                            <div class="q-tabs-bar"></div>
                          </div>
                          <div class="q-tab column flex-center
                            relative-position tabs__tab q-tab-only-label text-primary">
                            <div class="q-tab-label">文字</div>
                            <div class="q-tabs-bar" style="display: none;"></div>
                          </div>
                          <div class="q-tab column flex-center
                            relative-position tabs__tab q-tab-only-label text-primary">
                            <div class="q-tab-label">文字</div>
                            <div class="q-tabs-bar" style="display: none;"></div>
                          </div>
                        </div>
                      </div>
                      <div class="q-tabs-panes">
                        <div class="q-tab-pane tabs__content deposit-wrap-bg">
                          tab内容里面再塞tab<br />
                          （用在钱包支付）
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-item>
        </q-list>

      </div>
    </q-tab-pane>

    <!-- 表單 -->
    <q-tab-pane class="tabs__content" name="tab-form">
      <div class="row">
        <q-list class="col-12">
          <q-list-header class="col-12">
            input
          </q-list-header>
          <q-item class="row">
            <div class="col-4">
              <q-field
              label="label"
              class="field-normal col-12"
              >
                <q-input
                hide-underline
                value=""
                ></q-input>
              </q-field>
              <div class="col-12">
                &lt;q-field label="label" class="field-normal" &gt;<br>
                  &lt;q-input hide-underline >&lt;/q-input&gt;<br>
                &lt;/q-field&gt;<br>
              </div>
            </div>
          </q-item>
          <q-item>
            投注input（输入金额）
            <div class="play-bet__input row items-center">
              <span class="col-3">预设金额</span>
              <q-input
                class="bet-input"
                type='tel'
                value=""
                hide-underline/>
              <span>元</span>
            </div>
          </q-item>
        </q-list>
        <q-list class="row col-12">
          <q-list-header class="col-12">
            paiger
          </q-list-header>
          <q-item>
            <div class="pagination">
              <span class="pager-count">共73条</span>
              <q-btn-group class="pager-btn">
                <q-btn>上一页</q-btn>
                <q-btn>
                  <span class="pager-num">1</span>
                </q-btn>
                <q-btn class="active">
                  <span class="pager-num">2</span>
                </q-btn>
                <q-btn>
                  <span class="pager-num">3</span>
                </q-btn>
                <q-btn>
                  <span class="pager-num">4</span>
                </q-btn>
                <q-btn>
                  <span class="pager-num">5</span>
                </q-btn>
                <q-btn>...</q-btn>
                <q-btn>
                  <span class="pager-num">7</span>
                </q-btn>
                <q-btn>下一页</q-btn>
              </q-btn-group>
            </div>
          </q-item>
        </q-list>

        <q-list class="col-12 row">
          <q-list-header class="col-12">
            下拉选单
          </q-list-header>
          <q-item class="col-4">
            <div>dropdown：</div>
            <q-btn-dropdown
              label="btnLabel">
              <!-- dropdown content -->
              <q-list link>
                <q-item>
                  <q-item-main>
                    <q-item-tile label>test</q-item-tile>
                  </q-item-main>
                </q-item>
                <q-item>
                  <q-item-main>
                    <q-item-tile label>test2</q-item-tile>
                  </q-item-main>
                </q-item>
                <q-item>
                  <q-item-main>
                    <q-item-tile label>test3</q-item-tile>
                  </q-item-main>
                </q-item>
                <q-item>
                  <q-item-main>
                    <q-item-tile label>test4</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item>
          <q-item class="col-4">
            <div>popover：</div>
            <div class="" style="position: relative">
              <q-btn icon="icon-avatar" @click="popoverShow = true" label="我的帐户" />
              <q-popover v-model="popoverShow" style="padding: 10px">
                <q-btn class="btn-primary">登出</q-btn>
                2018/09/27 11:32:47
              </q-popover>
            </div>
          </q-item>
        </q-list>
      </div>
    </q-tab-pane>

    <!-- 列表 -->
    <q-tab-pane class="tabs__content" name="tab-list">
      <!-- <div class="row">
        <q-list class="col-6">
          <q-list-header class="col-12">
            收合列表
          </q-list-header>

          <q-list>
            <q-collapsible
            class="collapsible__content"
            header-class="collapsible__header"
            icon="icon-tool icon-lottery"
            collapse-icon="icon-tool icon-arrow-down"
            label="收合标题opened"
            opened
            >
              收合内容
            </q-collapsible>
            <q-collapsible
            class="collapsible__content"
            header-class="collapsible__header"
            icon="icon-tool icon-lottery"
            collapse-icon="icon-tool icon-arrow-down"
            label="收合标题2"
            >
              收合内容2
            </q-collapsible>
            <q-collapsible
            class="collapsible__content"
            header-class="collapsible__header"
            icon="icon-tool icon-lottery"
            collapse-icon="icon-tool icon-arrow-down"
            label="收合标题3"
            >
              收合内容3
            </q-collapsible>
          </q-list>

        </q-list>
      </div> -->

      <div class="row">
        <q-list class="col-12">
          <q-list-header class="col-12">
            panel
          </q-list-header>
          <!-- 右側panel -->
          <div class="row lobby-winner-list site-panel">
            <div class="site-panel">
              <div class="site-panel__header">
                <div class="site-panel__header-title">
                  <q-icon name="icon-tool icon-badge"></q-icon>
                  某某榜
                </div>
              </div>
              <table class="table winner-list">
                <thead>
                  <tr>
                    <th>排行</th>
                    <th>用戶</th>
                    <th>盈利金額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in panelData"
                    :key="i">
                    <td><span class="icon-ranking">{{item.value}}</span></td>
                    <td>{{item.name}}</td>
                    <td>{{roundAmt(item.amount)}}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </q-list>
      </div>
      <div class="row">
        <q-list class="col-6">
          <q-list-header class="col-12">
            table（表格不含标题列）
          </q-list-header>
          <q-item class="col-12 column">
            <div class="table-group">
              <div class="table-header">table-header</div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>th</th>
                  <th>th</th>
                  <th>th</th>
                  <th>th</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                </tr>
                <tr>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                </tr>
                <tr>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                </tr>
                <tr>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>tfoot</td>
                  <td>tfoot</td>
                  <td>tfoot</td>
                  <td>tfoot</td>
                </tr>
              </tfoot>
            </table>
          </q-item>
        </q-list>
        <q-list class="col-6">
          <q-list-header class="col-12">
            table-normal 用在个人消息、往期开奖
          </q-list-header>
          <q-item class="col-12 column">
            <table class="table-normal">
              <thead>
                <tr>
                  <th>th</th>
                  <th>th</th>
                  <th>th</th>
                  <th>th</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                </tr>
                <tr>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                </tr>
                <tr>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                </tr>
                <tr>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                  <td>td</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>tfoot</td>
                  <td>tfoot</td>
                  <td>tfoot</td>
                  <td>tfoot</td>
                </tr>
              </tfoot>
            </table>
          </q-item>
        </q-list>

      </div>
    </q-tab-pane>

    <!-- 彈窗 -->
    <q-tab-pane class="tabs__content" name="tab-popup">
      <div class="row">
        <q-list class="col-4">
          <q-item>
            提示框（最小宽350px）
            <q-btn class="btn-primary" @click="globalAlertDialog">提示框</q-btn>
          </q-item>
        </q-list>
      </div>
      <!-- 提示弹窗 -->
      <globalAlertDialog></globalAlertDialog>

    </q-tab-pane>

    <!-- 彩票號球 -->
    <q-tab-pane class="tabs__content ui-bead" name="tab-lottery">
      <div class="row">

        <div class="col-12">
          <div class="ui-msg">為方便未來維護，號球一律存成png圖片；只有快乐8和六合彩彩球要补0，其它不补0</div>

          <q-list class="row" v-for="(item, i) in bead" :key="i">
            <div class="col-12">彩种：{{item.lotterylist}}</div>
            <div class="col-6">
              <q-list-header>
                {{item.name}}
              </q-list-header>
              <q-item>
                <span
                  v-for="(num, i) in bead[i].num" :key="i"
                  :class="`bead-lottery-${item.lotteryid} num_${num}`">{{num}}</span>
              </q-item>
            </div>
            <div class="col-6 active">
              <q-list-header>
                {{item.name}}-选中效果
              </q-list-header>
              <q-item>
                <span
                  v-for="(num, i) in bead[i].num" :key="i"
                  :class="`bead-lottery-${item.lotteryid} num_${num}`">{{num}}</span>
              </q-item>
            </div>
          </q-list>

        </div>
      </div>
    </q-tab-pane>

    <!-- icon -->
    <q-tab-pane class="tabs__content ui-icon" name="tab-icon">
      <h4>king版、三业主版</h4>
      <q-list class="row">
        <q-list-header class="col-12">
          导航
        </q-list-header>
        <q-item class="col-2">
          <q-icon name="icon-nav icon-nav-home"></q-icon> icon-nav-home <br /> 首页
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-nav icon-nav-dice"></q-icon> icon-nav-dice <br /> 彩种选单/彩种
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-nav icon-nav-tag"></q-icon> icon-nav-tag <br /> 优惠活动
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-nav icon-nav-personal"></q-icon> icon-nav-personal <br /> 个人中心
        </q-item>
      </q-list>

      <q-list class="row">
        <q-list-header class="col-12">
          工具
        </q-list-header>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-badge"></q-icon> icon-badge <br /> 排行榜标题icon
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-dot"></q-icon> icon-dot <br /> 轮播图点点
        </q-item>
        <!-- <q-item class="col-2">
          <q-icon name="icon-tool icon-equal"></q-icon> icon-equal 幸运28开奖
        </q-item> -->
        <q-item class="col-2">
          <q-icon name="icon-tool icon-lottery"></q-icon> icon-lottery <br /> 首页导航列、选单全部彩种列表标题
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-louder"></q-icon> icon-louder <br /> 跑马灯
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-mail"></q-icon> icon-mail <br /> 个人消息
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-money"></q-icon> icon-money <br /> 余额
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-avatar"></q-icon> icon-avatar <br /> 帐户
        </q-item>
        <!-- <q-item class="col-2">
          <q-icon name="icon-tool icon-plus"></q-icon> icon-plus 六合彩开奖
        </q-item> -->
        <q-item class="col-2">
          <q-icon name="icon-tool icon-close"></q-icon> icon-close <br /> 弹窗关闭
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-page-reg"></q-icon> icon-page-reg <br /> 注册页
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-bind-card"></q-icon> icon-bind-card <br /> 绑定银行卡提示讯息
        </q-item>
        <!-- <q-item class="col-2">
          <q-icon name="icon-tool icon-confirm"></q-icon> icon-confirm 确认icon
        </q-item> -->
      </q-list>

      <q-list class="row">
        <q-list-header class="col-12">
          搭配按钮
        </q-list-header>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-bet"></q-icon> icon-bet <br /> 下注按钮
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-check"></q-icon> icon-check <br /> 确认按钮（部分有）
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-plus"></q-icon> icon-plus <br /> 发起众筹
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-top-deposit"></q-icon> icon-top-deposit <br /> 顶部充值
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-top-withdrawals"></q-icon> icon-top-withdrawals <br /> 顶部提款
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-top-service"></q-icon> icon-top-service <br /> 顶部客服
        </q-item>
      </q-list>

      <q-list class="row">
        <q-list-header class="col-12">
          开奖状态
        </q-list-header>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-error"></q-icon> icon-error <br /> 状态-异常注单
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-waiting"></q-icon> icon-waiting <br /> 状态-等待开奖
        </q-item>
      </q-list>

      <q-list class="row">
        <q-list-header class="col-12">
          个人中心、帮助中心-左侧选单
        </q-list-header>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-leftnav-account"></q-icon>
          icon-leftnav-account <br /> 个人中心-帐户管理
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-leftnav-bet"></q-icon>
          icon-leftnav-bet <br /> 个人中心-投注管理
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-leftnav-funding"></q-icon>
          icon-leftnav-funding <br /> 个人中心-资金管理
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-leftnav-message"></q-icon>
          icon-leftnav-message <br /> 个人中心-公告管理
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-leftnav-help"></q-icon>
          icon-leftnav-help <br /> 帮助中心
        </q-item>
        <q-item class="col-2">
          <q-icon name="icon-tool icon-leftnav-aboutus"></q-icon>
          icon-leftnav-aboutus <br /> 关于我们
        </q-item>

      </q-list>

    </q-tab-pane>
  </q-tabs>

  </q-layout>
</template>

<script>
import { globalMixin } from 'src/globalMixin';
import globalAlertDialog from 'components/dialog/globalAlertDialog';

export default {
  mixins: [globalMixin],
  // name: 'LayoutName',
  components: {
    globalAlertDialog,
  },
  data: () => ({
    popoverShow: false,
    bead: [
      {
        name: '时时彩',
        lotteryid: '2',
        lotterylist: '重庆时时彩(2) 天津时时彩(12) 新疆时时彩(14) 北京时时彩(26) 台湾5分彩(28) ' +
        'QQ分分彩(32) 比特币彩(48) 以太坊彩(50) 莱特币彩(52) 秒速时时彩(102) 韩国1.5分彩(112)' +
        '东京1.5分彩(114) 重庆秒秒彩(116) 秒速3分彩(120)',
        num: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      },
      {
        name: '11选5',
        lotteryid: '4',
        lotterylist: '江西11选5(4) 广东11选5(16) 山东11选5(18) 秒速11选5(104)',
        num: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
      },
      {
        name: '快3',
        lotteryid: '6',
        lotterylist: '江苏快3(6) 安徽快3(20) 湖北快3(22) 秒速快3(106)',
        num: ['1', '2', '3', '4', '5', '6'],
      },
      {
        name: 'PK10',
        lotterylist: '北京PK10(8) 幸运飞艇(24) 秒速赛车(108) 赛车秒秒彩(118)',
        lotteryid: '8',
        num: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      },
      {
        name: '六合彩',
        lotteryid: '10',
        lotterylist: '香港六合彩(10) 五分六合彩(110)',
        num: [
          '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
          '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
          '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
          '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
          '41', '42', '43', '44', '45', '46', '47', '48', '49',
        ],
      },
      {
        name: '快乐8',
        lotteryid: '34',
        lotterylist: '北京快乐8(34) 台湾宾果(42) 加拿大快乐8(44)',
        num: [
          '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
          '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
          '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
          '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
          '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
          '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
          '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
          '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
        ],
      },
      {
        name: '快十',
        lotteryid: '40',
        lotterylist: '广西快十(38) 广东快十(40) 幸运农场(46)',
        num: [
          '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
          '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
          '21',
        ],
      },
      {
        name: '幸运28',
        lotteryid: '30',
        lotterylist: '幸运28(30)',
        num: [
          '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
          '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
          '21', '22', '23', '24', '25', '26', '27',
        ],
      },
    ],
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.panelData = this.$_lodash.range(1, 11)
        .map(item => ({ value: item, name: 'test***', amount: 9999.99 }));
    },
    globalAlertDialog() {
      this.openDialog({
        content: '请选择存款方式！',
        type: 'negative',
      });
    },
  },
  computed: {
  },
};
</script>

<style lang="stylus" scoped>
.ui
  width 990px
  padding 15px 0
  margin 0 auto
</style>
