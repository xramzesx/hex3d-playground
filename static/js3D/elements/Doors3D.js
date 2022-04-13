// Doors class
console.log('loaded : Doors3D.js')

class Doors3D extends Wall3D{
    constructor(center, side, type = "OUT", width, showWireframe = false, extend = false){
        super(center, side, width, showWireframe, true);
        this.type = type
        this.container.name = type
        if (!extend){
            this.init(showWireframe)
            this.setSide()
            return this.container
        }
    }

    init(showWireframe){
        const { height, depth } = Settings.wall.dimensions
        const { mesh : wallMesh } = Settings.wall

        const firstWall = wallMesh.clone()
        firstWall.scale.x = 1/3
        firstWall.position.x -= 1/3
        this.container.add(firstWall)
        
        const secondWall = wallMesh.clone()
        secondWall.scale.x = 1/3
        secondWall.position.x += 1/3
        this.container.add(secondWall)
        
        if (showWireframe){
            const { wireframe } = Settings.materials
            const boxGeometry = new THREE.BoxBufferGeometry(1,1,1)
            const wireframeMesh = new THREE.Mesh(boxGeometry, wireframe)
            this.container.add(wireframeMesh)
        }
        this.container.scale.set(this.width, height, depth )
        this.container.position.y = height /2

    }
}