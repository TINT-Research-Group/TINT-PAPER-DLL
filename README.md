> 网站建设中...请耐心等待🙏
# [TINT-PAPER-Deadline](https://tint-research-group.github.io/TINT-PAPER-DLL/)
This repository lists deadline countdowns for targeted conferences.
> referencing [sec-deadlines/sec-deadlines.github.io](https://github.com/sec-deadlines/sec-deadlines.github.io)

## 添加/更新会议（How to add or update a conference）

> We all share responsibility for keeping information up to date

![Update](./static/img/update.jpg)

1. 打开并编辑 `_data/conferences.yml`
2. 先检查是否已有往年条目；如果有，优先更新原条目
3. 按仓库的数据格式填写/更新会议信息（如名称、年份、链接、deadline、地点、标签等）
4. 提交修改

> More detail can be found from [URL](https://tint-research-group.github.io/TINT-PAPER-DLL/)

### Conference entry record

Example record:

```yaml
- name: Euro S&P
  description: IEEE European Symposium on Security and Privacy
  year: 2018
  link: http://www.ieee-security.org/TC/EuroSP2018/
  dblp: https://dblp.org/db/conf/eurosp/index.html
  deadline: ["2017-08-15 23:59"]  # must be a list
  date: April 24-26
  place: London, UK
  tags: [SEC, TRAVEL]
```

Descriptions of the fields:

| Field name    | Description                                                                             |
|---------------|-----------------------------------------------------------------------------------------|
| `name`\*      | Short conference name, without year                                                     |
| `year`\*      | Year the conference is happening                                                        |
| `description` | Description, or long name                                                               |
| `comment`     | Additional comments, e.g., co-located conference, rolling deadline                      |
| `link`\*      | URL to the conference home page                                                         |
| `dblp`        | URL to the [DBLP](https://dblp.org) page of the conference                              |
| `deadline`\*  | A list of deadlines. [(Gory details below)][4]                                          |
| `timezone`    | [Timezone][5] in [tz][1] format. By default is UTC-12 ([AoE][2])                        |
| `date`        | When the conference is happening                                                        |
| `place`       | Where the conference is happening                                                       |
| `tags`        | One or multiple [tags][3]: `SEC`, `TAI`, or `NET` (Area); `A` or `CB` (Rank); `TRAVEL` or `TOP`(Preference) |

Fields marked with asterisk (\*) are required.
