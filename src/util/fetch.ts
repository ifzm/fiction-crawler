/*
 * Filename: /Users/jim/Documents/vscode-workspace/typeorm-mongo/src/util/fetch.ts
 * Path: /Users/jim/Documents/vscode-workspace/typeorm-mongo
 * Created Date: Wednesday, June 6th 2018, 11:25:34 pm
 * Author: jim
 * 
 * Copyright (c) 2018 Your Company
 */

import rp = require('request-promise')
import iconv = require('iconv-lite')
import cheerio = require('cheerio')

export default function(options: rp.Options): rp.RequestPromise {
    let _options: rp.Options = Object.assign({}, options, {
        timeout: 30000,
        encoding: null,
        transform(buffer: Buffer) {
            let html = iconv.decode(buffer, 'gbk')
            return cheerio.load(html, { decodeEntities: false })
        }
    })

    return rp(_options)
}