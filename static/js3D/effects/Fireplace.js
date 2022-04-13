// Particle class
console.log('loaded : Fireplace.js')

let counter = 0

class Fireplace extends THREE.Object3D {
    constructor ( props ) {
        super()

        //// BASIC ////

        this._color = props.color !== undefined ? props.color : this._color
        
        this._delta = {
            height : 100,
            width : 0
        }

        this._max = {
            height : props.maxHeight,
            width : props.maxWidth
        } 

        this._maxHeight = 100
        this._maxWidth = 0
        
        // this._particleScale = 1
        this._scale = 1
        this._wireframe = props.wireframe === undefined ? false : props.wireframe
        this._opacity = 1
        this._intensity = 10

        //// PARTICLE PROPERTIES ////

        this._particles = []
        this._package = {
            material : Settings.particle.material.clone(),
            sprite : Settings.particle.sprite.clone(),
            geometry : Settings.particle.geometry
        }

        //// PROPERTIES ////

        this._show = true
        this._useSprite =  props.useSprite === undefined ? true : props.useSprite
        this._dynamicOpacity = props.dynamicOpacity === undefined ? true : props.dynamicOpacity
        this._speed = props.speed || 1
        this._radius = props.radius || Settings.radius
        this._listener = props.listener || false

        //// OPTIMALISATION ////

        this._hide = {
            last : 0
        }

        //// LIGHT ETC ////
       
        this._intensity = props.intensity === undefined ? 1 : props.intensity
        // this._light = new THREE.PointLight( this._color, this._intensity * !this._wireframe )
        this._light = new Light(undefined, this._color, true)
        this._light.children[0].intensity = this._intensity * !this._wireframe
        this._light.children[0].castShadow = props.castShadow || false
        // this._light.children[0].castShadow =  false
        // this._light.castShadow = true
        this._light._height = 0
        
        this._fps = 0

        this.add( this._light )

        //// PARTICLES SETTING UP ////

        this.name = `fire_${counter++}`

        this.position.space = new THREE.Vector3(0,0,0)
        this.width = props.width || 0
        this.height = props.height || 100        
        this.wireframe = this._wireframe

        this._count = props.count || 1
        this.generate( this._count )
        
    }

    generate ( count ) {
        this.count = count
    }

    update ( point ) {
        if ( !this._listener )
            this.render ( )
        else
            this.check ( point )
        this.light.visible = true
    }

    render ( ) {
        this._fps = (++this._fps) % 360
        for ( let i in this._particles ) {
            this._particles[i].update({
                opacity : {
                    bool : this._dynamicOpacity,
                    value : this._opacity
                },
                scale : this._scale,
                speed : this._speed
            })
        }

        const { sin, abs, PI } = Math

        this._light.position.y = this.position.y + abs( 1+sin(this._fps * PI / 180) )*2
    }

    check ( point ) {
        const { pow, sqrt } = Math
        // this.position.space =new THREE.Vector3(0,0,0)
        this.position.space.setFromMatrixPosition(this.matrixWorld)
        const { space } = this.position

        const distance = sqrt( pow( point.x - space.x, 2 ) + pow( point.z - space.z, 2 ) )

        if ( distance <= this._radius ) {
            this.show = true
            console.log(this.light.visible)
        } else {
            this.show = false
        }
        if ( this._fps % 3 == 0)
            this.hide( distance <= this._radius)

        if (this._opacity > 0){
            // for (let i in this.children)
            //     this.children[i].visible = true

            // this.visible = true
            this.render()
        } else {
            // for (let i in this.children)
            //     this.children[i].visible = false
            
            // this.visible = false
        }
        
        
        if (this._show){
            this._opacity += this._opacity > 1 ? 0 : 0.01
        }else{
            this._opacity -= this._opacity < 0 ? 0 : 0.01 
        }

        // this.light.visible = this._opacity > 0
        this._light.visible = this._opacity > 0
        // this.light.color.setHex ( this._opacity > 0 ? this._color : 0 )
        // if (this._opacity < 0)
        //     this.count = 0
        // else
        //     this.count = 50
        // console.log(this._opacity)

        // console.log(this.name ,this._hide.last)
        // console.log(this.name, this.light.visible)
        // console.log(this.name, this.light)
    }

    hide ( hide ) {
        // if (hide)
        // if ( this._listener )
            // for (let i in this.children)
            //     this.children[i] = hide
        if ( hide != this._hide.bool ) {
            this._hide.last = 0
        }

        this._hide.bool = hide
        
        if ( this._hide.last < this._particles.length ){
            this._particles[this._hide.last].visible = hide
            this._hide.last++
        }

        // if ( hide ) {
        //     if ( this._hide.last < this._particles.length - 1 ){
        //         this.children[this._hide.last].visible = true
        //         this._hide.last++
        //     }
        // } else {
        //     if ( this._hide.last > 0 ) {
        //         this._hide.last--
        //         this.children[this._hide.last].visible = false
        //     }
        // }
        // this.light.visible = true
        
    }

    hideImmediately( hide ) {
        if ( hide )
            for (let i in this.children)
                // if (this.children[i].isLight === undefined)
                    this.children[i].visible = false
                // else
                    // console.log(i)
        // this._light.visible = true
    }

    set isListening ( isListening ) {
        this._listener = isListening
        this._opacity = false
        this.hideImmediately( isListening )

        // this.position.space.getPositionFromMatrix(
        //     this.matrixWorld
        // )
        this.position.space.setFromMatrixPosition(this.matrixWorld)
        // console.log(this.position.space)
    }

    set count ( count ) {
        count = count > 0 ? count : 1
        this._count = count

        for (let i = this._particles.length - 1; i >= 0; i--)
            this.remove( this._particles[i] )

        this._particles = []
        
        for ( let i = 0; i < count; i++ ) {
            const props = {
                geometry : this._package.geometry,
                material : this._package.material.clone(),
                sprite : this._package.sprite.clone(),
                max : {
                    height : this.position.y + this._max.height,
                    width : this._max.width
                },
                wireframe : this._wireframe,
            }
            this._particles.push( new Particle ( props, this._useSprite ) )
            this._particles[i].name = `part_${this.name}_${i}`
            this.add( this._particles[i] )
        }
    }

    package ( geometry, material, sprite = true) {
        this._package.material = material
        this._package.geometry = geometry
        this._useSprite = sprite
        this.generate()
    }
    
    //// DIMENSIONS ////

    set size ( size ) {
        // for (let i in this._particles)
        //     this._particles[i].size = size
        this.scale.set(size, size, size)
        this._size = size
        this.intensity = size * this._max.width
        // this.width = size / 2
    }

    set width ( width ) {
        this._max.width = width
        for (let i in this._particles)
            this._particles[i].width = this._max.width
        
        this.intensity = width / 10 + 1
    }

    set height ( height ) {
        this._max.height = height
        for (let i in this._particles)
            this._particles[i].height = this._max.height
    }

    set speed ( speed ) {
        this._speed = speed
    }

    set opacity ( opacity ) {
        this._dynamicOpacity = opacity
    }

    set wireframe ( wireframe ) {
        this._wireframe = wireframe
        for (let i in this._particles)
            this._particles[i].wireframe = this._wireframe
        this.intensity = this._intensity
    }

    //// LIGHT ////

    set show (show) {
        // if (this._listener && this.show != show)
        //     await this.hide( show )
        
        this._show = show
        this.intensity = this._intensity

    }

    set intensity ( intensity ) {
        this._intensity = intensity
        // this._light.intensity = this._intensity * !this._wireframe
        this.light.intensity = this._intensity * !this._wireframe  * this._opacity
    }

    set distance ( distance ) {
        this.light.distance = distance
    }

    //// BLENDING ////

    set blending ( blending ) {
        this._blending = blending
        for (let i in this._particles)
            this._particles[i].blending = blending ? THREE.AdditiveBlending : THREE.NormalBlending
    }

    get count ( ) {
        return this._count
    }

    get light ( ) {
        return this._light.children[0]
    }

}