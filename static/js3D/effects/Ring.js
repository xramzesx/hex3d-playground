// RING FOR ALLY
console.log("loaded : Ring.js")

class Ring extends THREE.Object3D {
    constructor ( radius = Settings.radius / 5) {
        super ()
        // super (
        //     Settings.ally.ring.geometry,
        //     Settings.ally.ring.material
        // )

        //// ROTATION ELEMENTS ////
        this._mesh = new THREE.Mesh(
            Settings.ally.ring.geometry,
            Settings.ally.ring.material.texture
        )
        this._border = new THREE.Mesh(
            Settings.ally.ring.geometry,
            Settings.ally.ring.material.border
        )
        
        this.add(this._mesh)
        this.add(this._border)

        //// SETTING IT UP ////
        for (let i in this.children )
            this.children[i].scale.set(
                radius + ( i * 3 ),
                radius + ( i * 3 ),
                radius + ( i * 3 )
            )
        
        this._angle = 1
        
        // this._mesh.scale.set(
        //     radius,
        //     radius,
        //     radius
        // )
        this.position.set(0,1,0)
        this.rotation.x += Math.PI/2
    }

    set hover ( hover ) {
        // console.log(hover)
        const { sin, abs, PI} = Math
        const { deg } = THREE
        
        this._angle = ++this._angle % 360
        this.rotation.z += abs( 1 + sin ( this._angle * PI / 180 ) )/25
        this.visible = hover
    }

    get hover ( ) {
        return this.visible
    }
}