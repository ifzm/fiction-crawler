global.Promise = require('bluebird')

import "reflect-metadata"
import ora = require('ora')
import fetch from './util/fetch'
import { createConnection, getMongoRepository } from "typeorm"
import { Book, Chapter } from './entity/Book'

const spinner = ora(` 收录『 UC书盟小说 』共 0 本`).start()
createConnection().then(async connection => {
    try {
        const bookRepository = getMongoRepository(Book)

        const HOST = 'http://www.uctxt.com'
        const $$: CheerioStatic = await fetch({ uri: `${HOST}/index/type-1-1` })

        const books: Book[] = []
        const uris = $$('.content .list-lastupdate li').get().map(el => HOST + $$(el).find('.name a').attr('href'))
        for (let uri of uris) {
            try {
                const $: CheerioStatic = await fetch({ uri })

                const book = new Book()
                book.uri = uri
                book.type = 1
                book.name = $('.book-info .l h1').text()
                book.author = $('.book-info .l em').text().replace(/.*[:：]/, '')
                book.intro = $('.intro').text().replace(/(<\w>)?.*<\/?\w+>/g, '').trim()
                book.words = Number($('.stats .r i').eq(1).text())
                book.status = $('.stats .r i').eq(0).text()

                const latestChapters = new Chapter()
                latestChapters.name = $('.stats .l a').text()
                latestChapters.uri = $('.stats .l a').attr('href')
                latestChapters.updateTime = new Date($('.stats .r i').eq(2).text().replace('-', '/'))

                const chapters: Chapter[] = $('.chapter-list dd')
                    .get()
                    .map(el => {
                        const chapter = new Chapter()
                        chapter.name = $(el).find('a').text()
                        chapter.uri = $(el).find('a').attr('href')
                        return chapter
                    })

                book.chapters = chapters
                book.latestChapters = latestChapters
                book.updateTime = new Date()

                books.push(book)
                spinner.text = spinner.text.replace(/\d+/, `${books.length}`)
            } catch (error) {
                console.log(uri, error.message)
            }
        }

        await bookRepository.save(books)
        spinner.succeed()
    } catch (err) {
        spinner.fail()
        console.log(err)
    } finally {
        connection.close()
    }
}).catch(error => {
    spinner.fail()
    console.log(error)
})
