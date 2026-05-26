import { useMemo, useState } from 'react'
import type { CSSProperties, WheelEvent } from 'react'
import './App.css'

type RouteKey = 'gesp' | 'noi' | 'cf'
type Status = 'not-started' | 'learning' | 'practicing' | 'review' | 'passed'
type Weight = 'core' | 'normal' | 'stretch'

type Problem = {
  title: string
  source: '洛谷' | 'Codeforces' | 'AtCoder' | '自建'
  level: string
  url: string
}

type Topic = {
  id: string
  title: string
  stage: string
  status: Status
  minGesp: string
  noiBand: string
  cfBand: string
  routeWeight: Record<RouteKey, Weight>
  prerequisites: string[]
  standards: Record<RouteKey, string[]>
  problems: Problem[]
  visual: string
}

type Category = {
  id: string
  title: string
  subtitle: string
  x: number
  y: number
  links: string[]
  topics: Topic[]
}

const routeLabels: Record<RouteKey, string> = {
  gesp: 'GESP 路线',
  noi: '信奥路线',
  cf: 'CF 路线',
}

const routeColors: Record<RouteKey, string> = {
  gesp: '#14b8a6',
  noi: '#2563eb',
  cf: '#9333ea',
}

const routeNotes: Record<RouteKey, string> = {
  gesp: '突出 GESP1-8 的学习下限，适合给学生看台阶。',
  noi: '突出普及、CSP-J、CSP-S、提高+ 的训练路径。',
  cf: '突出 CF800-2000 的题感、证明、构造和变式。',
}

const statusLabels: Record<Status, string> = {
  'not-started': '未开始',
  learning: '学习中',
  practicing: '练习中',
  review: '待复盘',
  passed: '已通关',
}

const weightLabels: Record<Weight, string> = {
  core: '核心路径',
  normal: '常规掌握',
  stretch: '延展冲刺',
}

const p = {
  luoguTraining: 'https://www.luogu.com.cn/training/list',
  luoguOutline: 'https://www.luogu.com.cn/training/63324',
  cf: 'https://codeforces.com/problemset',
}

const categories: Category[] = [
  {
    id: 'language',
    title: '语言基础',
    subtitle: '语法 / STL / 复杂度',
    x: 90,
    y: 210,
    links: ['basic'],
    topics: [
      {
        id: 'io-type',
        title: '输入输出与数据类型',
        stage: 'GESP1+ / 入门 / CF800-',
        status: 'passed',
        minGesp: '1级+',
        noiBand: '入门',
        cfBand: '800-',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'core' },
        prerequisites: [],
        visual: '变量盒子、输入流、输出格式检查器',
        standards: {
          gesp: ['能处理整数、小数、字符、字符串输入输出', '会根据数据范围选择 int / long long', '能解释格式化输出和样例检查'],
          noi: ['能稳定完成普及组 T1 输入输出', '知道文件读写和标准输入输出差异', '会用样例和边界样例自测'],
          cf: ['能读懂英文 input/output 段', '能处理多组测试', '知道溢出、精度和换行会导致 WA'],
        },
        problems: [
          { title: '洛谷入门题单', source: '洛谷', level: '入门', url: p.luoguTraining },
          { title: 'P1001 A+B Problem', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/problem/P1001' },
          { title: 'CF 800 Problemset', source: 'Codeforces', level: '800', url: 'https://codeforces.com/problemset?tags=800-800' },
        ],
      },
      {
        id: 'branch-loop',
        title: '分支循环与模拟',
        stage: 'GESP1-2 / 入门-普及- / CF800-900',
        status: 'passed',
        minGesp: '1级+',
        noiBand: '入门 / 普及-',
        cfBand: '800-900',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'core' },
        prerequisites: ['输入输出与数据类型'],
        visual: '流程图单步执行、循环变量轨迹',
        standards: {
          gesp: ['能把题意拆成 if 和 for/while', '能完成日期、计数、过程模拟', '会解释每个循环变量含义'],
          noi: ['能完成普及基础模拟题', '会处理特殊情况和边界', '能写出清晰的分类讨论'],
          cf: ['能快速实现操作序列题', '能发现隐藏边界', '能在 20 分钟内 AC 800-900 模拟题'],
        },
        problems: [
          { title: '洛谷顺序/分支/循环训练', source: '洛谷', level: '入门', url: p.luoguOutline },
          { title: 'P1422 小玉家的电费', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/problem/P1422' },
          { title: 'P5719 分类平均', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/problem/P5719' },
          { title: 'CF implementation', source: 'Codeforces', level: '800-1000', url: 'https://codeforces.com/problemset?tags=implementation' },
        ],
      },
      {
        id: 'stl-complexity',
        title: 'STL 与复杂度',
        stage: 'GESP3+ / 普及 / CF900+',
        status: 'learning',
        minGesp: '3级+',
        noiBand: '普及',
        cfBand: '900-1200',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['数组与字符串'],
        visual: 'vector / map / set 操作成本对比',
        standards: {
          gesp: ['知道 vector、string、sort 的基本用法', '能粗略判断 O(n)、O(n log n)、O(n^2)', '不滥用 STL 黑箱'],
          noi: ['会用 pair、map、set、queue、priority_queue', '能根据数据范围选择复杂度', '能解释排序和查找的成本'],
          cf: ['会用 STL 快速建模', '知道 unordered_map 风险', '能在比赛中用容器减少实现成本'],
        },
        problems: [
          { title: 'P1177 排序', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P1177' },
          { title: '洛谷 STL 相关题单', source: '洛谷', level: '普及', url: p.luoguOutline },
          { title: 'CF sortings', source: 'Codeforces', level: '900-1300', url: 'https://codeforces.com/problemset?tags=sortings' },
          { title: 'CF data structures easy', source: 'Codeforces', level: '900-1300', url: 'https://codeforces.com/problemset?tags=data%20structures' },
        ],
      },
    ],
  },
  {
    id: 'basic',
    title: '基础算法',
    subtitle: '枚举 / 前缀 / 二分 / 双指针',
    x: 285,
    y: 160,
    links: ['search', 'dp', 'math'],
    topics: [
      {
        id: 'enumeration',
        title: '枚举与排序',
        stage: 'GESP3+ / 普及 / CF900-1100',
        status: 'learning',
        minGesp: '3级+',
        noiBand: '普及',
        cfBand: '900-1100',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'core' },
        prerequisites: ['分支循环与模拟', 'STL 与复杂度'],
        visual: '枚举空间剪枝、排序前后对比',
        standards: {
          gesp: ['能写全枚举和简单优化枚举', '会 sort 和自定义比较', '知道暴力什么时候会超时'],
          noi: ['能通过排序制造顺序和单调性', '能完成普及排序统计题', '会用复杂度解释方案'],
          cf: ['能把排序作为贪心前置', '能处理 pair/vector 排序', '能判断枚举维度能否压缩'],
        },
        problems: [
          { title: 'P1177 排序', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P1177' },
          { title: 'P1093 奖学金', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1093' },
          { title: 'P2249 查找', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P2249' },
          { title: 'CF implementation + sortings', source: 'Codeforces', level: '900-1300', url: 'https://codeforces.com/problemset?tags=sortings' },
        ],
      },
      {
        id: 'prefix-diff',
        title: '前缀和与差分',
        stage: 'GESP3+ / 普及-CSP-J / CF900-1200',
        status: 'learning',
        minGesp: '3级+',
        noiBand: '普及 / CSP-J',
        cfBand: '900-1200',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'core' },
        prerequisites: ['数组与字符串'],
        visual: '区间求和热力条、差分还原动画',
        standards: {
          gesp: ['会一维前缀和做区间查询', '理解差分区间修改', '能画表解释还原过程'],
          noi: ['会二维前缀和基础', '能处理多次询问', '能从题面看出预处理价值'],
          cf: ['能用于贡献统计和区间计数', '能结合排序/map 使用', '会处理 long long 累加'],
        },
        problems: [
          { title: 'P8218 求区间和', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/problem/P8218' },
          { title: 'P1719 最大加权矩形', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P1719' },
          { title: '洛谷前缀和&差分大纲', source: '洛谷', level: '普及', url: p.luoguOutline },
          { title: 'CF prefix sums', source: 'Codeforces', level: '900-1300', url: 'https://codeforces.com/problemset?tags=prefix%20sums' },
        ],
      },
      {
        id: 'binary-search',
        title: '二分与答案二分',
        stage: 'GESP4+ / CSP-J+ / CF1000-1400',
        status: 'learning',
        minGesp: '4级+',
        noiBand: 'CSP-J / 普及+',
        cfBand: '1000-1400',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['枚举与排序'],
        visual: '答案区间收缩、check 单调性标记',
        standards: {
          gesp: ['会有序数组二分查找', '能避免死循环', '能描述左右边界含义'],
          noi: ['能完成跳石头类答案二分', '能证明 check 单调性', '会最大化最小值/最小化最大值'],
          cf: ['能把题意转成可判定问题', '能处理精度和 long long 边界', '能用二分套贪心/图论'],
        },
        problems: [
          { title: 'P2678 跳石头', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P2678' },
          { title: 'P1873 砍树', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P1873' },
          { title: 'P2440 木材加工', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P2440' },
          { title: 'CF binary search', source: 'Codeforces', level: '1000-1500', url: 'https://codeforces.com/problemset?tags=binary%20search' },
        ],
      },
      {
        id: 'two-pointer',
        title: '双指针与滑动窗口',
        stage: 'GESP4+ / 普及+ / CF1000-1300',
        status: 'not-started',
        minGesp: '4级+',
        noiBand: '普及+ / CSP-J',
        cfBand: '1000-1300',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['枚举与排序', '前缀和与差分'],
        visual: '左右指针移动、窗口合法性变化',
        standards: {
          gesp: ['理解左右指针移动规则', '能处理有序数组上的双指针', '能判断窗口是否合法'],
          noi: ['能用双指针优化 O(n^2)', '能解释每个指针最多移动 n 次', '会处理窗口边界'],
          cf: ['能和排序、前缀、map 结合', '能证明移动策略不漏解', '能完成 1200-1400 尺取题'],
        },
        problems: [
          { title: 'P1638 逛画展', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P1638' },
          { title: 'P1102 A-B 数对', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1102' },
          { title: 'CF two pointers', source: 'Codeforces', level: '1000-1500', url: 'https://codeforces.com/problemset?tags=two%20pointers' },
        ],
      },
    ],
  },
  {
    id: 'search',
    title: '搜索',
    subtitle: 'DFS / BFS / 剪枝 / 记忆化',
    x: 500,
    y: 95,
    links: ['graph', 'dp'],
    topics: [
      {
        id: 'dfs-backtrack',
        title: 'DFS、回溯与剪枝',
        stage: 'GESP4+ / CSP-J / CF1000-1300',
        status: 'practicing',
        minGesp: '4级+',
        noiBand: 'CSP-J / 普及+',
        cfBand: '1000-1300',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'normal' },
        prerequisites: ['分支循环与模拟', '数组与字符串'],
        visual: '搜索树展开、回溯恢复现场',
        standards: {
          gesp: ['会写递归 DFS 和回溯恢复', '会基础剪枝：越界、访问、不可行', '能处理排列组合枚举'],
          noi: ['CSP-J 掌握小剪枝即可覆盖多数题', '能解释搜索树和状态定义', '能估算搜索规模'],
          cf: ['能抽象状态和约束', '能主动剪等价/无效分支', '知道爆搜和 DP 的边界'],
        },
        problems: [
          { title: 'P1706 全排列问题', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1706' },
          { title: 'P1605 迷宫', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1605' },
          { title: '洛谷搜索剪枝大纲', source: '洛谷', level: '提高', url: p.luoguOutline },
          { title: 'CF dfs and similar', source: 'Codeforces', level: '1000-1500', url: 'https://codeforces.com/problemset?tags=dfs%20and%20similar' },
        ],
      },
      {
        id: 'bfs',
        title: 'BFS 与最短步数',
        stage: 'GESP5+ / CSP-J+ / CF1100-1400',
        status: 'practicing',
        minGesp: '5级+',
        noiBand: 'CSP-J+ / CSP-S-',
        cfBand: '1100-1400',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'core' },
        prerequisites: ['DFS、回溯与剪枝'],
        visual: '迷宫波纹扩散、多源 BFS 染色',
        standards: {
          gesp: ['会用队列写 BFS', '能处理迷宫、连通块、最短步数', '能解释按层扩展'],
          noi: ['能把网格或状态建成图', '会 visited 和距离数组', '能处理多源 BFS 基础'],
          cf: ['能加入钥匙、方向、层数等状态', '能解决状态图最短路', '能识别 BFS 优于 DFS 的场景'],
        },
        problems: [
          { title: 'P1443 马的遍历', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1443' },
          { title: 'P1332 血色先锋队', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P1332' },
          { title: 'P1135 奇怪的电梯', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1135' },
          { title: 'CF shortest paths unweighted', source: 'Codeforces', level: '1100-1500', url: 'https://codeforces.com/problemset?tags=shortest%20paths' },
        ],
      },
      {
        id: 'memo-search',
        title: '记忆化搜索',
        stage: 'GESP6+ / CSP-S- / CF1300-1600',
        status: 'not-started',
        minGesp: '6级+',
        noiBand: 'CSP-S-',
        cfBand: '1300-1600',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['DFS、回溯与剪枝', '线性 DP'],
        visual: '递归树剪成 DAG',
        standards: {
          gesp: ['知道重复子问题可以缓存', '能写 dfs + memo', '能说明记忆数组含义'],
          noi: ['能在搜索和 DP 间转换', '能处理 DAG 上递推', '能分析状态数量'],
          cf: ['能处理状态转移较自然但顺序难定的问题', '能避免递归爆栈', '能优化状态表示'],
        },
        problems: [
          { title: 'P1434 滑雪', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P1434' },
          { title: 'P2196 挖地雷', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P2196' },
          { title: 'CF dp + dfs', source: 'Codeforces', level: '1300-1700', url: 'https://codeforces.com/problemset?tags=dp,dfs%20and%20similar' },
        ],
      },
    ],
  },
  {
    id: 'graph',
    title: '图论',
    subtitle: '建图 / 最短路 / 连通 / 匹配',
    x: 715,
    y: 145,
    links: ['tree', 'advanced'],
    topics: [
      {
        id: 'graph-repr',
        title: '图的定义与存储',
        stage: 'GESP5+ / CSP-S- / CF1200+',
        status: 'not-started',
        minGesp: '5级+',
        noiBand: 'CSP-S-',
        cfBand: '1200-1500',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['BFS 与最短步数', 'STL 与复杂度'],
        visual: '邻接矩阵、邻接表、链式前向星切换',
        standards: {
          gesp: ['理解点、边、邻接矩阵、邻接表', '能遍历图和树', '能处理有向/无向图'],
          noi: ['能根据边数选择存图方式', '能完成 CSP-S 常见建图', '会避免重复访问和重边陷阱'],
          cf: ['能从题意抽象隐式图', '能用图模型解释正确性', '能发现状态图和普通图的差异'],
        },
        problems: [
          { title: 'P5318 查找文献', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P5318' },
          { title: '信息学奥赛一本通图论题单', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/training/10994' },
          { title: '经典模板汇总-提高组图论', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/training/3364' },
          { title: 'CF graphs', source: 'Codeforces', level: '1200-1700', url: 'https://codeforces.com/problemset?tags=graphs' },
        ],
      },
      {
        id: 'shortest-path',
        title: '最短路',
        stage: 'GESP6+ / CSP-S / CF1300-1800',
        status: 'not-started',
        minGesp: '6级+',
        noiBand: 'CSP-S',
        cfBand: '1300-1800',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['图的定义与存储', '二分与答案二分'],
        visual: 'Dijkstra 松弛过程、0-1 BFS 队列变化',
        standards: {
          gesp: ['知道 Floyd、Dijkstra、Bellman-Ford 的用途', '能套基础模板', '知道非负边限制'],
          noi: ['会 Dijkstra、Floyd、SPFA 判负环基础', '能处理分层图、差分约束入门', '会复杂度分析'],
          cf: ['能建模为状态图最短路', '能选择多源 BFS、0-1 BFS、Dijkstra', '能构造反例检查建边'],
        },
        problems: [
          { title: 'P3371 单源最短路径', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3371' },
          { title: 'P4779 单源最短路径标准版', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P4779' },
          { title: 'P2910 Clear And Present Danger', source: '洛谷', level: 'Floyd', url: 'https://www.luogu.com.cn/problem/P2910' },
          { title: '洛谷最短路题单', source: '洛谷', level: '图论2-2', url: 'https://www.luogu.com.cn/training/208' },
          { title: 'CF shortest paths', source: 'Codeforces', level: '1300-1900', url: 'https://codeforces.com/problemset?tags=shortest%20paths' },
        ],
      },
      {
        id: 'dsu-mst',
        title: '并查集与最小生成树',
        stage: 'GESP6+ / CSP-S / CF1300-1700',
        status: 'not-started',
        minGesp: '6级+',
        noiBand: 'CSP-S / 提高-',
        cfBand: '1300-1700',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['图的定义与存储', '贪心策略与证明'],
        visual: '集合森林合并、Kruskal 选边动画',
        standards: {
          gesp: ['理解集合合并和路径压缩', '知道 Kruskal 用并查集判环', '能写基础模板'],
          noi: ['会并查集维护连通性', '会 Kruskal、Prim 基础', '能解释 MST 贪心正确性'],
          cf: ['能处理 DSU 技巧题雏形', '能把并查集与排序/离线结合', '能识别懒合并和撤销需求'],
        },
        problems: [
          { title: 'P3367 并查集', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3367' },
          { title: 'P3366 最小生成树', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3366' },
          { title: 'P1197 星球大战', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P1197' },
          { title: 'CF dsu', source: 'Codeforces', level: '1300-1800', url: 'https://codeforces.com/problemset?tags=dsu' },
        ],
      },
      {
        id: 'connectivity',
        title: '连通性、拓扑与强连通',
        stage: 'GESP7+ / 提高 / CF1500-1900',
        status: 'not-started',
        minGesp: '7级+',
        noiBand: '提高',
        cfBand: '1500-1900',
        routeWeight: { gesp: 'stretch', noi: 'core', cf: 'core' },
        prerequisites: ['图的定义与存储', 'DFS、回溯与剪枝'],
        visual: '拓扑入度消点、Tarjan 栈变化',
        standards: {
          gesp: ['作为延展：理解有向无环图和入度', '能看懂拓扑排序', '知道强连通概念'],
          noi: ['会拓扑排序、SCC、割点割边基础', '能用缩点建 DAG', '能处理连通性综合题'],
          cf: ['能用拓扑/缩点建模', '能处理必要充分条件和构造', '能完成 1700 左右图论思维题'],
        },
        problems: [
          { title: 'P4017 最大食物链计数', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P4017' },
          { title: 'P3387 缩点', source: '洛谷', level: '提高+/省选-', url: 'https://www.luogu.com.cn/problem/P3387' },
          { title: 'P3388 割点', source: '洛谷', level: '提高+/省选-', url: 'https://www.luogu.com.cn/problem/P3388' },
          { title: 'CF graphs 1600+', source: 'Codeforces', level: '1600-2000', url: 'https://codeforces.com/problemset?tags=graphs' },
        ],
      },
    ],
  },
  {
    id: 'tree',
    title: '树',
    subtitle: '二叉树 / LCA / 树形 DP',
    x: 930,
    y: 105,
    links: ['advanced'],
    topics: [
      {
        id: 'tree-basic',
        title: '树的性质与遍历',
        stage: 'GESP5+ / 普及+ / CF1200-1500',
        status: 'not-started',
        minGesp: '5级+',
        noiBand: '普及+ / CSP-S-',
        cfBand: '1200-1500',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'normal' },
        prerequisites: ['图的定义与存储'],
        visual: '有根树选根、深度/高度/子树动态标注',
        standards: {
          gesp: ['理解树是连通无环图', '能做树的 DFS/BFS', '知道父子、深度、子树概念'],
          noi: ['能处理树上统计和树的直径', '会存树、遍历树', '能把无根树转有根树'],
          cf: ['能在树上做贡献统计', '能处理根变化初步', '能读懂树题的输入结构'],
        },
        problems: [
          { title: 'P1030 求先序排列', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1030' },
          { title: 'P4017 最大食物链计数', source: '洛谷', level: 'DAG/树形思维', url: 'https://www.luogu.com.cn/problem/P4017' },
          { title: 'CF trees', source: 'Codeforces', level: '1200-1600', url: 'https://codeforces.com/problemset?tags=trees' },
        ],
      },
      {
        id: 'lca',
        title: 'LCA 与树上路径',
        stage: 'GESP7+ / 提高 / CF1500-1900',
        status: 'not-started',
        minGesp: '7级+',
        noiBand: '提高',
        cfBand: '1500-1900',
        routeWeight: { gesp: 'stretch', noi: 'core', cf: 'normal' },
        prerequisites: ['树的性质与遍历', '二分与答案二分'],
        visual: '倍增跳祖先、路径拆分',
        standards: {
          gesp: ['作为延展：理解最近公共祖先', '能看懂倍增表', '能处理小规模路径查询'],
          noi: ['会倍增 LCA、树上差分基础', '能处理距离、路径、子树问题', '能写模板并解释复杂度'],
          cf: ['能把 LCA 和贡献/离线结合', '能处理 1700 左右树上路径题', '能识别是否需要重链剖分'],
        },
        problems: [
          { title: 'P3379 LCA', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3379' },
          { title: 'P3258 松鼠的新家', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P3258' },
          { title: 'CF trees + lca', source: 'Codeforces', level: '1500-1900', url: 'https://codeforces.com/problemset?tags=trees' },
        ],
      },
      {
        id: 'tree-dp',
        title: '树形 DP',
        stage: 'GESP8+ / 提高+ / CF1600-2000',
        status: 'not-started',
        minGesp: '8级+',
        noiBand: '提高+',
        cfBand: '1600-2000',
        routeWeight: { gesp: 'stretch', noi: 'core', cf: 'core' },
        prerequisites: ['树的性质与遍历', '线性 DP'],
        visual: '自底向上合并、换根 DP 流向',
        standards: {
          gesp: ['作为冲刺：理解子树状态合并', '能看懂基础树 DP', '能讲清父子关系'],
          noi: ['会树上背包、换根 DP 基础', '能处理子树贡献', '能设计状态和转移顺序'],
          cf: ['能完成 1700-2000 树 DP', '能处理 rerooting 和贡献统计', '能优化状态合并'],
        },
        problems: [
          { title: 'P1352 没有上司的舞会', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P1352' },
          { title: 'P2015 二叉苹果树', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P2015' },
          { title: 'CF tree dp', source: 'Codeforces', level: '1600-2000', url: 'https://codeforces.com/problemset?tags=trees,dp' },
        ],
      },
    ],
  },
  {
    id: 'dp',
    title: '动态规划',
    subtitle: '线性 / 背包 / 区间 / 状压',
    x: 505,
    y: 380,
    links: ['advanced'],
    topics: [
      {
        id: 'linear-dp',
        title: '线性 DP',
        stage: 'GESP5+ / CSP-S- / CF1200-1500',
        status: 'learning',
        minGesp: '5级+',
        noiBand: 'CSP-S-',
        cfBand: '1200-1500',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'core' },
        prerequisites: ['前缀和与差分', '枚举与排序'],
        visual: 'DP 表格转移、状态依赖箭头',
        standards: {
          gesp: ['理解状态、转移、初始化', '能写爬楼梯、路径 DP、LIS 基础', '能用表格讲清转移来源'],
          noi: ['能根据约束选状态维度', '能处理一维/二维线性 DP', '会滚动数组基础'],
          cf: ['能解决 1400 左右最优/计数 DP', '能从贪心失败转向 DP', '能处理取模和初始化陷阱'],
        },
        problems: [
          { title: 'P1216 数字三角形', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1216' },
          { title: 'P1020 导弹拦截', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P1020' },
          { title: 'P1091 合唱队形', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P1091' },
          { title: 'CF dp', source: 'Codeforces', level: '1200-1600', url: 'https://codeforces.com/problemset?tags=dp' },
        ],
      },
      {
        id: 'knapsack',
        title: '背包 DP',
        stage: 'GESP6+ / CSP-S / CF1300-1600',
        status: 'learning',
        minGesp: '6级+',
        noiBand: 'CSP-S',
        cfBand: '1300-1600',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'normal' },
        prerequisites: ['线性 DP'],
        visual: '容量轴滚动更新、倒序/正序对比',
        standards: {
          gesp: ['会 01 背包和完全背包', '能解释倒序/正序循环原因', '能处理恰好装满和不超过容量'],
          noi: ['会多重背包基础和滚动数组', '能从限制判断价值/体积维度', '能讲出状态含义'],
          cf: ['能识别背包模型变形', '能处理布尔可达或计数背包', '知道 bitset 背包作为延展'],
        },
        problems: [
          { title: 'P1048 采药', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1048' },
          { title: 'P1616 疯狂的采药', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P1616' },
          { title: 'P1776 宝物筛选', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P1776' },
          { title: '洛谷 DP 大纲', source: '洛谷', level: '入门-提高', url: p.luoguOutline },
        ],
      },
      {
        id: 'interval-dp',
        title: '区间 DP',
        stage: 'GESP7+ / CSP-S-提高 / CF1500-1800',
        status: 'not-started',
        minGesp: '7级+',
        noiBand: 'CSP-S / 提高',
        cfBand: '1500-1800',
        routeWeight: { gesp: 'stretch', noi: 'core', cf: 'normal' },
        prerequisites: ['线性 DP'],
        visual: '区间长度递推、断点 k 枚举',
        standards: {
          gesp: ['作为高阶内容：理解按长度枚举区间', '能解释断点 k 的含义', '能完成合并类模板题'],
          noi: ['能写石子合并、括号匹配类转移', '会处理环形区间基础', '能讲清枚举顺序'],
          cf: ['能处理区间博弈或字符串区间 DP', '能判断 O(n^3) 是否可过', '能优化边界和常数'],
        },
        problems: [
          { title: 'P1880 石子合并', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P1880' },
          { title: 'P1063 能量项链', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P1063' },
          { title: 'P4170 涂色', source: '洛谷', level: '提高+', url: 'https://www.luogu.com.cn/problem/P4170' },
          { title: 'CF interval dp', source: 'Codeforces', level: '1500-1900', url: 'https://codeforces.com/problemset?tags=dp' },
        ],
      },
      {
        id: 'state-dp',
        title: '状态压缩与综合 DP',
        stage: 'GESP8+ / 提高+ / CF1600-2000',
        status: 'not-started',
        minGesp: '8级+',
        noiBand: '提高+',
        cfBand: '1600-2000',
        routeWeight: { gesp: 'stretch', noi: 'core', cf: 'core' },
        prerequisites: ['线性 DP', '位运算与组合计数'],
        visual: 'mask 状态转移图',
        standards: {
          gesp: ['作为冲刺：理解二进制集合表示', '能看懂 mask 增删查', '能完成小规模集合 DP'],
          noi: ['能写状压 DP、DAG DP、树形 DP 基础', '能从 n 小看出状压', '能解释状态合法性'],
          cf: ['能解决 1700-2000 综合 DP', '能把 bitmask 和图/计数结合', '能优化状态转移'],
        },
        problems: [
          { title: 'P1896 互不侵犯', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P1896' },
          { title: 'P2704 炮兵阵地', source: '洛谷', level: '提高+/省选-', url: 'https://www.luogu.com.cn/problem/P2704' },
          { title: 'CF bitmasks', source: 'Codeforces', level: '1600-2000', url: 'https://codeforces.com/problemset?tags=bitmasks' },
        ],
      },
    ],
  },
  {
    id: 'ds',
    title: '数据结构',
    subtitle: '栈队列 / 堆 / 树状数组 / 线段树',
    x: 710,
    y: 420,
    links: ['tree', 'advanced'],
    topics: [
      {
        id: 'stack-queue-heap',
        title: '栈、队列、堆',
        stage: 'GESP4-6 / 普及-提高 / CF1000-1500',
        status: 'not-started',
        minGesp: '4级+',
        noiBand: '普及+ / CSP-S-',
        cfBand: '1000-1500',
        routeWeight: { gesp: 'core', noi: 'core', cf: 'core' },
        prerequisites: ['STL 与复杂度'],
        visual: '入栈出栈、队列流、堆上浮下沉',
        standards: {
          gesp: ['理解栈、队列、优先队列', '能用 queue 写 BFS', '能用 priority_queue 取动态最值'],
          noi: ['会单调栈/队列前置知识', '能用堆支撑贪心', '能分析每次操作复杂度'],
          cf: ['能用容器快速实现策略', '知道懒删除需求', '能处理多关键字优先级'],
        },
        problems: [
          { title: 'P1449 后缀表达式', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1449' },
          { title: 'P3378 堆', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3378' },
          { title: 'CF data structures', source: 'Codeforces', level: '1000-1600', url: 'https://codeforces.com/problemset?tags=data%20structures' },
        ],
      },
      {
        id: 'mono',
        title: '单调栈与单调队列',
        stage: 'GESP6+ / 提高- / CF1400-1700',
        status: 'not-started',
        minGesp: '6级+',
        noiBand: '提高-',
        cfBand: '1400-1700',
        routeWeight: { gesp: 'stretch', noi: 'core', cf: 'core' },
        prerequisites: ['双指针与滑动窗口', '线性 DP'],
        visual: '队列入队出队、无用元素淘汰',
        standards: {
          gesp: ['作为延展：理解维护单调性', '能看懂窗口最大值', '知道队首队尾含义'],
          noi: ['能解决滑动窗口和最近更大值', '能用单调队列优化 DP', '能证明元素进出一次'],
          cf: ['能处理贡献计算和边界', '能把单调结构和贪心/DP 结合', '能完成 1600 左右相关题'],
        },
        problems: [
          { title: 'P1886 滑动窗口', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P1886' },
          { title: 'P5788 单调栈', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P5788' },
          { title: 'CF data structures 1400+', source: 'Codeforces', level: '1400-1800', url: 'https://codeforces.com/problemset?tags=data%20structures' },
        ],
      },
      {
        id: 'bit-segtree',
        title: '树状数组与线段树',
        stage: 'GESP7+ / 提高 / CF1500-1900',
        status: 'not-started',
        minGesp: '7级+',
        noiBand: '提高',
        cfBand: '1500-1900',
        routeWeight: { gesp: 'stretch', noi: 'core', cf: 'core' },
        prerequisites: ['前缀和与差分', '二分与答案二分'],
        visual: '区间树节点覆盖、lazy tag 下传',
        standards: {
          gesp: ['作为延展：理解区间维护', '能看懂单点修改和区间查询', '知道何时不必使用重型结构'],
          noi: ['能写 BIT 和线段树模板', '能解释 lowbit 与懒标记', '能解决提高组区间维护题'],
          cf: ['能维护最大值、计数、组合信息', '能结合离散化和在线更新', '能完成 1700-1900 数据结构题'],
        },
        problems: [
          { title: 'P3374 树状数组 1', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3374' },
          { title: 'P3368 树状数组 2', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3368' },
          { title: 'P3372 线段树 1', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3372' },
          { title: 'P3373 线段树 2', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3373' },
          { title: 'CF segment tree', source: 'Codeforces', level: '1500-2000', url: 'https://codeforces.com/problemset?tags=data%20structures' },
        ],
      },
    ],
  },
  {
    id: 'math',
    title: '数学',
    subtitle: '数论 / 组合 / 位运算',
    x: 300,
    y: 430,
    links: ['dp', 'advanced'],
    topics: [
      {
        id: 'number-theory',
        title: '数论基础',
        stage: 'GESP5+ / CSP-S / CF1200-1700',
        status: 'not-started',
        minGesp: '5级+',
        noiBand: 'CSP-S',
        cfBand: '1200-1700',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['枚举与排序'],
        visual: '筛法格子、gcd 递归过程',
        standards: {
          gesp: ['会 gcd、素数判断、快速幂', '理解取模运算', '能完成简单整除题'],
          noi: ['会筛法、快速幂、逆元基础', '能处理模意义下计算', '能写清数学推导'],
          cf: ['能处理数论构造和整除性质', '能从 gcd/lcm 找不变量', '能预处理质数和因子'],
        },
        problems: [
          { title: 'P3383 线性筛素数', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3383' },
          { title: 'P1226 快速幂', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P1226' },
          { title: 'P3811 乘法逆元', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P3811' },
          { title: 'CF math', source: 'Codeforces', level: '1200-1800', url: 'https://codeforces.com/problemset?tags=math' },
        ],
      },
      {
        id: 'combinatorics',
        title: '组合计数',
        stage: 'GESP6+ / 提高- / CF1400-1800',
        status: 'not-started',
        minGesp: '6级+',
        noiBand: '提高-',
        cfBand: '1400-1800',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['数论基础', '线性 DP'],
        visual: '组合数三角、贡献计数拆分',
        standards: {
          gesp: ['知道排列组合基础', '能算简单组合数', '理解不重不漏'],
          noi: ['会组合数预处理、容斥基础', '能处理取模计数', '能结合 DP 计数'],
          cf: ['能做贡献计数和组合推导', '能处理逆元和预处理', '能发现重复计数'],
        },
        problems: [
          { title: 'P2822 组合数问题', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P2822' },
          { title: 'P3807 卢卡斯定理', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P3807' },
          { title: 'CF combinatorics', source: 'Codeforces', level: '1400-1900', url: 'https://codeforces.com/problemset?tags=combinatorics' },
        ],
      },
      {
        id: 'bitmask',
        title: '位运算与集合表示',
        stage: 'GESP6+ / 提高 / CF1300-1700',
        status: 'not-started',
        minGesp: '6级+',
        noiBand: '提高',
        cfBand: '1300-1700',
        routeWeight: { gesp: 'normal', noi: 'core', cf: 'core' },
        prerequisites: ['STL 与复杂度'],
        visual: '二进制位开关、集合增删查',
        standards: {
          gesp: ['理解与或异或、移位', '能用二进制表示集合', '能看懂 lowbit'],
          noi: ['能配合状压 DP', '能处理位枚举和子集枚举', '知道补码基本风险'],
          cf: ['能用异或不变量做题', '能处理 bitmask 构造', '能快速枚举子集/超集'],
        },
        problems: [
          { title: 'P1469 找筷子', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1469' },
          { title: 'CF bitmasks', source: 'Codeforces', level: '1300-1900', url: 'https://codeforces.com/problemset?tags=bitmasks' },
          { title: 'AtCoder bit 全探索', source: 'AtCoder', level: 'ABC', url: 'https://atcoder.jp/' },
        ],
      },
    ],
  },
  {
    id: 'string',
    title: '字符串',
    subtitle: '哈希 / KMP / Trie',
    x: 930,
    y: 440,
    links: ['advanced'],
    topics: [
      {
        id: 'hash-kmp',
        title: '字符串哈希与 KMP',
        stage: 'GESP8+ / 提高+ / CF1600-2000',
        status: 'not-started',
        minGesp: '8级+',
        noiBand: '提高+',
        cfBand: '1600-2000',
        routeWeight: { gesp: 'stretch', noi: 'normal', cf: 'core' },
        prerequisites: ['数组与字符串', '数论基础'],
        visual: 'KMP next 指针、哈希窗口滑动',
        standards: {
          gesp: ['作为延展：理解模式匹配需求', '能看懂哈希和 KMP 思路', '能完成简单字符串匹配'],
          noi: ['会字符串哈希、KMP、Trie 基础', '能处理模式串和文本串', '知道哈希冲突风险'],
          cf: ['能用哈希做子串比较', '能解决 1700+ 字符串构造/匹配', '能和 DP 或二分结合'],
        },
        problems: [
          { title: 'P3375 KMP', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3375' },
          { title: 'P3370 字符串哈希', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P3370' },
          { title: 'P2580 Trie', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P2580' },
          { title: 'CF strings', source: 'Codeforces', level: '1500-2000', url: 'https://codeforces.com/problemset?tags=strings' },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    title: '综合提高',
    subtitle: '构造 / 离线 / 网络流 / 省选入门',
    x: 1110,
    y: 270,
    links: [],
    topics: [
      {
        id: 'constructive',
        title: '构造与贪心证明',
        stage: 'GESP8+ / 提高+ / CF1600-2000',
        status: 'review',
        minGesp: '8级+',
        noiBand: '提高+',
        cfBand: '1600-2000',
        routeWeight: { gesp: 'stretch', noi: 'normal', cf: 'core' },
        prerequisites: ['贪心策略与证明', '组合计数'],
        visual: '反例生成、必要充分条件拆解',
        standards: {
          gesp: ['作为冲刺：能看懂构造条件', '能主动找反例', '能复盘思维题失败原因'],
          noi: ['能把多个知识点组合建模', '能写清交换论证或反证', '能处理综合题部分分'],
          cf: ['能完成 1800-2000 构造题', '能快速判断必要充分条件', '能在赛后提炼套路和反套路'],
        },
        problems: [
          { title: 'CF constructive algorithms', source: 'Codeforces', level: '1600-2000', url: 'https://codeforces.com/problemset?tags=constructive%20algorithms' },
          { title: 'CF 2000 Problemset', source: 'Codeforces', level: '2000', url: 'https://codeforces.com/problemset?tags=2000-2000' },
          { title: '洛谷综合题单', source: '洛谷', level: '提高+', url: p.luoguTraining },
        ],
      },
      {
        id: 'offline',
        title: '离线、分治与整体二分',
        stage: 'GESP8+ / 省选入门 / CF1800-2000',
        status: 'not-started',
        minGesp: '8级+',
        noiBand: '省选入门',
        cfBand: '1800-2000',
        routeWeight: { gesp: 'stretch', noi: 'stretch', cf: 'core' },
        prerequisites: ['树状数组与线段树', '二分与答案二分'],
        visual: '时间轴离线排序、答案域二分',
        standards: {
          gesp: ['作为了解：知道在线和离线区别', '能看懂按时间排序处理', '不要求完全独立掌握'],
          noi: ['能理解 CDQ、整体二分、莫队的适用场景', '能写基础离线套路', '会分析复杂度'],
          cf: ['能在 1900-2000 题中识别离线处理', '能组合 BIT/线段树', '能处理查询排序和回滚'],
        },
        problems: [
          { title: '洛谷其他算法大纲', source: '洛谷', level: 'NOI/省选', url: p.luoguOutline },
          { title: 'CF divide and conquer', source: 'Codeforces', level: '1800-2200', url: 'https://codeforces.com/problemset?tags=divide%20and%20conquer' },
          { title: 'CF data structures 1900+', source: 'Codeforces', level: '1900-2200', url: 'https://codeforces.com/problemset?tags=data%20structures' },
        ],
      },
      {
        id: 'flow-match',
        title: '二分图、匹配与网络流',
        stage: 'GESP8+ / 省选入门 / CF1700-2200',
        status: 'not-started',
        minGesp: '8级+',
        noiBand: '省选入门',
        cfBand: '1700-2200',
        routeWeight: { gesp: 'stretch', noi: 'stretch', cf: 'normal' },
        prerequisites: ['图的定义与存储', '连通性、拓扑与强连通'],
        visual: '增广路、残量网络动画',
        standards: {
          gesp: ['作为了解：知道二分图和匹配概念', '能看懂增广路思想', '不作为 GESP 主线要求'],
          noi: ['会二分图判定、匈牙利、最大流基础', '能理解最小割', '能处理省选入门网络流题'],
          cf: ['能把匹配或流作为建模工具', '能判断是否过重', '能解决 1800+ 建模题'],
        },
        problems: [
          { title: 'P3386 二分图最大匹配', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3386' },
          { title: 'P3376 最大流', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3376' },
          { title: 'P3381 最小费用最大流', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3381' },
          { title: 'CF flows', source: 'Codeforces', level: '1800+', url: 'https://codeforces.com/problemset?tags=flows' },
        ],
      },
    ],
  },
]

const categoryById = new Map(categories.map((category) => [category.id, category]))
const allTopics = categories.flatMap((category) => category.topics.map((topic) => ({ ...topic, categoryId: category.id, categoryTitle: category.title })))
const topicById = new Map(allTopics.map((topic) => [topic.id, topic]))

function categoryHasRoute(category: Category, route: RouteKey) {
  return category.topics.some((topic) => topic.routeWeight[route] === 'core')
}

function categoryProblems(category: Category) {
  return category.topics.reduce((sum, topic) => sum + topic.problems.length, 0)
}

function App() {
  const [route, setRoute] = useState<RouteKey>('gesp')
  const [expandedCategory, setExpandedCategory] = useState('graph')
  const [graphMode, setGraphMode] = useState<'categories' | 'topics'>('categories')
  const [selectedTopicId, setSelectedTopicId] = useState('shortest-path')
  const [zoom, setZoom] = useState(1)
  const [topicStatus, setTopicStatus] = useState<Record<string, Status>>(() => {
    const saved = localStorage.getItem('tongguan-topic-status')
    return saved ? JSON.parse(saved) : {}
  })

  const selectedTopic = topicById.get(selectedTopicId) ?? allTopics[0]
  const expanded = categoryById.get(expandedCategory) ?? categories[0]

  const routePath = useMemo(() => {
    const focused = new Set<string>()
    categories.forEach((category) => {
      if (categoryHasRoute(category, route)) focused.add(category.id)
    })
    return focused
  }, [route])

  const topicPositions = useMemo(() => {
    const offsets = [
      { x: -250, y: 120 },
      { x: 10, y: 120 },
      { x: -250, y: 220 },
      { x: 10, y: 220 },
      { x: -250, y: 320 },
      { x: 10, y: 320 },
    ]
    return expanded.topics.map((topic, index) => ({
      topic,
      x: Math.max(70, Math.min(920, expanded.x + offsets[index % offsets.length].x)),
      y: Math.max(80, Math.min(650, expanded.y + offsets[index % offsets.length].y)),
    }))
  }, [expanded])

  const topicPositionByTitle = useMemo(() => {
    return new Map(topicPositions.map((item) => [item.topic.title, item]))
  }, [topicPositions])

  const topicEdges = useMemo(() => {
    const edges: { from: string; to: string }[] = []
    expanded.topics.forEach((topic, index) => {
      const localPrereqs = topic.prerequisites.filter((name) => topicPositionByTitle.has(name))
      if (localPrereqs.length > 0) {
        localPrereqs.forEach((name) => edges.push({ from: name, to: topic.title }))
      } else if (index > 0) {
        edges.push({ from: expanded.topics[index - 1].title, to: topic.title })
      }
    })
    return edges
  }, [expanded, topicPositionByTitle])

  const progress = useMemo(() => {
    const passed = allTopics.filter((topic) => (topicStatus[topic.id] ?? topic.status) === 'passed').length
    return { passed, total: allTopics.length, percent: Math.round((passed / allTopics.length) * 100) }
  }, [topicStatus])

  const changeStatus = (topicId: string, status: Status) => {
    setTopicStatus((current) => {
      const next = { ...current, [topicId]: status }
      localStorage.setItem('tongguan-topic-status', JSON.stringify(next))
      return next
    })
  }

  const openCategory = (categoryId: string) => {
    setExpandedCategory(categoryId)
    setGraphMode('topics')
    setZoom(1)
    const first = categoryById.get(categoryId)?.topics[0]
    if (first) setSelectedTopicId(first.id)
  }

  const resetGraph = () => {
    setGraphMode('categories')
    setZoom(1)
  }

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    setZoom((current) => {
      const next = event.deltaY < 0 ? current + 0.12 : current - 0.12
      return Math.min(2.5, Math.max(0.3, Number(next.toFixed(2))))
    })
  }

  return (
    <main className="app-shell" style={{ '--route-color': routeColors[route] } as CSSProperties}>
      <header className="topbar">
        <div>
          <p className="eyebrow">Tongguan Algorithm Graph</p>
          <h1>算法知识图谱</h1>
          <p className="top-note">默认显示大类，点击大类展开小类；路线只负责高亮学习路径，不做硬等价。</p>
        </div>
        <div className="progress-box">
          <span>{progress.percent}%</span>
          <small>
            {progress.passed}/{progress.total} 已通关
          </small>
        </div>
      </header>

      <section className="route-tabs" aria-label="选择路线">
        {(Object.keys(routeLabels) as RouteKey[]).map((key) => (
          <button className={route === key ? 'active' : ''} key={key} onClick={() => setRoute(key)} type="button">
            <span>{routeLabels[key]}</span>
            <small>{routeNotes[key]}</small>
          </button>
        ))}
      </section>

      <section className="layout">
        <div className="graph-panel">
          <div className="panel-heading">
            <div>
              <h2>{graphMode === 'categories' ? '知识连通图' : `${expanded.title} 知识展开`}</h2>
              <p>
                {graphMode === 'categories'
                  ? '点击大类后，小知识点会在同一张图里展开，并继续连接周围知识。'
                  : '大类、小类和相邻路线会同时显示；鼠标滚轮只缩放这张图。'}
              </p>
            </div>
            <div className="graph-actions">
              <div className="zoom-readout">{Math.round(zoom * 100)}%</div>
              {graphMode === 'topics' && (
                <button className="reset-graph" onClick={resetGraph} type="button">
                  还原总览
                </button>
              )}
            </div>
          </div>

          <svg
            className={`knowledge-svg ${graphMode}`}
            onWheel={handleWheel}
            viewBox={`${610 - 610 / zoom} ${380 - 380 / zoom} ${1220 / zoom} ${760 / zoom}`}
            role="img"
            aria-label="算法知识图谱"
          >
            <defs>
              <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                <path d="M0,0 L8,4 L0,8 Z" fill="#8aa0ba" />
              </marker>
              <marker id="arrow-route" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                <path d="M0,0 L8,4 L0,8 Z" fill={routeColors[route]} />
              </marker>
            </defs>

            {categories.flatMap((category) =>
              category.links.map((targetId) => {
                const target = categoryById.get(targetId)
                if (!target) return null
                const onRoute = routePath.has(category.id) && routePath.has(target.id)
                return (
                  <line
                    className={onRoute ? 'graph-link route-link' : 'graph-link'}
                    key={`${category.id}-${targetId}`}
                    markerEnd={onRoute ? 'url(#arrow-route)' : 'url(#arrow)'}
                    x1={category.x + 56}
                    x2={target.x - 56}
                    y1={category.y}
                    y2={target.y}
                  />
                )
              }),
            )}

            {categories.map((category) => {
              const isOpen = expandedCategory === category.id
              const onRoute = routePath.has(category.id)
              return (
                <g
                  className={`category-node ${isOpen ? 'open' : ''} ${onRoute ? 'on-route' : ''}`}
                  data-testid={`category-${category.id}`}
                  key={category.id}
                  onClick={() => openCategory(category.id)}
                  onMouseDown={() => openCategory(category.id)}
                  role="button"
                  tabIndex={0}
                >
                  <circle cx={category.x} cy={category.y} r={58} />
                  <text className="category-title" x={category.x} y={category.y - 8}>
                    {category.title}
                  </text>
                  <text className="category-subtitle" x={category.x} y={category.y + 16}>
                    {category.topics.length} 个知识点
                  </text>
                  <text className="category-subtitle" x={category.x} y={category.y + 34}>
                    {categoryProblems(category)} 题入口
                  </text>
                </g>
              )
            })}

            <rect className="expand-zone" height="260" rx="18" width="520" x={Math.max(40, Math.min(660, expanded.x - 250))} y={expanded.y + 92} />
            <text className="expand-title" x={Math.max(70, Math.min(690, expanded.x - 220))} y={expanded.y + 125}>
              {expanded.title} 展开
            </text>

            {graphMode === 'topics' &&
              topicPositions.map(({ topic, x, y }) => {
                const onRoute = topic.routeWeight[route] === 'core'
                return (
                  <line
                    className={onRoute ? 'topic-edge route-link' : 'topic-edge graph-link'}
                    key={`${expanded.id}-${topic.id}`}
                    markerEnd={onRoute ? 'url(#arrow-route)' : 'url(#arrow)'}
                    x1={expanded.x}
                    x2={x}
                    y1={expanded.y + 58}
                    y2={y + 35}
                  />
                )
              })}

            {topicEdges.map((edge) => {
              const from = topicPositionByTitle.get(edge.from)
              const to = topicPositionByTitle.get(edge.to)
              if (!from || !to) return null
              const onRoute = from.topic.routeWeight[route] === 'core' && to.topic.routeWeight[route] === 'core'
              return (
                <line
                  className={onRoute ? 'topic-edge route-link' : 'topic-edge graph-link'}
                  key={`${edge.from}-${edge.to}`}
                  markerEnd={onRoute ? 'url(#arrow-route)' : 'url(#arrow)'}
                  x1={from.x + 230}
                  x2={to.x}
                  y1={from.y + 35}
                  y2={to.y + 35}
                />
              )
            })}

            {topicPositions.map(({ topic, x, y }) => {
              const status = topicStatus[topic.id] ?? topic.status
              const selected = selectedTopic.id === topic.id
              const routeCore = topic.routeWeight[route] === 'core'
              return (
                <g
                  className={`topic-node ${status} ${selected ? 'selected' : ''} ${routeCore ? 'route-core' : ''}`}
                  data-testid={`topic-${topic.id}`}
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  onMouseDown={() => setSelectedTopicId(topic.id)}
                  role="button"
                  tabIndex={0}
                >
                  <rect height="70" rx="14" width="230" x={x} y={y} />
                  <text className="topic-title" x={x + 16} y={y + 27}>
                    {topic.title}
                  </text>
                  <text className="topic-meta" x={x + 16} y={y + 50}>
                    {route === 'gesp' ? topic.minGesp : route === 'noi' ? topic.noiBand : topic.cfBand}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <aside className="detail-panel">
          <div className="detail-top">
            <p>
              {selectedTopic.categoryTitle} / {selectedTopic.stage}
            </p>
            <h2>{selectedTopic.title}</h2>
          </div>

          <div className="threshold-grid">
            <div>
              <span>GESP 下限</span>
              <strong>{selectedTopic.minGesp}</strong>
            </div>
            <div>
              <span>信奥阶段</span>
              <strong>{selectedTopic.noiBand}</strong>
            </div>
            <div>
              <span>CF 建议</span>
              <strong>{selectedTopic.cfBand}</strong>
            </div>
            <div>
              <span>当前路线</span>
              <strong>{weightLabels[selectedTopic.routeWeight[route]]}</strong>
            </div>
          </div>

          <label className="field-label" htmlFor="status">
            当前状态
          </label>
          <select
            id="status"
            value={topicStatus[selectedTopic.id] ?? selectedTopic.status}
            onChange={(event) => changeStatus(selectedTopic.id, event.target.value as Status)}
          >
            {(Object.keys(statusLabels) as Status[]).map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>

          <section className="detail-section">
            <h3>{routeLabels[route]}通关标准</h3>
            <ul>
              {selectedTopic.standards[route].map((standard) => (
                <li key={standard}>{standard}</li>
              ))}
            </ul>
          </section>

          <section className="detail-section">
            <h3>前置知识</h3>
            <div className="prereq-list">
              {selectedTopic.prerequisites.length === 0 && <span>无硬性前置，适合作为起点。</span>}
              {selectedTopic.prerequisites.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          <section className="visual-box">
            <h3>可视化入口</h3>
            <p>{selectedTopic.visual}</p>
            <button type="button">后续生成交互演示</button>
          </section>

          <details className="problem-drawer" open>
            <summary>推荐题目（{selectedTopic.problems.length}）</summary>
            <div className="problem-list">
              {selectedTopic.problems.map((problem) => (
                <a href={problem.url} key={`${problem.source}-${problem.title}`} target="_blank">
                  <span>{problem.source}</span>
                  <strong>{problem.title}</strong>
                  <small>{problem.level}</small>
                </a>
              ))}
            </div>
          </details>

          <details className="problem-drawer">
            <summary>错题记录</summary>
            <p className="muted">错题数量建议登录或导入账号数据后显示。CF 可以接官方 API；洛谷先做手动导入/登录态辅助更稳。</p>
          </details>
        </aside>
      </section>
    </main>
  )
}

export default App
