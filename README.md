# 一个简单的小说爬虫

目前仅采集了排行榜里面的小说 ( 数据源：[uc书盟](http://www.uctxt.com) )

说明：仅供学习使用, 欢迎PR，如有侵权通知我删除  


## Usage

```shell
# install via yarn

yarn install
yarn run start
# or
yarn run test
```


<br/>
原来写的版本太烂, 也丢了很久了, 这次用 TypeScript + typeorm + mongodb 尝试一波，借机学习 ts 😊

预计分为四个子模块：

- [x] 新书入库 ( 包含初始化 )
- [x] 资源静态化
- [ ] 书籍更新 ( 定时任务，可选方案 [Bull](https://github.com/OptimalBits/bull)、[Kue](https://github.com/Automattic/kue)、[Agenda](https://github.com/agenda/agenda) )
- [ ] 网页阅读 ( [Nest](https://github.com/nestjs/nest)、 [Vue](https://github.com/vuejs/vue) + [Vuetify](https://github.com/vuetifyjs/vuetify) )

<br/>
TODO

- [ ] 写好 README
- [ ] 性能优化
- [ ] 代理 IP 池
