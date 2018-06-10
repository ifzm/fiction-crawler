export function getCoverPicture(baseUri) {
    const urisplit = baseUri.split('\/')
    const coverPictureName = urisplit[urisplit.length - 2] + 's.jpg'
    return baseUri.replace('book', 'files/article/image') + coverPictureName
}
