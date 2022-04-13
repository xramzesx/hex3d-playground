console.log("loaded : AllyTest.js")

class Ally extends THREE.Object3D {

    constructor ( 
            distance = Settings.wall.dimensions.width / 3,
            showHelpers = true
        ){
        super()
        
        //// DEFAULTS ////        
        this._distance = distance
        let scale = Settings.wall.dimensions.width / 6

        //// BOOLS ////
        this._isMoving = false
        this._isSelected = false

        //// MESH ////

        this._mesh = new THREE.Mesh(
            new THREE.SphereGeometry(scale, 10,10),
            new THREE.MeshBasicMaterial ( { 
                color : 0x0,
                wireframe:true, 
            } )
        )

        //// AXES ////
        this._axes = new THREE.AxesHelper(200)

        //// POSITIONING ////

        this._mesh.position.y = scale 
        this._axes.position.y = scale 

        //// MERGING ////
        if ( showHelpers ) {
            this.add ( this._mesh )
            this.add ( this._axes )
        }


        //// VECTORS ////
        this._pointer = null
        this._pointer = new Pointer ( false ) 
        this._vect = {
            direction : new THREE.Vector3 ( 0 , 0 , 0 ),
            pointed   : new THREE.Vector3 ( 0 , 0 , 0 ),
            speed     : 5,

            angle : 0,
        }
    }

    move ( point ) {
        if ( point != undefined )
            this._pointer.position = point
        this._vect.pointed = this._pointer.position.clone()
        this._vect.direction = 
            this._vect
                .pointed
                    .clone ( ) 
                        .sub( this.position )
                            .normalize ( );
        
        this.angle = Math.atan2(
            this.position.clone().x - this._vect.pointed.x,
            this.position.clone().z - this._vect.pointed.z
        )
    }

    render ( ) {
        const difference = 
            this.position
                .clone ( )
                    .distanceTo ( 
                        this._vect.pointed
                    )
        
        this._isMoving = difference - this._vect.speed >= this._distance

        if (this._isMoving)
            this.translateOnAxis(
                this._vect.direction,
                this._vect.speed
            )
        // else
        //     this.position.set (
        //         this.distance + this._vect.pointed.x,
        //         this.distance + this._vect.pointed.y,
        //         this.distance + this._vect.pointed.z
        //     )
    }

    set angle ( angle ){
        angle -= Math.PI
        this._vect.angle = angle

        for ( let i in this.children ) {
            this.children[i].rotation.y = angle
            if ( this.children[i].basicRotation )
                this.children[i].rotation.y += 
                    this.children[i]
                        .basicRotation;
        }
    }

    select ( point ) {
        if ( !this._isSelected ){
            this._isSelected = true
            this.move ( point )
        }
    }

    get isSelected(){
        return this._isSelected
    }
}