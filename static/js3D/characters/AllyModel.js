//// ALLY MODEL ////
console.log("loaded : AllyModel.js")

class AllyModel extends Ally {
    constructor ( distance = 50, showHelpers = false , wireframe = false) {
        super ( distance, showHelpers )

        //// BASIC STUFF ////

        this._basic = {
            rotation : Math.PI / 2,
        }

        //// MESH ////
        
        this._scale = Settings.player.model.scale * 0.75

        this._geometry = null
        this._mesh = null
        this._hitbox = null
        this._ring = new Ring( this._scale * 20 )
        this._aureole = new THREE.PointLight( 0xffff22, 10, 75)

        this._wireframe = wireframe
        
        //// ANIMATIONS ////

        this._animation = {
            last : "",
            mixer : null,
            // clock : new THREE.Clock()    // extends
        }

    }

    load ( href = "models/ally_tris.js", callback, material = Settings.ally.material, mng ){
        const loader = new THREE.JSONLoader(mng)
        material.wireframe = this._wireframe
        loader.load ( href, geometry => {
            
            //// LOADING MODEL MESH ////
            
            this._geometry = geometry
            this._material = material
            this._mesh = new THREE.Mesh(
                geometry,
                material
            )

            //// SETTING IT UP ////
            
            this._mesh.scale.set ( 
                this._scale,
                this._scale,
                this._scale
            )
            this._mesh.rotation.y = this._basic.rotation
            this._mesh.basicRotation = this._basic.rotation
            //// POSITIONING ////
            
            this._hitbox = new THREE.Box3().setFromObject(this._mesh)
            this._mesh.position.set (
                0,
                (this._hitbox.getSize().y / 2 - this._hitbox.getCenter().y),
                0
            )
            
            //// SHADOW CASTING ////
            
            this._mesh.castShadow = true
            this._mesh.receiveShadow = true

            //// ADDING TO SCENE ////
            this.add(this._ring)
            this.add(this._mesh)
            
            //// INTERACTION ////
            
            callback ( )

            //// LIGHTING ////
            this.add(this._aureole)

            //// MIXER AND OTHER ANIMATION THINGS ////
            
            this._animation.mixer = new THREE.AnimationMixer( this._mesh )
            this._animation.last = "stand"
            this._animation.mixer.clipAction( 
                this._animation.last
            ).play( )

            //// DEBUG ////
            
            // console.log( geometry.animations )
            // for (let i in geometry.animations ){
            //     console.log(geometry.animations[i].name)
            // }

        })
    }

    render ( delta, isMoving ) {
        super.render()
        this.update ( delta, this._isSelected ? isMoving : false)
    }

    update ( delta, isMoving ) {
        if ( this._animation.mixer ) {
            this._action( isMoving )
            this._animation.mixer.update ( delta )
        }
        
    }

    hover ( hover = false ) {
        if ( hover && !this._isSelected ){
            this._ring.hover = true
        } else {
            this._ring.hover = false
        }
    }

    _action ( isMoving ) {
        if ( this._isMoving || isMoving ) {
            this.animation = "run"
        } else {
            this.animation = "stand"
        }
    }

    set animation ( animation ) {
        if ( this._animation.last != animation ) {
            this._animation
                .mixer
                .clipAction( this._animation.last )
                .stop()

            this._animation
                .mixer
                .clipAction ( animation )
                .play()
            this._animation.last = animation
        }
    }

    get animation ( ) {
        return this._animation.last
    }

    get aureole ( ) {
        return this._aureole
    } 
}