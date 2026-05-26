import { useMemo, useState } from 'react'
import './App.css'

type RouteKey = 'gesp' | 'noi' | 'cf'
type Status = 'not-started' | 'learning' | 'practicing' | 'review' | 'passed'

type Topic = {
  id: string
  title: string
  category: string
  status: Status
  wrongCount: number
  standards: Record<RouteKey, string[]>
  problems: {
    title: string
    source: '洛谷' | 'Codeforces' | 'AtCoder' | '自建'
    level: string
    url: string
  }[]
}

type Band = {
  id: string
  gesp: string
  noi: string
  cf: string
  summary: string
  topics: Topic[]
}

const routeLabels: Record<RouteKey, string> = {
  gesp: 'GESP 路线',
  noi: '国内信奥路线',
  cf: 'Codeforces 路线',
}

const statusLabels: Record<Status, string> = {
  'not-started': '未开始',
  learning: '学习中',
  practicing: '练习中',
  review: '待复盘',
  passed: '已通关',
}

const bands: Band[] = [
  {
    id: 'start',
    gesp: 'GESP 1-2',
    noi: '入门 / 普及-',
    cf: 'CF 新手-800',
    summary: '语法、输入输出、分支循环、数组字符串和基础模拟。',
    topics: [
      {
        id: 'syntax-flow',
        title: '语法与流程控制',
        category: '语言基础',
        status: 'passed',
        wrongCount: 1,
        standards: {
          gesp: ['能独立写顺序、分支、循环程序', '会处理常见输入输出格式', '能解释变量、表达式和类型转换'],
          noi: ['能完成普及组 T1 难度模拟题', '能根据题意拆成若干条件和循环', '代码格式稳定，少低级语法错'],
          cf: ['能在 20 分钟内 AC 800 分模拟题', '能快速读懂英文题面关键词', '能写出边界样例自测'],
        },
        problems: [
          { title: '洛谷入门题单', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/training/list' },
          { title: 'CF 800 Problemset', source: 'Codeforces', level: '800', url: 'https://codeforces.com/problemset?tags=800-800' },
        ],
      },
      {
        id: 'array-string',
        title: '数组与字符串',
        category: '基础结构',
        status: 'practicing',
        wrongCount: 3,
        standards: {
          gesp: ['会一维数组、二维数组、字符数组和 string', '能完成计数、查找、统计类题目', '知道越界和初始化风险'],
          noi: ['能处理普及组常见统计、矩阵、字符串模拟', '能用数组保存状态并解释含义', '能写出 O(n) 或 O(nm) 解法'],
          cf: ['能解决 800-1000 的字符串构造和计数', '能用 map/set 简化统计', '能发现重复扫描导致的复杂度问题'],
        },
        problems: [
          { title: 'P1307 数字反转', source: '洛谷', level: '入门', url: 'https://www.luogu.com.cn/problem/P1307' },
          { title: 'CF implementation', source: 'Codeforces', level: '800-1000', url: 'https://codeforces.com/problemset?tags=implementation' },
        ],
      },
    ],
  },
  {
    id: 'basic',
    gesp: 'GESP 3-4',
    noi: '普及 / CSP-J',
    cf: 'CF 800-1100',
    summary: '枚举、排序、前缀和、二分、递归搜索和简单数据结构。',
    topics: [
      {
        id: 'prefix-binary',
        title: '前缀和与二分',
        category: '基础技巧',
        status: 'learning',
        wrongCount: 2,
        standards: {
          gesp: ['会用前缀和做区间查询', '理解有序性和二分边界', '能描述算法复杂度'],
          noi: ['能完成 CSP-J T2/T3 常见区间统计', '能写 lower_bound 风格二分', '会用对拍检查边界'],
          cf: ['能解决 1000-1200 的答案二分', '能证明二分单调性', '能处理 long long 和闭开区间'],
        },
        problems: [
          { title: 'P2678 跳石头', source: '洛谷', level: '普及+/提高', url: 'https://www.luogu.com.cn/problem/P2678' },
          { title: 'CF binary search', source: 'Codeforces', level: '1000-1400', url: 'https://codeforces.com/problemset?tags=binary%20search' },
        ],
      },
      {
        id: 'dfs-bfs',
        title: 'DFS/BFS 与基础搜索',
        category: '搜索',
        status: 'practicing',
        wrongCount: 4,
        standards: {
          gesp: ['会写递归 DFS 和队列 BFS', '能处理迷宫、连通块和枚举路径', '会基础剪枝：越界、访问、不可行'],
          noi: ['CSP-J 路线掌握小剪枝即可满分应对多数题', '能解释搜索树和状态定义', '能处理回溯恢复现场'],
          cf: ['要求更高：能抽象状态图', '能用 BFS 求最短步数或层数', '能识别剪枝不足导致爆搜'],
        },
        problems: [
          { title: 'P1605 迷宫', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1605' },
          { title: 'CF dfs and similar', source: 'Codeforces', level: '900-1300', url: 'https://codeforces.com/problemset?tags=dfs%20and%20similar' },
        ],
      },
    ],
  },
  {
    id: 'csp-s',
    gesp: 'GESP 5-8',
    noi: '提高- / CSP-S',
    cf: 'CF 1200-1600',
    summary: '图论、树、动态规划、贪心证明和常用数据结构。',
    topics: [
      {
        id: 'linear-knapsack-dp',
        title: '线性 DP 与背包',
        category: '动态规划',
        status: 'learning',
        wrongCount: 5,
        standards: {
          gesp: ['理解状态、转移和初始化', '能写 01 背包、完全背包和简单线性 DP', '能用表格讲清转移来源'],
          noi: ['能覆盖 CSP-S T1/T2 常见 DP', '能从约束反推状态维度', '能解释滚动数组优化'],
          cf: ['能解决 1400-1600 的计数/最优 DP', '能处理状态压缩或贡献式转移雏形', '能识别贪心不可行时转 DP'],
        },
        problems: [
          { title: 'P1048 采药', source: '洛谷', level: '普及-', url: 'https://www.luogu.com.cn/problem/P1048' },
          { title: 'CF dp 1200-1600', source: 'Codeforces', level: '1200-1600', url: 'https://codeforces.com/problemset?tags=dp' },
        ],
      },
      {
        id: 'graph-shortest',
        title: '图论基础与最短路',
        category: '图论',
        status: 'not-started',
        wrongCount: 0,
        standards: {
          gesp: ['会建图、遍历、连通性判断', '知道 Dijkstra 的适用条件', '能处理稀疏图邻接表'],
          noi: ['能完成 CSP-S 常见图建模', '会 Dijkstra、Floyd、拓扑排序、最小生成树', '能写出复杂度分析'],
          cf: ['能把题意转成图状态', '能处理多源 BFS、0-1 BFS 或分层图基础', '能构造反例检查建边'],
        },
        problems: [
          { title: 'P3371 单源最短路径', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3371' },
          { title: 'CF shortest paths', source: 'Codeforces', level: '1300-1700', url: 'https://codeforces.com/problemset?tags=shortest%20paths' },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    gesp: 'GESP 8+ 延展',
    noi: '提高+ / 省选入门',
    cf: 'CF 1600-2000',
    summary: '复杂建模、树形 DP、线段树、离线技巧、构造与证明。',
    topics: [
      {
        id: 'segment-tree',
        title: '线段树与区间维护',
        category: '数据结构',
        status: 'not-started',
        wrongCount: 0,
        standards: {
          gesp: ['作为延展内容：理解区间维护思想', '能看懂单点修改、区间查询模板', '知道何时不必使用重型数据结构'],
          noi: ['能写单点/区间修改查询', '能解释懒标记含义', '能用线段树解决提高组区间题'],
          cf: ['能灵活维护最大值、计数、组合信息', '能完成 1700-1900 的区间数据结构题', '能处理离散化和在线更新'],
        },
        problems: [
          { title: 'P3372 线段树 1', source: '洛谷', level: '模板', url: 'https://www.luogu.com.cn/problem/P3372' },
          { title: 'CF data structures', source: 'Codeforces', level: '1600-2000', url: 'https://codeforces.com/problemset?tags=data%20structures' },
        ],
      },
      {
        id: 'constructive-proof',
        title: '构造与贪心证明',
        category: '思维',
        status: 'review',
        wrongCount: 6,
        standards: {
          gesp: ['作为延展内容：能解释局部选择为什么成立', '能找小样例验证策略', '能区分模拟和构造'],
          noi: ['能写交换论证或反证思路', '能在 CSP-S 中拿到构造/贪心部分分', '会整理常见错误策略'],
          cf: ['能完成 1600-2000 构造题', '能给出必要性和充分性证明', '能主动造反例推翻错误贪心'],
        },
        problems: [
          { title: 'CF constructive algorithms', source: 'Codeforces', level: '1600-2000', url: 'https://codeforces.com/problemset?tags=constructive%20algorithms' },
          { title: 'AtCoder greedy', source: 'AtCoder', level: 'ABC/ARC', url: 'https://atcoder.jp/' },
        ],
      },
    ],
  },
]

const routeCopy: Record<RouteKey, string> = {
  gesp: '按 1-8 级逐级过关，适合给学生和家长解释学习台阶。',
  noi: '按普及、CSP-J、CSP-S、提高+ 组织，适合备课和比赛训练。',
  cf: '按 Codeforces 分数段组织，强调英文题面、建模、证明和速度。',
}

function App() {
  const [route, setRoute] = useState<RouteKey>('gesp')
  const [selectedId, setSelectedId] = useState('dfs-bfs')
  const [topicStatus, setTopicStatus] = useState<Record<string, Status>>(() => {
    const saved = localStorage.getItem('tongguan-topic-status')
    return saved ? JSON.parse(saved) : {}
  })

  const selectedTopic = useMemo(
    () => bands.flatMap((band) => band.topics).find((topic) => topic.id === selectedId) ?? bands[0].topics[0],
    [selectedId],
  )

  const progress = useMemo(() => {
    const topics = bands.flatMap((band) => band.topics)
    const passed = topics.filter((topic) => (topicStatus[topic.id] ?? topic.status) === 'passed').length
    return { passed, total: topics.length, percent: Math.round((passed / topics.length) * 100) }
  }, [topicStatus])

  const changeStatus = (topicId: string, status: Status) => {
    setTopicStatus((current) => {
      const next = { ...current, [topicId]: status }
      localStorage.setItem('tongguan-topic-status', JSON.stringify(next))
      return next
    })
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Tongguan Algorithm Map</p>
          <h1>知识地图首页</h1>
        </div>
        <div className="progress-box" aria-label="通关进度">
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
            <small>{routeCopy[key]}</small>
          </button>
        ))}
      </section>

      <section className="layout">
        <div className="map-panel">
          <div className="panel-heading">
            <div>
              <h2>三路线对齐图</h2>
              <p>同一行表示大致训练水平相近，非官方等价。</p>
            </div>
            <a href="https://codeforces.com/problemset" target="_blank">
              CF 题库
            </a>
          </div>

          <div className="level-grid">
            <div className="grid-head">GESP</div>
            <div className="grid-head">国内信奥</div>
            <div className="grid-head">CF 分数</div>
            {bands.map((band) => (
              <div className="level-row" key={band.id}>
                <div className={route === 'gesp' ? 'level-cell focused' : 'level-cell'}>{band.gesp}</div>
                <div className={route === 'noi' ? 'level-cell focused' : 'level-cell'}>{band.noi}</div>
                <div className={route === 'cf' ? 'level-cell focused' : 'level-cell'}>{band.cf}</div>
              </div>
            ))}
          </div>

          <div className="path-map">
            {bands.map((band, bandIndex) => (
              <section className="band" key={band.id}>
                <div className="band-marker">
                  <span>{bandIndex + 1}</span>
                </div>
                <div className="band-body">
                  <div className="band-title">
                    <h3>{route === 'gesp' ? band.gesp : route === 'noi' ? band.noi : band.cf}</h3>
                    <p>{band.summary}</p>
                  </div>
                  <div className="topic-net">
                    {band.topics.map((topic) => {
                      const status = topicStatus[topic.id] ?? topic.status
                      return (
                        <button
                          className={selectedTopic.id === topic.id ? `topic-node ${status} selected` : `topic-node ${status}`}
                          key={topic.id}
                          onClick={() => setSelectedId(topic.id)}
                          type="button"
                        >
                          <span>{topic.category}</span>
                          {topic.title}
                          <small>{statusLabels[status]}</small>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="detail-panel">
          <div className="detail-top">
            <p>{selectedTopic.category}</p>
            <h2>{selectedTopic.title}</h2>
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
            <h3>推荐题目</h3>
            <div className="problem-list">
              {selectedTopic.problems.map((problem) => (
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
              <span>{selectedTopic.wrongCount}</span>
              <small>错题数量</small>
            </div>
            <div>
              <span>{selectedTopic.problems.length}</span>
              <small>推荐入口</small>
            </div>
          </section>

          <section className="account-box">
            <h3>账号数据接入</h3>
            <p>CF 可优先接官方 API；洛谷通常需要登录态或手动导入记录，第一版先预留入口。</p>
            <div className="account-actions">
              <a href="https://codeforces.com/apiHelp" target="_blank">
                CF API
              </a>
              <a href="https://www.luogu.com.cn/" target="_blank">
                洛谷
              </a>
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App
