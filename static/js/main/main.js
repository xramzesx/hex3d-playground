console.log('loaded : main.js')

let editor
let net

$(document).ready(() => {
    // console.log('elo')
    net = new Net()
    editor = new Editor($('#options-size').val())
})