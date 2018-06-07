/*
 * Created Date: Thursday, June 7th 2018, 8:46:08 pm
 * Author: jim
 * 
 * Copyright (c) 2018 Your Company
 */

import { Entity, ObjectIdColumn, ObjectID, Column, Index, UpdateDateColumn } from "typeorm"

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

    // 更新时间
    @Column()
    updateTime: Date

}

@Entity()
export class Chapter extends Content {

}

@Entity()
export class Book extends Content {

    // 分类
    @Column()
    type: Number

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

    // 最新章节
    @Column()
    latestChapters: Chapter

    // 所有章节
    @Column()
    chapters: Chapter[]

}
