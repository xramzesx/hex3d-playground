// Particle class
console.log('loaded : Particle.js')

class Particle extends THREE.Object3D {
    constructor ( props, sprite = true) {
        super()
        //// BASIC ////
        
        this._wireframe = props.wireframe === undefined ? false : props.wireframe
        this._opacity = 1
        this._speed = 1
        this._size = 1

        this._isSprite = sprite

        this._bottom = 0

        //// MAXIMS ////

        this._max = {
            height  : props.max.height || Settings.particle.max.height,
            width   : props.max.width  || Settings.particle.max.width
        }

        //// MAIN PARTICLE MESH ////
        
        this._mesh = sprite 
        ? new THREE.Sprite( 
            props.sprite || Settings.particle.sprite.clone()
        )
        : new THREE.Mesh (
            props.geometry || Settings.particle.geometry,
            props.material || Settings.particle.material.clone(),
        )

        //// LIGHTING ////

        this._light = new THREE.PointLight( 0xfff, 0.1 )
        this._light.position.set(0,0,0)
        this._light._type = "light"
        // this.add( this._light )
        
        
        this.add( this._mesh )
        this.reset ( )
        this.wireframe = this._wireframe
    }

    reset ( scale ) {

        //// POSITION ////
        
        this._bottom = getRandom ( 0 , this._max.height / 2 )

        this.position.set(
            getRandom ( this._max.width / 2 - this._max.width, this._max.width / 2 ),
            this._bottom,
            getRandom ( this._max.width / 2 - this._max.width, this._max.width / 2),
        )

        // this.wireframe = this._wireframe
        
        //// SPEED ////
        
        this._speed = getRandom( 0.5, 2 )
        
        //// SCALE ////

        this._scale = scale == undefined ? 1 : scale 
        this._scale *= getRandom ( 0.5, 2 ) * this._size
        if (this._isSprite)
            this._scale *= 20

        this.scale.set( 
            this._scale,
            this._scale,
            this._scale
        )

    }

    update ( control ) {
        if ( control.opacity.bool ){
            this.opacity =
                control.opacity.value 
                - ( this.position.y - this._bottom ) 
                / ( this._max.height - this._bottom)
        }else{
            this.opacity = 0.7
        }
        
        if ( this.position.y > this._max.height )
            this.reset ( control.scale )

        this.position.y += this._speed * control.speed 
    }

    maxims ( max ) {
        this._max = max
    }

    _meshOnly ( callback ) {
        for (let i in this.children){
            if ( this.children[i]._type != "light" )
                callback( this.children[i] )
        }
    }

    //// DIMENSIONS ////

    set size ( size ) {
        /// this code is no longer used
        this._size = size

        this.scale.set(
            this._size * this._scale,
            this._size * this._scale,
            this._size * this._scale
        )

        this.width = size * 5
        this.height = size * 100
    }

    set width ( width ) {
        this._max.width = width
    }

    set height ( height ) {
        this._max.height = height
    }

    set wireframe ( wireframe ) {
        this._wireframe = wireframe
        this._meshOnly( mesh => { 
            mesh.material.wireframe = wireframe
        })

        console.log(this._wireframe)
    }

    set opacity ( opacity ) {
        this._opacity = opacity
        this._meshOnly ( mesh => {
            mesh.material.opacity = opacity
        })
        
        // this._light.intensity = opacity * 0.1
    }

    set blending ( blending ) {
        this._blending = blending
        this._meshOnly( mesh => {
            mesh.material.blending = blending
        })
    }

}