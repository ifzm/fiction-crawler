# 一个简单的小说爬虫

目前仅采集了排行榜里面的小说

说明：仅供学习使用，如有侵权通知我立刻删除  

原来写的版本太烂, 也丢了很久了, 这次用 TypeScript + typeorm + mongodb 尝试一波，借机学习 ts  

预计分为四个子模块：

1. 新书入库 ( 包含初始化 )
2. 书籍更新 ( 定时任务，可选方案 Bull、Kue、Agenda )
3. 资源静态化
4. 前端展示 ( Nest + Vue )

TODO

- [x] 静态化
- [ ] 定时更新
- [ ] 前端展示
- [ ] 引入代理 IP 池
