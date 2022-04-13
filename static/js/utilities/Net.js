// komunikacja z serwerem - Ajax
console.log('loaded : Net.js')

class Net {
    constructor(firstAction = true) {
        this.default = {
            ajax: {
                contentType: undefined,
                processData: undefined
            }
        }
    }

    sendData(data, href, callback, property = this.default.ajax) {
        $.ajax({
            url: href,
            data: data,
            type: "POST",
            contentType: undefined || property.contentType,
            processData: undefined || property.processData,
            success: callback,
            error: (xhr, status, error) => {
                console.log("wystąpił se no problemos :V", xhr)
            }
        })
        console.log('wow, użyłeś AJAXA')
    }
    // uploadFile(data, href, callback)
}