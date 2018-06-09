/*
 * Created Date: Monday, June 4th 2018, 11:23:15 pm
 * Author: jim
 * 
 * Copyright (c) 2018 Your Company
 */

global.Promise = require('bluebird')

import "reflect-metadata"
import ora = require('ora')
import fetch from './util/fetch'
import { createConnection, getMongoRepository } from "typeorm"
import { Book, Chapter, Link } from './entity/Book'

const spinner = ora(` 收录『 UC书盟小说 』共 0 本`).start()
createConnection().then(async connection => {
    try {
        const bookRepository = getMongoRepository(Book)
        const linkRepository = getMongoRepository(Link)
        const links = await linkRepository.find().then(vs => vs.map(v => v.uri))

        const HOST = 'http://www.uctxt.com'
        const $$: CheerioStatic = await fetch({ uri: `${HOST}/toplist/allvisit-1` })

        const books: Book[] = []
        const uris = $$('.list-lastupdate li').get().map(el => HOST + $$(el).find('.name a').attr('href'))
        for (let uri of uris) {
            try {
                if (links.indexOf(uri) > -1) {
                    continue
                }

                const $: CheerioStatic = await fetch({ uri })

                const book = new Book()
                book.uri = uri
                book.type = $('.crumbs .l .c2').text().replace(/(.*)\s.*>\s/, '$1')
                book.name = $('.book-info .l h1').text()
                book.author = $('.book-info .l em').text().replace(/.*[:：]/, '')
                book.intro = $('.intro').html().replace(/(<\w>)?.*<\/?\w+>/g, '').trim()
                book.words = Number($('.stats .r i').eq(1).text())
                book.status = $('.stats .r i').eq(0).text()

                const chapters = $('.chapter-list dd').get()
                    .map(el => new Chapter($(el).find('a').attr('href'), $(el).find('a').text()))

                const urisplit = uri.split('\/')
                const coverPictureName = urisplit[urisplit.length - 2] + 's.jpg'
                book.coverPicture = uri.replace('book', 'files/article/image') + coverPictureName
                book.chapters = chapters
                book.latestChapter = new Chapter($('.stats .l a').attr('href'), $('.stats .l a').text())
                book.updateTime = new Date($('.stats .r i').eq(2).text().replace('-', '/'))
                book.createTime = new Date()

                books.push(book)
                spinner.text = spinner.text.replace(/\d+/, `${books.length}`)

                // 将采集的地址入库
                await linkRepository.save(new Link(uri, book.name))
            } catch (error) {
                console.log('\n', uri, error.message)
            }
        }

        await bookRepository.save(books)
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
