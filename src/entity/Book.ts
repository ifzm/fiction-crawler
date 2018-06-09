/*
 * Created Date: Thursday, June 7th 2018, 8:46:08 pm
 * Author: jim
 * 
 * Copyright (c) 2018 Your Company
 */

import { Entity, ObjectIdColumn, ObjectID, Column, Index } from "typeorm"

export abstract class Content {

    @ObjectIdColumn()
    id: ObjectID

    // 链接
    @Column()
    @Index({ unique: true })
    uri: String

    // 名称
    @Column()
    name: String

}

@Entity()
export class Chapter extends Content {

    constructor(uri: String, name: String) {
        super()
        this.uri = uri
        this.name = name
    }

}

@Entity()
export class Book extends Content {

    // 分类[玄幻小说、仙侠小说、都市小说、历史小说、网游小说、科幻小说、言情小说、全本小说、排行榜]
    @Column()
    type: String

    // 作者
    @Column()
    author: String

    // 字数
    @Column()
    words: Number

    // 简介
    @Column()
    intro: String

    // 状态[连载、完结]
    @Column()
    status: String

    // 封面图
    @Column()
    coverPicture: String

    // 最新章节
    @Column()
    latestChapter: Chapter

    // 所有章节
    @Column()
    chapters: Chapter[]

    // 更新时间
    @Column()
    updateTime: Date

    // 入库时间
    @Column()
    createTime: Date

}

@Entity()
export class Link extends Content {

    constructor(uri: String, name: String) {
        super()
        this.uri = uri
        this.name = name
    }

}
