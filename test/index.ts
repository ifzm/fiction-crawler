import fetch from '../src/util/fetch'

// https://www.google.com
fetch({ 
    uri: 'http://www.uctxt.com',
    timeout: 1000
})
.then(($: CheerioStatic) => {
    console.log($('title').text())
})
.catch(err => {
    console.log(err.message)
})