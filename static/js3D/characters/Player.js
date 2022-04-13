// player class
console.log('loaded : Player.js')

class Player {
    constructor ( showHelpers = false ){
        this._container = new THREE.Object3D()
        this._isMoving = false
        this._last_isMoving = false

        this._camera = null
        this._camera_position = {
            x : 0,
            y : 200,  // 300
            z : 150   // 275
        }

        let { width : scale } = Settings.wall.dimensions
        scale /= 3

        const { geometry, material } = Settings.player

        this._player    = new THREE.Mesh(geometry, material)  // player - sześcian 
        this._axes      = new THREE.AxesHelper(200) // control axes
        this._pointer   = new Pointer( showHelpers )

        this._player.scale.set(scale, scale, scale)
        
        this.add( this._player  )
        this.add( this._axes )
        // this._player.add(this._axes)

        if ( !showHelpers ) {
            this._player.visible = false
            this._axes.visible = false
            this._pointer.visible = false
        }

        this._player.position.y = scale / 2
        this._axes.position.y = scale / 2
        this._container.name = "player"

        this._vect_direction = new THREE.Vector3(0,0,0)
        this._vect_clicked = new THREE.Vector3(0,0,0)
        this._vect_speed = 5

        this.__vect_angle = 0
    }

    move ( point ){
        this._pointer.position = point || this._pointer.position
        this._vect_clicked = this._pointer.position.clone()
        this._vect_direction = this._vect_clicked.clone().sub(this._container.position).normalize()
        
        this._vect_angle = Math.atan2(
            this._container.position.clone().x - this._vect_clicked.x,
            this._container.position.clone().z - this._vect_clicked.z,
        )
        
        // console.log( this._vect_direction )
    }

    render ( ) {
        // console.log(this._container.position.clone().distanceTo(this._vect_clicked))
        const difference = this._container.position.clone().distanceTo(this._vect_clicked)
        const isMoving = difference - this._vect_speed >= 0
        if ( isMoving )
            this._container.translateOnAxis(
                this._vect_direction,
                this._vect_speed
            )
        // else 
        //     this._container.position.set(
        //         this._vect_clicked.x,
        //         this._vect_clicked.y,
        //         this._vect_clicked.z
        //     )
        
        this._isMoving = isMoving
        // this._isMoving = isMoving != this._isMoving  
        //     ? isMoving 
        //         ? isMoving 
        //         : this._last_isMoving
        //     : isMoving
        
        this._last_isMoving = isMoving
        
        this.follow()
    }

    add ( object ) {
        this._container.add(object)
    }

    follow ( ) {
        const point = this._container.position
        this._camera.position.set(
            point.x + this._camera_position.x + Settings.camera.position.x,
            point.y + this._camera_position.y + Settings.camera.position.y,
            point.z + this._camera_position.z + Settings.camera.position.z
        )
        this._camera.lookAt( point )
    }
    
    set _vect_angle ( angle ){
        angle -= Math.PI
        this.__vect_angle = angle
        for ( let i in this._container.children ) {
            this._container.children[i].rotation.y = angle
            if (this._container.children[i].basicRotation)
                this._container.children[i].rotation.y += this._container.children[i].basicRotation
        }

        // this._player.rotation.y = angle
        // this._axes.rotation.y = angle
    }

    set scene ( scene ) {
        scene.add( this._container )
        scene.add( this._pointer.container )
    }

    set camera ( camera ) {
        this._camera = camera
        this.follow()
    }

    set position( position ){
        this._container.position.set(position)
    }

    get pointer(){
        return this._pointer
    }

    get container(){
        return this._container
    }

    get position () {
        return this._container.position
    }

    get mesh(){
        return this._player
    }
}