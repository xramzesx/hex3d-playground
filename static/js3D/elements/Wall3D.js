// Wall3D.js
console.log('loaded : Wall3D.js')

class Wall3D {
    constructor(center, side, width, showWireframe = false, extend = false){
        const { width : defWidth } = Settings.wall.dimensions


        this.center = center
        this.side = side
        this.width = width || defWidth
        this.container = new THREE.Object3D()
        if( !extend ){
            this.init(showWireframe)
            this.setSide(side)
            return this.container
        }
    }

    init(showWireframe){
        const { height, depth } = Settings.wall.dimensions
        const { mesh : wallMesh } = Settings.wall

        const wall = wallMesh.clone()// new THREE.Mesh(geometry, material)
        this.container.add(wall)
        
        if (showWireframe){
            const { wireframe } = Settings.materials
            const boxGeometry = new THREE.BoxBufferGeometry(1,1,1)
            const wireframeMesh = new THREE.Mesh(boxGeometry, wireframe)
            this.container.add(wireframeMesh)
        }
        this.container.scale.set(this.width, height, depth )
        this.container.position.y = height /2

    }

    setSide( side ){
        const { depth } = Settings.wall.dimensions
        const radius = Settings.radius - depth/2

        this.side = side || this.side
        const angle = this.side * Math.PI / 3 
        this.container.position.x = 
            this.center.x + radius * Math.sin( angle );
        
        this.container.position.z =
            this.center.z + radius * Math.cos( angle );
        // console.log(this.side)
        // this.container.rotation.y = (this.side +1) * Math.PI / 3
        this.container.rotation.y = (this.side * 60 + 180 ) * Math.PI / 180 
    }

    setCenter( point ){
        this.center = point
        this.setSide()
    }
}