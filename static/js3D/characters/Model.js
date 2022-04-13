// player model file
console.log('loaded : Model.js')

class Model extends Player {
    constructor ( showHelpers = false ) {
        super( showHelpers )
        // this.container = new THREE.Object3D()
        this._geometry = null
        this._mesh = null
        
        this._light = new Light('spot', 0xaaaaaa)
        this._target = new THREE.Object3D()
        this._last_animation = ""
        this._mixer = null
        this._aureole = new THREE.PointLight( 0xffffff, 10, 75)
        this._fps = 0
        
        this._scale = Settings.player.model.scale
        this._position = {
            x: 0,
            y: 0,
            z: 0
        }
    }

    load (href = 'models/tris.js' , callback , material = Settings.player.model.material, mng) {
        const loader = new THREE.JSONLoader( mng )

        loader.load(href, ( geometry ) => {
            this._geometry = geometry

            this._mesh = new THREE.Mesh(
                geometry,
                material
            )
            
            this._mesh.scale.set (
                this._scale,                
                this._scale,                
                this._scale                
            )
            this._mesh.basicRotation = Math.PI / 2
            this._mesh.rotation.y = this._mesh.basicRotation
                
            this._hitbox = new THREE.Box3().setFromObject(this._mesh)
            
            //// DEBUG /////
            
            // console.log('size', this._hitbox.getCenter())
            // console.log('size', this._hitbox.getCenter().y + this._hitbox.getSize().y/2)
            
            // console.log('position : y : ', this._hitbox.getSize().y)
            // console.log('center : y : ', this._hitbox.getCenter().y)
            
            console.log( geometry.animations )
            for (let i in geometry.animations ){
                console.log(geometry.animations[i].name)
            }

            //// END OF DEBUG ////

            this._position = {
                x : 0,
                y : (this._hitbox.getSize().y / 2 - this._hitbox.getCenter().y),                
                z : 0
            }

            console.log('size', this._hitbox)
            

            this._mesh.position.set(
                this._position.x,
                this._position.y,
                this._position.z
            )

            this._mesh.castShadow = true
            this._mesh.receiveShadow = true
            this.add( this._mesh )

            this._target.position.set( 0, 0, 0)
            this.add(this._target)
            this._light.position.y = this._position.y 
            this._light.children[1].visible = false

            this.light.target = this._target
            this.light.distance = 100
            this.light.intensity = 100
            this.light.angle = Math.PI/6
           
            this.add(this._light)
            this.add(this._aureole)
            callback()

            //// MIXER AND OTHER ANIMATION THINGS ////
            this._mixer = new THREE.AnimationMixer( this._mesh )
            this._last_animation = "stand"
            this._mixer.clipAction( "stand" ).play()

        })
    }

    render ( delta ) {
        super.render( )
        this.update(delta)
        // console.log('delta',delta)
        this._fps = (++this._fps) % 360
        this._light.position.x =   Math.sin( 2*this._fps * Math.PI / 180 ) * 25 
        this._light.position.z = - Math.cos( 2*this._fps * Math.PI / 180 ) * 25 
        this._target.position.x =   Math.sin( 2*this._fps * Math.PI / 180 ) * 60
        this._target.position.z = - Math.cos( 2*this._fps * Math.PI / 180 ) * 60
        // console.log(this._target.position)
    }

    update ( delta ) {
        if ( this._mixer ){
            this._action()
            this._mixer.update( delta )
        }
        
    }

    clone () {
        return this._mesh.clone()
    }

    //// VIRTUAL FUNCTION ////

    _action ( ) {
        // this.animation = "stand"      
        if ( this._isMoving ) {
            this.animation = "run"
        } else {
            this.animation = "stand"
        }
    }

    //// SETTERS AND GETTERS ////

    set animation ( animation ) {
        if (this._last_animation != animation){
            this._mixer.clipAction( this._last_animation ).stop()

        this._mixer.clipAction ( animation ).play()
        console.log('trrr')
        this._last_animation = animation

        }
    }

    get animation ( ) {
        return this._last_animation
    }

    get light ( ) {
        return this._light.children[0]
    }
    
    get aureole ( ) {
        return this._aureole
    }
}