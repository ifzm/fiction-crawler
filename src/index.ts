/*
 * Created Date: Monday, June 4th 2018, 11:23:15 pm
 * Author: jim
 * 
 * Copyright (c) 2018 Your Company
 */

global.Promise = require('bluebird')

import "reflect-metadata"
import ora = require('ora')
import path = require('path')
import fs = require('fs-extra')
import fetch from './util/fetch'
import * as utils from './util/utils'
import { createConnection, getMongoRepository } from "typeorm"
import { Book, Chapter, Directory, FailLink } from './entity/Book'

const HOST = 'http://www.uctxt.com'
const spinner = ora(` 收录『 UC书盟小说 - 排行榜 』共 0 本`).start()
createConnection().then(async connection => {
    try {
        const bookRepository = getMongoRepository(Book)
        const failRepository = getMongoRepository(FailLink)
        const directoryRepository = getMongoRepository(Directory)
        const links = await directoryRepository.find().then(vs => vs.map(v => v.uri))

        let pages = 1
        for (let i = 1; i <= pages; i++) {
            const $$: CheerioStatic = await fetch({ uri: `${HOST}/toplist/allvisit-${i}` })
            
            if (pages === 1) {
                // 获取当前分类总共有多少页
                const last = $$('.pages .last')
                if (last.length > 0) {
                    pages = Number($$('.pages .last').attr('href').split('-').pop())
                }
            }
            
            // 获取当前页面所有的小说链接
            const uris = $$('.list-lastupdate li').get()
                .map(el => $$(el).find('.name a').attr('href'))
            for (let uri of uris) {
                try {
                    if (links.indexOf(uri) > -1) {
                        // update
                        continue
                    }
    
                    // insert
                    const $: CheerioStatic = await fetch({ uri: HOST + uri })
                    const book = new Book()
                    book.uri = uri
                    book.type = $('.crumbs .l .c2').text().replace(/(.*)\s.*>\s/, '$1')
                    book.name = $('.book-info .l h1').text()
                    book.author = $('.book-info .l em').text().replace(/.*[:：]/, '')
                    book.intro = $('.intro').html().replace(/(<\w>)?.*<\/?\w+>/g, '').trim()
                    book.words = Number($('.stats .r i').eq(1).text())
                    book.status = $('.stats .r i').eq(0).text()
                    book.coverPicture = utils.getCoverPicture(uri)
                    book.updateTime = new Date($('.stats .r i').eq(2).text().replace('-', '/'))
                    book.createTime = new Date()
                    book.latestChapter = new Chapter($('.stats .l a').attr('href'), $('.stats .l a').text())
                    book.chapters = $('.chapter-list dd').get()
                        .map(el => new Chapter($(el).find('a').attr('href'), $(el).find('a').text()))
    
                    // 小说信息入库
                    await bookRepository.save(book)
                    spinner.text = spinner.text.replace(/(\d+)/, m => String(Number(m) + 1))
    
                    // 将采集过的地址入库
                    await directoryRepository.save(new Directory(uri, book.type))

                    // 小说页面静态化
                    const filePath = path.resolve(__dirname, `../../static${uri}`)
                    await fs.mkdirs(filePath)
                    await fs.writeFile(`${filePath}/index.html`, $.html())

                    // 小说章节页面静态化
                    Promise.resolve().then(() => {
                        book.chapters.forEach(async chapter => {
                            const link = HOST + uri + chapter.uri
                            try {
                                const $ = await fetch({ uri: link })
                                await fs.writeFile(`${filePath}/${chapter.uri}`, $.html())
                            } catch (error) {
                                // 保存失败的章节链接，用于之后补偿下载
                                await failRepository.save(new FailLink(link))
                            }
                        })
                    })
                } catch (error) {
                    console.log('\n', uri, error.message)
                }
            }
        }

        spinner.succeed()
    } catch (err) {
        spinner.fail()
        console.log(err.message)
    } finally {
        connection.close()
    }
}).catch(error => {
    spinner.fail()
    console.log(error)
})
