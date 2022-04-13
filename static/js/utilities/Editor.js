// Main editor class
console.log('loaded : Editor.js')

const session = {
    level : [],
    history : [],
    idCounter : 0,
    actions : ['LAST_SAVE','INDEXED_SAVE', 'ID_SAVE'],  // INDEXED_SAVE już nie jest używany
    types : ['wall', 'enemy', 'treasure', 'light', 'fireplace'],
    current: {
        type : "wall",
    },
    changeType : (div, typeIndex)=>{
        $('.options-type-checked').removeClass('options-type-checked')
        div.addClass('options-type-checked')
        const { types } = session 
        session.current.type = types[typeIndex]
        $("#current-type").html(types[typeIndex])
    }
}

class Editor {
    constructor(size) {
        this.levels = []
        this.size = size
        this.map = []
        this.generateMap()
        this.optionsEvents()
        this.createGui()
    }

    generateMap( e ){
        $("#editor").html('')
        session.idCounter = 0
        this.size = $('#options-size').val()
        this.map = []
        console.log(this.size)
        for (let i = 0; i < this.size; i++){
            for (let j = 0; j < this.size; j++){
                const hex = new Hex(i,j)
                hex.on('click',()=>{
                    // if (session.history.length == 1)
                    //     if (session.history[0].direction.current == defaults.direction.length - 1)
                    //         session.history = []
                    this.print()
                })
                this.map.push(hex)
                console.log(i,j)
            }
        }
        this.print()
        console.log('dlugisc', this.map.length)
    }

    update ( ) {
        $("#options-load-select").html("")
        this.levels = this.levels.sort((a , b) => b.date - a.date)
        for (let i in this.levels){
            const element = this.levels[i]
            const option = $('<option>')
            option
                .html( element.name ? `${element.name}` : i + ".")
                .attr( 'value', element.id )
            $("#options-load-select").append(option)
        }
        console.log('update')
    }

    fetch ( callback ) {
        net.sendData( { action : "FETCH" } ,'/fetch', data => {
            console.log(data)
            // this.levels = JSON.parse( data )
            this.levels = data 
            this.update()
        })
    }

    export(){
        const { length } = defaults.direction
        const level = []
        
        for (let i in this.map){
            // for (let j in this.map[i]){
                const current = this.map[i]
                if (current.direction.current != defaults.direction.length -1){
                    
                    let tmpDirIn = parseInt(current.direction.current + length/2) % length
                    
                    if (current.direction.current >= 3 )
                        tmpDirIn = parseInt(current.direction.current + 1 + length/2) % length
                        
                    level.push({
                        id : i,
                        x : current.position.x,
                        z : current.position.z,
                        dirOut : current.direction.current,
                        dirIn : tmpDirIn,
                        type : current.type,
                    })
                // }
            }
        }


        session.level = level
    }

    set message ( message ) {
        $("#current-message").html(message)
    }

    import( importer ){
        if (typeof importer == 'string')
            importer = JSON.parse(importer)
        console.log(importer)
        $("#options-size")
            .val(importer.size)
            .trigger('change')

        const { level } = importer
        let lastIndex = 0
        for (let i in level){
            for (let j = lastIndex; j < this.map.length; j++){
                if (this.map[j].position.x == +level[i].x && this.map[j].position.z == +level[i].z ){
                    const x = +level[i].x + +level[i].z * (importer.size)
                    // console.log("x", x, this.map[x].id)
                    this.map[j].import(level[i])
                    // this.map[x].import(level[i])
                    lastIndex = j
                    break
                }
            }
        }
        this.print()
    }
    print(){
        this.export()
        let tmp = ''
        for (let i in session.level)
            tmp += JSON.stringify(session.level[i], null, 5)
        this.createPackage()
        $("#json").html(JSON.stringify(this.package, null, 4))
    }
    optionsEvents() {
        $("#options-go-to-game").on('click',(e) => {
            this.createPackage()
            console.log(this.package)
            net.sendData({ level : this.package }, '/select', (res)=>{
                console.log(res)
                this.message = res
                if (res == "SUCCESS")
                    window.location.href = '/game'
            })
        })
        $("#options-size").on('change',(e) => this.generateMap(e))
        $("#options-save").on('click', (e) => {
            this.export()
            console.log(session.level)
            this.createPackage( )
            net.sendData(this.package, '/saveLevel', (res)=>{
                console.log(res)
                if (res.status == "SUCCESS"){
                    this.levels = res.data
                    console.log('siema')
                    this.update()
                    this.message = "saved level"

                }
            })
        })
        $("#options-load").on('click', (e) => {
            // console.log('xxxx',)
            let index = $("#options-load-select").val()
            let whichAction = index == '' ? session.actions[0] : session.actions[2]
             
            const action = { 
                action :  whichAction,
                index : whichAction == session.actions[2] ? index : undefined 
            } 
            // console.log(action.index)
            net.sendData(action, '/loadLevel', (res) =>{
                console.log(res)
                this.message = "loaded level"
                this.import(res)
            })
        })
        $("#options-save-name").on("keydown", (e) => {
            this.print()
        })
    }
    
    createPackage() {
        this.package = {
            name : $("#options-save-name").val(),
            size : this.size,
            level : session.level,
        }
    }

    createGui(){
        // create option list:
        const { types } = session
        for (let i in types){
            const typeBtn = $("<button>")
            typeBtn
                .html(types[i])
                .on('click', (e)=>{
                    session.changeType(typeBtn, i)
                })
            if (types[i] == session.current.type)
                session.changeType(typeBtn, i)
            $("#options-type").append(typeBtn)
        }

        // get level counter:
        net.sendData({}, '/countLevels', (res)=>{
            $("#options-load-index").attr('max', res)
        })
        this.fetch()
    }
}