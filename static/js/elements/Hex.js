console.log('Hex.js is loaded')

const defaults = {
    position : {
        x : 85,
        z : 100,
        shift : 50,
    },
    direction : [ 0, 1, 2, 3, 4, 5, '' ],
}

class Hex {
    constructor(x, z, root = '#editor') {
        this.position = {
            x: x,
            z: z,
        }
        
        this.element = $('<div>')
        const { position } = defaults

        this.element
            .addClass('hex')
            .css('left', x * position.x)
            .css('top', z * position.z + (x % 2) * position.shift)

        this.direction = {
            element : $('<div>'),
            current : defaults.direction.length - 1
        } 
        this.direction.element
            .addClass('hex-direction')
        this.rotate()
        this.on('click', (e)=>{
            if (this.type == session.current.type || this.direction.current == defaults.direction.length - 1){
                this.direction.current = 
                    this.direction.current >= defaults.direction.length - 1 
                    ? 0 : this.direction.current + 1;
                this.rotate()
            }
                this.changeType()
            
        })
        // console.log('xd')

        $(root).append(this.element)
        this.element.append(this.direction.element)
    }

    changeType(type){
        this.direction.element.removeClass(`hex-type-${this.type}`)
        this.type = type || session.current.type
        this.direction.element.addClass(`hex-type-${this.type}`)
    }

    rotate(){
        const index = this.direction.current
        const element = this.direction.element

        if (index == 0){
            this.id = session.idCounter++

            session.history.push(this)
            this.id = session.level.length - 1

            console.warn(this.id)
        }

        element
            .html(defaults.direction[index])
            .css('transform', `translate(-50%,-50%) rotateZ(${ index * 60 }deg)`)
            .css('opacity' , index == defaults.direction.length - 1 ? '0' : '1')
            
        if (index == defaults.direction.length - 1){
            session.history.splice(this.id, 1)
            for (let i in session.history){
                session.history[i].id = i
            }
            // setTimeout(()=>{
                element
                    .css('display', 'none')
                    .css('transform', '')
            // },100)
        } else {
            element.css('display', 'inherit')
        }
        console.log(index)
    }

    import( importer ){
        this.direction.current = +importer.dirOut
        this.rotate()
        this.changeType(importer.type)
    }

    on( event , callback ){
        this.element.on(event, callback)
    }
}