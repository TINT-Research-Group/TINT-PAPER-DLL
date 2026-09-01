# [TINT Paper Conference Deadlines](https://tint-research-group.github.io/TINT-PAPER-DDL/)

本仓库维护 TINT Research Group 关注的学术会议时间，并提供倒计时和标签筛选功能。页面支持在以下三类时间之间切换：

- **Abstract**：摘要、标题或论文注册截止时间
- **Full Paper**：完整论文提交截止时间
- **First-round Decision**：首轮评审结果或第一阶段决定公布时间

切换时间类型后，页面会同步更新时间、倒计时和会议排序，并在浏览器中保留当前选择。

本项目参考了 [sec-deadlines/sec-deadlines.github.io](https://github.com/sec-deadlines/sec-deadlines.github.io)。

## 添加或更新会议

会议数据位于 [`_data/conferences.yml`](./_data/conferences.yml)。更新时请遵循以下流程：

1. 搜索会议简称和年份，确认是否已有同一届会议。
2. 同一届会议应更新已有条目；新一届会议应新增条目，不要覆盖历史条目。
3. 从会议官方网站、官方 Call for Papers 或官方 Important Dates 页面核对时间。聚合网站和往届日期只能作为线索，不能代替官方来源。
4. 分别确认 Abstract、Full Paper 和 First-round Decision 的含义、日期、时间与时区。不要把 rebuttal、camera-ready 或最终录用日期误记为首轮结果。
5. 更新 `link`、日期字段和必要的 `comment`，并保持无关会议及原有排序不变。
6. 提交前按照下方的[数据检查清单](#数据检查清单)复核；有仓库写入权限时可直接提交，否则请发起 Pull Request。

如果官方尚未公布某项日期，请使用 `TBA`，不要根据往年日程推算。官方明确不存在某项时间时使用 `N/A`。

## 会议数据格式

下面是一个包含两个投稿轮次的示例：

```yaml
- name: ExampleConf
  description: Example Conference on Computer Science
  year: 2027
  date: August 11-13
  link: https://example.org/exampleconf2027/
  dblp: https://dblp.org/db/conf/exampleconf/index.html
  deadline:
    - "2026-08-18 23:59"
    - "2027-01-19 23:59"
  abstract_deadline:
    - "2026-08-18 23:59"
    - "2027-01-19 23:59"
  full_paper_deadline:
    - "2026-08-25 23:59"
    - "2027-01-26 23:59"
  first_round_decision:
    - "2026-10-06 23:59"
    - "2027-03-09 23:59"
  timezone: Etc/GMT+12
  comment: "Dates verified against the official Call for Papers; all deadlines are AoE."
  place: Denver, CO, USA
  tags: [SP, CA, ASTAR, TOP]
```

### 日期字段

| 字段 | 含义 |
|---|---|
| `deadline`* | 兼容字段，同时决定页面为该会议生成多少个投稿轮次。存在独立摘要截止时间时通常与 `abstract_deadline` 相同；不存在时使用完整论文截止时间。 |
| `abstract_deadline`* | 强制摘要、标题或论文注册截止时间。若官方没有独立的注册阶段，填写 `N/A`。 |
| `full_paper_deadline`* | 完整论文提交截止时间。 |
| `first_round_decision`* | 官方公布的首轮评审结果、快速拒稿结果或第一阶段决定时间；若只有单阶段通知，则填写官方首次决定通知时间。 |
| `timezone` | [IANA 时区名称](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)。省略时页面默认使用 `Etc/GMT+12`，即 AoE（UTC−12）。 |

日期必须放在 YAML 列表中，并使用带引号的 `YYYY-MM-DD HH:mm` 格式，例如：

```yaml
full_paper_deadline: ["2027-01-26 23:59"]
```

对于已公布日程，`deadline`、`abstract_deadline`、`full_paper_deadline` 和 `first_round_decision` 的列表长度必须一致；同一索引表示同一个投稿轮次。即使只有一轮，也必须使用列表。

若整届会议的投稿日程尚未公布，使用以下形式显示一个待定条目：

```yaml
deadline: []
abstract_deadline: ["TBA"]
full_paper_deadline: ["TBA"]
first_round_decision: ["TBA"]
```

`TBA` 表示官方尚未公布，`N/A` 表示官方流程中不存在该阶段。两者都必须写成字符串，并与其他日期保持相同的轮次顺序。

### 其他字段

| 字段 | 含义 |
|---|---|
| `name`* | 不含年份的会议简称。若整届日程待定，可按现有约定在名称后标注 `(TBA)`。 |
| `year`* | 会议举办年份。 |
| `description` | 会议全称或简要说明。 |
| `date` | 会议举办日期。 |
| `link`* | 当前届会议官网、官方 CFP 或 Important Dates 页面。 |
| `dblp` | 会议的 [DBLP](https://dblp.org/) 索引页面。 |
| `comment` | 解释日期口径、投稿轮次、特殊流程或尚未公布的信息。 |
| `place` | 会议举办地点；线上或未公布时按官方信息填写。 |
| `tags` | 用于页面筛选的研究方向、评级和偏好标签。 |

带星号（`*`）的字段为页面正常展示所需字段。

可用标签定义在 [`_data/types.yml`](./_data/types.yml)：

- 研究方向：`NS`、`SP`、`TAI`、`MISC`
- CCF 评级：`CA`、`CB`、`CC`
- ICORE 评级：`ASTAR`、`A`、`B`、`C`
- 偏好：`TRAVEL`、`TOP`

## 数据检查清单

提交会议数据前，请至少完成以下检查：

- 官网链接对应正确的会议届次和年份，并优先指向官方 CFP 或 Important Dates。
- Abstract 是强制注册时间，而不是可选摘要；Full Paper 是完整论文提交时间。
- First-round Decision 对应首轮或第一阶段结果，不是 rebuttal、camera-ready 或最终定稿时间。
- 日期、年份、轮次顺序和时区与官网一致；AoE、UTC 与会场当地时间不得混用。
- 所有日期数组按同一轮次对齐且长度一致；未公布和不存在分别使用 `TBA` 与 `N/A`。
- 多轮投稿没有遗漏，`comment` 对特殊流程作了简短说明。
- YAML 缩进正确，日期带引号，且没有改动无关会议、标签或样式文件。

页面地址：[https://tint-research-group.github.io/TINT-PAPER-DDL/](https://tint-research-group.github.io/TINT-PAPER-DDL/)
