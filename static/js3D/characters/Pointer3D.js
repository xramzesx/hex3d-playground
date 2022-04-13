// wskaźnik do wskazywania pozycji
console.log('loaded : Pointer.js')

class Pointer {
    constructor ( showHelpers = false){
        this._position = new THREE.Vector3(0,0,0)
        this._container = new THREE.Object3D()

        if ( showHelpers ) {
            const { geometry, material } = Settings.pointer
            this._mesh = new THREE.Mesh(geometry, material)
            this._mesh.scale.set(5,5,5)
            this._container.add(this._mesh)
        }
    }

    set position ( position ) {
        this._position = position
        this._position.y = 0
        // console.log(position)
        this._container.position.set(
            this._position.x,
            this._position.y,
            this._position.z
        )
        
    }

    get position ( ) {
        return this._position
    }

    get container ( ) {
        return this._container
    }
}