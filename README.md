# 一个简单的小说爬虫

目前仅采集了排行榜里面的小说 ( 数据源：[uc书盟](http://www.uctxt.com) )

说明：仅供学习使用，如有侵权通知我立刻删除  

<br/>
原来写的版本太烂, 也丢了很久了, 这次用 TypeScript + typeorm + mongodb 尝试一波，借机学习 ts
<br/>
预计分为四个子模块：

- [x] 新书入库 ( 包含初始化 )
- [x] 资源静态化
- [ ] 书籍更新 ( 定时任务，可选方案 Bull、Kue、Agenda )
- [ ] 前端展示 ( Nest + Vue )

<br/>
TODO

- [ ] 代理 IP 池
