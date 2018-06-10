/*
 * Created Date: Wednesday, June 6th 2018, 11:25:34 pm
 * Author: jim
 * 
 * Copyright (c) 2018 Your Company
 */

import rp = require('request-promise')
import iconv = require('iconv-lite')
import cheerio = require('cheerio')

function fetch(options: rp.Options): rp.RequestPromise {
    let _options: rp.Options = Object.assign({}, options, {
        timeout: 30000,
        encoding: null,
        transform(buffer: Buffer) {
            // 将页面内容转换为utf-8字符串
            let html = iconv.decode(buffer, 'gbk')
            html = iconv.encode(html, 'utf-8').toString('utf8')
            return cheerio.load(html, { decodeEntities: false })
        }
    })

    return rp(_options)
}

export default async function load(options: rp.Options, retry: number = 5) {
    try {
        if (retry > 0) {
            return await fetch(options)
        }

        return Promise.reject()
    } catch (e) {
        if (retry > 1) {
            await setTimeout(() => {}, 500)
            return await load(options, --retry)
        }
    }
}