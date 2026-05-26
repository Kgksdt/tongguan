import { useMemo, useState } from 'react'
import './App.css'

type RouteKey = 'gesp' | 'noi' | 'cf'
type Status = 'not-started' | 'learning' | 'practicing' | 'review' | 'passed'
type Emphasis = 'core' | 'normal' | 'stretch'

type KnowledgeNode = {
  id: string
  title: string
  category: string
  stage: string
  status: Status
  wrongCount: number
  minGesp: string
  noiBand: string
  cfBand: string
  emphasis: Record<RouteKey, Emphasis>
  prerequisites: string[]
  standards: Record<RouteKey, string[]>
  problems: {
    title: string
    source: '洛谷' | 'Codeforces' | 'AtCoder' | '自建'
    level: string
    url: string
  }[]
  visualizable?: string
}

type Stage = {
  id: string
  title: string
  subtitle: string
}

const routeLabels: Record<RouteKey, string> = {
  gesp: 'GESP',
  noi: '信奥',
  cf: 'CF',
}

const routeNotes: Record<RouteKey, string> = {
  gesp: '按等级下限看：某个知识点通常至少到哪个 GESP 阶段适合学习。',
  noi: '按国内训练线看：入门、普及、CSP-J、CSP-S、提高+ 的知识组织。',
  cf: '按分数段看：同一知识点在 CF 场景里更强调建模、证明和变式。',
}

const statusLabels: Record<Status, string> = {
  'not-started': '未开始',
  learning: '学习中',
  practicing: '练习中',
  review: '待复盘',
  passed: '已通关',
}

const emphasisLabels: Record<Emphasis, string> = {
  core: '核心',
  normal: '常规',
  stretch: '延展',
}

const stages: Stage[] = [
  { id: 'foundation', title: '语言与模拟', subtitle: 'GESP1-2 / 入门 / CF800-' },
  { id: 'basic-tech', title: '基础技巧', subtitle: 'GESP3-4 / 普及-CSP-J / CF800-1100' },
  { id: 'search-graph', title: '搜索与图', subtitle: 'GESP4-6 / CSP-J-CSP-S / CF1000-1500' },
  { id: 'dp-greedy', title: 'DP 与贪心', subtitle: 'GESP5-8 / CSP-S / CF1200-1700' },
  { id: 'data-structure', title: '数据结构', subtitle: 'GESP6-8+ / 提高 / CF1400-1900' },
  { id: 'advanced', title: '综合提高', subtitle: 'GESP8+ / 提高+ / CF1600-2000' },
]

const nodes: KnowledgeNode[] = [
  {
    id: 'io-types',
    title: '输入输出与数据类型',
    category: '语言基础',
    stage: 'foundation',
    status: 'passed',
    wrongCount: 0,
    minGesp: '1级+',
    noiBand: '入门',
    cfBand: '800-',
    emphasis: { gesp: 'core', noi: 'core', cf: 'core' },
    prerequisites: [],
    standards: {
      gesp: ['能独立处理整数、小数、字符、字符串输入输出', '知道 int、long long、double 的常见坑', '能写出符合题面格式的输出'],
      noi: ['能稳定完成普及组 T1 输入输出', '会根据数据范围选择类型', '会手写简单样例自测'],
      cf: ['能快速识别英文题面中的 input/output', '能处理多组数据', '知道溢出会导致 WA'],
    },
    problems: [
      { title: '洛谷入门题单', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/training/list' },
      { title: 'CF 800 Problemset', source: 'Codeforces', level: '800', url: 'https://codeforces.com/problemset?tags=800-800' },
    ],
  },
  {
    id: 'branch-loop',
    title: '分支、循环与模拟',
    category: '语言基础',
    stage: 'foundation',
    status: 'passed',
    wrongCount: 1,
    minGesp: '1级+',
    noiBand: '入门 / 普及-',
    cfBand: '800-900',
    emphasis: { gesp: 'core', noi: 'core', cf: 'core' },
    prerequisites: ['io-types'],
    standards: {
      gesp: ['能把题意拆成 if 和 for/while', '能完成日期、计数、简单过程模拟', '能解释循环变量的含义'],
      noi: ['能完成普及组基础模拟', '会处理边界和特殊情况', '代码不依赖拍脑袋样例'],
      cf: ['能在 20 分钟内 AC 800-900 模拟题', '能读懂操作序列题', '能发现隐藏边界'],
    },
    problems: [
      { title: 'P1001 A+B Problem', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/problem/P1001' },
      { title: 'CF implementation', source: 'Codeforces', level: '800-1000', url: 'https://codeforces.com/problemset?tags=implementation' },
    ],
    visualizable: '流程图单步执行',
  },
  {
    id: 'array-string',
    title: '数组与字符串',
    category: '基础结构',
    stage: 'foundation',
    status: 'practicing',
    wrongCount: 3,
    minGesp: '2级+',
    noiBand: '普及-',
    cfBand: '800-1000',
    emphasis: { gesp: 'core', noi: 'core', cf: 'core' },
    prerequisites: ['branch-loop'],
    standards: {
      gesp: ['会一维数组、二维数组和 string', '能完成统计、查找、矩阵模拟', '知道越界和初始化风险'],
      noi: ['能处理普及常见数组字符串题', '能用数组表达状态', '能写 O(n) 或 O(nm) 解法'],
      cf: ['能解决字符串构造和计数题', '会用 map/set 辅助统计', '能避免重复扫描超时'],
    },
    problems: [
      { title: 'P1307 数字反转', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/problem/P1307' },
      { title: 'CF strings', source: 'Codeforces', level: '800-1200', url: 'https://codeforces.com/problemset?tags=strings' },
    ],
    visualizable: '数组下标与字符串扫描',
  },
  {
    id: 'sort-enum',
    title: '枚举、排序与复杂度',
    category: '基础技巧',
    stage: 'basic-tech',
    status: 'learning',
    wrongCount: 2,
    minGesp: '3级+',
    noiBand: '普及',
    cfBand: '900-1100',
    emphasis: { gesp: 'core', noi: 'core', cf: 'core' },
    prerequisites: ['array-string'],
    standards: {
      gesp: ['会全枚举和简单优化枚举', '会 sort 和自定义比较', '能用 n 的范围判断复杂度'],
      noi: ['能完成普及组排序统计类题', '能解释 O(n)、O(n log n)、O(n^2)', '会用排序制造单调性'],
      cf: ['能把排序作为贪心或统计前置步骤', '能处理 pair/vector 排序', '能识别暴力是否可过'],
    },
    problems: [
      { title: 'P1177 排序', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P1177' },
      { title: 'CF sortings', source: 'Codeforces', level: '900-1300', url: 'https://codeforces.com/problemset?tags=sortings' },
    ],
  },
  {
    id: 'prefix-diff',
    title: '前缀和与差分',
    category: '基础技巧',
    stage: 'basic-tech',
    status: 'learning',
    wrongCount: 2,
    minGesp: '3级+',
    noiBand: '普及 / CSP-J',
    cfBand: '900-1200',
    emphasis: { gesp: 'core', noi: 'core', cf: 'core' },
    prerequisites: ['array-string'],
    standards: {
      gesp: ['会一维前缀和做区间查询', '理解差分的区间修改含义', '能画表解释还原过程'],
      noi: ['能处理 CSP-J 区间统计', '会二维前缀和基础', '能从多次询问看出预处理'],
      cf: ['能解决贡献统计和区间计数', '能结合排序或 map 使用', '能处理 long long 累加'],
    },
    problems: [
      { title: 'P8218 求区间和', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/problem/P8218' },
      { title: 'CF prefix sums', source: 'Codeforces', level: '900-1300', url: 'https://codeforces.com/problemset?tags=prefix%20sums' },
    ],
    visualizable: '区间求和热力条',
  },
  {
    id: 'two-pointer',
    title: '双指针与滑动窗口',
    category: '基础技巧',
    stage: 'basic-tech',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '4级+',
    noiBand: '普及+ / CSP-J',
    cfBand: '1000-1300',
    emphasis: { gesp: 'normal', noi: 'core', cf: 'core' },
    prerequisites: ['sort-enum', 'prefix-diff'],
    standards: {
      gesp: ['理解左右指针的移动规则', '能处理有序数组上的双指针', '能判断窗口是否合法'],
      noi: ['能用双指针优化 O(n^2)', '能解释每个指针最多移动 n 次', '会处理窗口边界'],
      cf: ['能解决 1200 左右窗口/尺取题', '能和排序、前缀结合', '能证明移动策略不漏解'],
    },
    problems: [
      { title: 'CF two pointers', source: 'Codeforces', level: '1000-1400', url: 'https://codeforces.com/problemset?tags=two%20pointers' },
      { title: '洛谷题单广场', source: '洛谷', level: '普及+', url: 'https://www.luogu.com.cn/training/list' },
    ],
    visualizable: '左右指针移动动画',
  },
  {
    id: 'binary-answer',
    title: '二分与答案二分',
    category: '基础技巧',
    stage: 'basic-tech',
    status: 'learning',
    wrongCount: 2,
    minGesp: '4级+',
    noiBand: 'CSP-J / 普及+',
    cfBand: '1000-1400',
    emphasis: { gesp: 'normal', noi: 'core', cf: 'core' },
    prerequisites: ['sort-enum'],
    standards: {
      gesp: ['会在有序数组中二分查找', '知道左右边界更新方式', '能避免死循环'],
      noi: ['能完成跳石头类答案二分', '能证明 check 单调性', '会处理最大化最小值/最小化最大值'],
      cf: ['能把题意转成可判定问题', '能写 lower_bound 风格代码', '能处理精度或 long long 边界'],
    },
    problems: [
      { title: 'P2678 跳石头', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P2678' },
      { title: 'CF binary search', source: 'Codeforces', level: '1000-1500', url: 'https://codeforces.com/problemset?tags=binary%20search' },
    ],
    visualizable: '答案区间收缩',
  },
  {
    id: 'recursion-backtrack',
    title: '递归、回溯与剪枝',
    category: '搜索',
    stage: 'search-graph',
    status: 'practicing',
    wrongCount: 4,
    minGesp: '4级+',
    noiBand: 'CSP-J / 普及+',
    cfBand: '1000-1300',
    emphasis: { gesp: 'core', noi: 'core', cf: 'normal' },
    prerequisites: ['branch-loop', 'array-string'],
    standards: {
      gesp: ['会写递归函数和回溯恢复现场', '能处理排列组合枚举', '会基础剪枝：越界、访问、不可行'],
      noi: ['CSP-J 路线掌握小剪枝即可应对多数题', '能解释搜索树和状态定义', '能估算搜索规模'],
      cf: ['要求能抽象状态和约束', '能主动剪掉等价/无效分支', '知道爆搜和 DP 的边界'],
    },
    problems: [
      { title: 'P1706 全排列问题', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1706' },
      { title: 'CF dfs and similar', source: 'Codeforces', level: '1000-1400', url: 'https://codeforces.com/problemset?tags=dfs%20and%20similar' },
    ],
    visualizable: '搜索树展开与回溯',
  },
  {
    id: 'bfs-grid',
    title: 'BFS、迷宫与最短步数',
    category: '搜索',
    stage: 'search-graph',
    status: 'practicing',
    wrongCount: 3,
    minGesp: '5级+',
    noiBand: 'CSP-J+ / CSP-S-',
    cfBand: '1100-1400',
    emphasis: { gesp: 'core', noi: 'core', cf: 'core' },
    prerequisites: ['recursion-backtrack'],
    standards: {
      gesp: ['会用队列写 BFS', '能处理迷宫、连通块、最短步数', '能解释按层扩展'],
      noi: ['能把网格或状态建成图', '会 visited 和距离数组', '能处理多源 BFS 基础'],
      cf: ['能解决状态图最短路', '能加入钥匙、方向、层数等状态', '能识别何时 BFS 优于 DFS'],
    },
    problems: [
      { title: 'P1443 马的遍历', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1443' },
      { title: 'CF shortest paths unweighted', source: 'Codeforces', level: '1100-1500', url: 'https://codeforces.com/problemset?tags=shortest%20paths' },
    ],
    visualizable: '迷宫波纹扩散',
  },
  {
    id: 'graph-basic',
    title: '建图、DFS/BFS 与连通性',
    category: '图论',
    stage: 'search-graph',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '5级+',
    noiBand: 'CSP-S-',
    cfBand: '1200-1500',
    emphasis: { gesp: 'normal', noi: 'core', cf: 'core' },
    prerequisites: ['bfs-grid'],
    standards: {
      gesp: ['理解点、边、邻接表', '能判断连通块', '能遍历树和一般图'],
      noi: ['能完成 CSP-S 常见建图', '能处理有向/无向、权值、连通性', '会避免重复访问'],
      cf: ['能从题意抽象隐式图', '能处理补图或条件建边思路', '能用图模型解释正确性'],
    },
    problems: [
      { title: 'P5318 查找文献', source: '洛谷', level: '普及/提高-', url: 'https://www.luogu.com.cn/problem/P5318' },
      { title: 'CF graphs', source: 'Codeforces', level: '1200-1600', url: 'https://codeforces.com/problemset?tags=graphs' },
    ],
    visualizable: '图遍历染色',
  },
  {
    id: 'shortest-mst-topo',
    title: '最短路、拓扑与最小生成树',
    category: '图论',
    stage: 'search-graph',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '6级+',
    noiBand: 'CSP-S',
    cfBand: '1300-1700',
    emphasis: { gesp: 'normal', noi: 'core', cf: 'core' },
    prerequisites: ['graph-basic', 'binary-answer'],
    standards: {
      gesp: ['知道 Dijkstra、拓扑排序、Kruskal 的用途', '能套基础模板', '知道适用条件'],
      noi: ['会 Dijkstra、Floyd、拓扑排序、MST', '能完成 CSP-S 图论基础题', '能写复杂度分析'],
      cf: ['能变形为多源 BFS、0-1 BFS 或分层图', '能选择正确图算法', '能构造反例检查建边'],
    },
    problems: [
      { title: 'P3371 单源最短路径', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3371' },
      { title: 'CF shortest paths', source: 'Codeforces', level: '1300-1800', url: 'https://codeforces.com/problemset?tags=shortest%20paths' },
    ],
    visualizable: 'Dijkstra 松弛过程',
  },
  {
    id: 'greedy-proof',
    title: '贪心策略与证明',
    category: '思维',
    stage: 'dp-greedy',
    status: 'review',
    wrongCount: 6,
    minGesp: '5级+',
    noiBand: 'CSP-S',
    cfBand: '1200-1700',
    emphasis: { gesp: 'normal', noi: 'core', cf: 'core' },
    prerequisites: ['sort-enum', 'binary-answer'],
    standards: {
      gesp: ['能说明局部选择的理由', '会找小样例验证策略', '能区分模拟和贪心'],
      noi: ['能写交换论证或反证', '能处理区间、排序、堆贪心', '会整理常见错误策略'],
      cf: ['必须能主动造反例', '能证明必要性和充分性', '能完成 1500+ 构造/贪心题'],
    },
    problems: [
      { title: 'CF greedy', source: 'Codeforces', level: '1200-1800', url: 'https://codeforces.com/problemset?tags=greedy' },
      { title: 'AtCoder greedy', source: 'AtCoder', level: 'ABC/ARC', url: 'https://atcoder.jp/' },
    ],
  },
  {
    id: 'linear-dp',
    title: '线性 DP',
    category: '动态规划',
    stage: 'dp-greedy',
    status: 'learning',
    wrongCount: 4,
    minGesp: '5级+',
    noiBand: 'CSP-S-',
    cfBand: '1200-1500',
    emphasis: { gesp: 'core', noi: 'core', cf: 'core' },
    prerequisites: ['prefix-diff', 'sort-enum'],
    standards: {
      gesp: ['理解状态、转移、初始化', '能写爬楼梯、LIS 基础、路径 DP', '能用表格讲清转移来源'],
      noi: ['能根据约束选择状态维度', '能处理一维/二维线性 DP', '会滚动数组基础'],
      cf: ['能解决 1400 左右最优/计数 DP', '能从贪心失败转向 DP', '能处理取模和初始化陷阱'],
    },
    problems: [
      { title: 'P1020 导弹拦截', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P1020' },
      { title: 'CF dp', source: 'Codeforces', level: '1200-1600', url: 'https://codeforces.com/problemset?tags=dp' },
    ],
    visualizable: 'DP 表格转移',
  },
  {
    id: 'knapsack',
    title: '背包 DP',
    category: '动态规划',
    stage: 'dp-greedy',
    status: 'learning',
    wrongCount: 5,
    minGesp: '6级+',
    noiBand: 'CSP-S',
    cfBand: '1300-1600',
    emphasis: { gesp: 'core', noi: 'core', cf: 'normal' },
    prerequisites: ['linear-dp'],
    standards: {
      gesp: ['会 01 背包和完全背包', '能解释倒序/正序循环原因', '能处理恰好装满和不超过容量'],
      noi: ['会多重背包基础和滚动数组', '能从限制判断价值/体积维度', '能讲出状态含义'],
      cf: ['能识别背包模型变形', '能处理布尔可达或计数背包', '能结合 bitset 思路作为延展'],
    },
    problems: [
      { title: 'P1048 采药', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1048' },
      { title: 'P1776 宝物筛选', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P1776' },
    ],
    visualizable: '容量轴滚动更新',
  },
  {
    id: 'interval-dp',
    title: '区间 DP',
    category: '动态规划',
    stage: 'dp-greedy',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '7级+',
    noiBand: 'CSP-S / 提高',
    cfBand: '1500-1800',
    emphasis: { gesp: 'stretch', noi: 'core', cf: 'normal' },
    prerequisites: ['linear-dp'],
    standards: {
      gesp: ['作为高阶内容：理解按长度枚举区间', '能解释断点 k 的含义', '能完成合并类模板题'],
      noi: ['能写石子合并、括号匹配类转移', '会处理环形区间基础', '能讲清枚举顺序'],
      cf: ['能处理区间博弈或字符串区间 DP', '能优化常数和边界', '能识别 O(n^3) 是否可过'],
    },
    problems: [
      { title: 'P1880 石子合并', source: '洛谷', level: '提高', url: 'https://www.luogu.com.cn/problem/P1880' },
      { title: 'CF dp intervals', source: 'Codeforces', level: '1500-1900', url: 'https://codeforces.com/problemset?tags=dp' },
    ],
    visualizable: '区间长度递推',
  },
  {
    id: 'mono-structure',
    title: '单调栈与单调队列',
    category: '数据结构',
    stage: 'data-structure',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '6级+',
    noiBand: '提高-',
    cfBand: '1400-1700',
    emphasis: { gesp: 'stretch', noi: 'core', cf: 'core' },
    prerequisites: ['two-pointer', 'linear-dp'],
    standards: {
      gesp: ['作为延展内容：理解维护单调性', '能看懂窗口最大值', '知道队首队尾含义'],
      noi: ['能解决滑动窗口和最近更大值', '能用单调队列优化 DP', '能证明元素进出一次'],
      cf: ['能处理贡献计算和边界', '能把单调结构和贪心/DP 结合', '能完成 1600 左右相关题'],
    },
    problems: [
      { title: 'P1886 滑动窗口', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P1886' },
      { title: 'CF data structures', source: 'Codeforces', level: '1400-1800', url: 'https://codeforces.com/problemset?tags=data%20structures' },
    ],
    visualizable: '队列入队出队动画',
  },
  {
    id: 'dsu-heap',
    title: '并查集与堆',
    category: '数据结构',
    stage: 'data-structure',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '6级+',
    noiBand: 'CSP-S / 提高-',
    cfBand: '1300-1700',
    emphasis: { gesp: 'normal', noi: 'core', cf: 'core' },
    prerequisites: ['graph-basic', 'greedy-proof'],
    standards: {
      gesp: ['能理解集合合并和优先队列', '能写基础 find/merge', '知道路径压缩'],
      noi: ['能用并查集做连通性和 Kruskal', '能用堆做动态最值', '能解释复杂度'],
      cf: ['能处理 DSU 技巧题雏形', '能用 priority_queue 支撑贪心', '能识别懒删除需求'],
    },
    problems: [
      { title: 'P3367 并查集', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3367' },
      { title: 'CF dsu', source: 'Codeforces', level: '1300-1800', url: 'https://codeforces.com/problemset?tags=dsu' },
    ],
    visualizable: '集合森林合并',
  },
  {
    id: 'bit-segtree',
    title: '树状数组与线段树',
    category: '数据结构',
    stage: 'data-structure',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '7级+',
    noiBand: '提高',
    cfBand: '1500-1900',
    emphasis: { gesp: 'stretch', noi: 'core', cf: 'core' },
    prerequisites: ['prefix-diff', 'binary-answer'],
    standards: {
      gesp: ['作为延展内容：理解区间维护', '能看懂单点修改和区间查询', '知道何时不必使用重型结构'],
      noi: ['能写 BIT 和线段树模板', '能解释 lowbit 与懒标记', '能解决提高组区间维护题'],
      cf: ['能维护最大值、计数、组合信息', '能结合离散化和在线更新', '能完成 1700-1900 数据结构题'],
    },
    problems: [
      { title: 'P3374 树状数组 1', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3374' },
      { title: 'P3372 线段树 1', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3372' },
    ],
    visualizable: '区间树节点覆盖',
  },
  {
    id: 'tree-lca',
    title: '树上问题与 LCA',
    category: '树',
    stage: 'data-structure',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '7级+',
    noiBand: '提高',
    cfBand: '1500-1900',
    emphasis: { gesp: 'stretch', noi: 'core', cf: 'normal' },
    prerequisites: ['graph-basic', 'bit-segtree'],
    standards: {
      gesp: ['作为延展内容：理解树的父子和深度', '能完成子树统计', '能看懂倍增思想'],
      noi: ['会树的直径、LCA、树上差分基础', '能写倍增 LCA', '能处理树上路径问题'],
      cf: ['能把树上信息合并', '能处理根变化或子树贡献', '能解决 1700 左右树题'],
    },
    problems: [
      { title: 'P3379 LCA', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3379' },
      { title: 'CF trees', source: 'Codeforces', level: '1500-1900', url: 'https://codeforces.com/problemset?tags=trees' },
    ],
    visualizable: '倍增跳祖先',
  },
  {
    id: 'math-counting',
    title: '数论与组合计数',
    category: '数学',
    stage: 'advanced',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '6级+',
    noiBand: 'CSP-S / 提高',
    cfBand: '1400-1800',
    emphasis: { gesp: 'normal', noi: 'core', cf: 'core' },
    prerequisites: ['sort-enum', 'linear-dp'],
    standards: {
      gesp: ['会 gcd、质数筛、快速幂', '理解取模和组合数基础', '能完成简单计数'],
      noi: ['会筛法、逆元、组合数递推', '能处理取模 DP', '能解释计数不重不漏'],
      cf: ['能完成贡献计数和组合推导', '能处理模数、逆元、预处理', '能把数学和构造结合'],
    },
    problems: [
      { title: 'P3383 线性筛', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3383' },
      { title: 'CF math', source: 'Codeforces', level: '1400-1900', url: 'https://codeforces.com/problemset?tags=math' },
    ],
  },
  {
    id: 'string-algo',
    title: '字符串算法基础',
    category: '字符串',
    stage: 'advanced',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '8级+',
    noiBand: '提高+',
    cfBand: '1600-2000',
    emphasis: { gesp: 'stretch', noi: 'normal', cf: 'core' },
    prerequisites: ['array-string', 'math-counting'],
    standards: {
      gesp: ['作为延展内容：理解模式匹配需求', '能看懂哈希和 KMP 思路', '能完成简单字符串匹配'],
      noi: ['会字符串哈希、KMP、Trie 基础', '能处理模式串和文本串', '知道哈希冲突风险'],
      cf: ['能用哈希做子串比较', '能解决 1700+ 字符串构造/匹配', '能和 DP 或二分结合'],
    },
    problems: [
      { title: 'P3375 KMP', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3375' },
      { title: 'CF strings 1600+', source: 'Codeforces', level: '1600-2000', url: 'https://codeforces.com/problemset?tags=strings' },
    ],
    visualizable: 'KMP next 指针',
  },
  {
    id: 'state-compress',
    title: '状态压缩与综合 DP',
    category: '动态规划',
    stage: 'advanced',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '8级+',
    noiBand: '提高+',
    cfBand: '1600-2000',
    emphasis: { gesp: 'stretch', noi: 'core', cf: 'core' },
    prerequisites: ['linear-dp', 'bit-segtree'],
    standards: {
      gesp: ['作为延展内容：理解二进制集合表示', '能看懂 mask 的增删查', '能完成小规模集合 DP'],
      noi: ['能写状压 DP、DAG DP、树形 DP 基础', '能从 n 小看出状压', '能解释状态合法性'],
      cf: ['能解决 1700-2000 综合 DP', '能把 bitmask 和图/计数结合', '能优化状态转移'],
    },
    problems: [
      { title: 'CF bitmasks', source: 'Codeforces', level: '1600-2000', url: 'https://codeforces.com/problemset?tags=bitmasks' },
      { title: '洛谷 DP 题单', source: '洛谷', level: '提高+', url: 'https://www.luogu.com.cn/training/list' },
    ],
    visualizable: 'mask 状态转移图',
  },
  {
    id: 'constructive',
    title: '构造、离线与综合建模',
    category: '综合',
    stage: 'advanced',
    status: 'not-started',
    wrongCount: 0,
    minGesp: '8级+',
    noiBand: '提高+ / 省选入门',
    cfBand: '1700-2000',
    emphasis: { gesp: 'stretch', noi: 'normal', cf: 'core' },
    prerequisites: ['greedy-proof', 'math-counting', 'state-compress'],
    standards: {
      gesp: ['作为冲刺内容：能看懂构造条件', '能主动找反例', '能复盘思维题失败原因'],
      noi: ['能把多个知识点组合建模', '能处理离线、排序、贡献、数据结构结合', '能写清证明'],
      cf: ['能完成 1800-2000 构造/综合题', '能快速判断必要充分条件', '能在赛后提炼套路和反套路'],
    },
    problems: [
      { title: 'CF constructive algorithms', source: 'Codeforces', level: '1700-2000', url: 'https://codeforces.com/problemset?tags=constructive%20algorithms' },
      { title: 'CF 2000 Problemset', source: 'Codeforces', level: '2000', url: 'https://codeforces.com/problemset?tags=2000-2000' },
    ],
  },
]

const stageById = new Map(stages.map((stage) => [stage.id, stage]))
const nodeById = new Map(nodes.map((node) => [node.id, node]))

function App() {
  const [route, setRoute] = useState<RouteKey>('gesp')
  const [selectedId, setSelectedId] = useState('recursion-backtrack')
  const [topicStatus, setTopicStatus] = useState<Record<string, Status>>(() => {
    const saved = localStorage.getItem('tongguan-topic-status')
    return saved ? JSON.parse(saved) : {}
  })

  const selectedNode = nodeById.get(selectedId) ?? nodes[0]

  const stageGroups = useMemo(
    () =>
      stages.map((stage) => ({
        ...stage,
        nodes: nodes.filter((node) => node.stage === stage.id),
      })),
    [],
  )

  const progress = useMemo(() => {
    const passed = nodes.filter((node) => (topicStatus[node.id] ?? node.status) === 'passed').length
    return { passed, total: nodes.length, percent: Math.round((passed / nodes.length) * 100) }
  }, [topicStatus])

  const highlightedPrerequisites = new Set(selectedNode.prerequisites)

  const changeStatus = (nodeId: string, status: Status) => {
    setTopicStatus((current) => {
      const next = { ...current, [nodeId]: status }
      localStorage.setItem('tongguan-topic-status', JSON.stringify(next))
      return next
    })
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Tongguan Algorithm Graph</p>
          <h1>算法知识技能树</h1>
          <p className="top-note">等级是学习门槛和训练参照，知识点才是核心节点。</p>
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
              <h2>知识连通图</h2>
              <p>从左到右是学习依赖链；点击每个节点查看当前路线的通关标准。</p>
            </div>
            <div className="legend">
              <span className="dot core"></span>核心
              <span className="dot normal"></span>常规
              <span className="dot stretch"></span>延展
            </div>
          </div>

          <div className="graph-board">
            {stageGroups.map((stage, stageIndex) => (
              <section className="stage-column" key={stage.id}>
                <div className="stage-head">
                  <strong>{stage.title}</strong>
                  <span>{stage.subtitle}</span>
                </div>
                <div className="node-stack">
                  {stage.nodes.map((node) => {
                    const status = topicStatus[node.id] ?? node.status
                    const emphasis = node.emphasis[route]
                    const selected = selectedNode.id === node.id
                    const related = highlightedPrerequisites.has(node.id)
                    return (
                      <button
                        className={`knowledge-node ${status} ${emphasis} ${selected ? 'selected' : ''} ${related ? 'related' : ''}`}
                        data-testid={`node-${node.id}`}
                        key={node.id}
                        onClick={() => setSelectedId(node.id)}
                        type="button"
                      >
                        <span className="node-category">{node.category}</span>
                        <strong>{node.title}</strong>
                        <span className="node-meta">
                          {route === 'gesp' ? node.minGesp : route === 'noi' ? node.noiBand : node.cfBand}
                        </span>
                        {stageIndex < stages.length - 1 && <span className="edge-out" aria-hidden="true"></span>}
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="detail-panel">
          <div className="detail-top">
            <p>
              {stageById.get(selectedNode.stage)?.title} / {selectedNode.category}
            </p>
            <h2>{selectedNode.title}</h2>
          </div>

          <div className="threshold-grid">
            <div>
              <span>GESP 下限</span>
              <strong>{selectedNode.minGesp}</strong>
            </div>
            <div>
              <span>信奥阶段</span>
              <strong>{selectedNode.noiBand}</strong>
            </div>
            <div>
              <span>CF 建议</span>
              <strong>{selectedNode.cfBand}</strong>
            </div>
          </div>

          <label className="field-label" htmlFor="status">
            当前状态
          </label>
          <select
            id="status"
            value={topicStatus[selectedNode.id] ?? selectedNode.status}
            onChange={(event) => changeStatus(selectedNode.id, event.target.value as Status)}
          >
            {(Object.keys(statusLabels) as Status[]).map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>

          <section className="detail-section">
            <h3>{routeLabels[route]} 路线通关标准</h3>
            <ul>
              {selectedNode.standards[route].map((standard) => (
                <li key={standard}>{standard}</li>
              ))}
            </ul>
          </section>

          <section className="detail-section">
            <h3>前置知识</h3>
            <div className="prereq-list">
              {selectedNode.prerequisites.length === 0 && <span>无硬性前置，适合作为起点。</span>}
              {selectedNode.prerequisites.map((id) => {
                const prerequisite = nodeById.get(id)
                if (!prerequisite) return null
                return (
                  <button key={id} onClick={() => setSelectedId(id)} type="button">
                    {prerequisite.title}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="detail-section">
            <h3>推荐题目入口</h3>
            <div className="problem-list">
              {selectedNode.problems.map((problem) => (
                <a href={problem.url} key={problem.title} target="_blank">
                  <span>{problem.source}</span>
                  <strong>{problem.title}</strong>
                  <small>{problem.level}</small>
                </a>
              ))}
            </div>
          </section>

          <section className="metrics">
            <div>
              <span>{selectedNode.wrongCount}</span>
              <small>错题数量</small>
            </div>
            <div>
              <span>{emphasisLabels[selectedNode.emphasis[route]]}</span>
              <small>当前路线权重</small>
            </div>
          </section>

          <section className="account-box">
            <h3>后续可视化与账号数据</h3>
            <p>
              {selectedNode.visualizable
                ? `这个知识点适合做「${selectedNode.visualizable}」。`
                : '这个知识点后续可挂讲解、题单、错题和复盘记录。'}
            </p>
            <p>CF 可接官方 API；洛谷更适合先做手动导入或浏览器登录态辅助。</p>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App
