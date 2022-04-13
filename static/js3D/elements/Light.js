// light class
console.log("loaded : Light.js")

class Light {
    constructor(type = "point", color = Settings.light.color, showMesh = true){
        this.container = new THREE.Object3D()
        // let showMesh = true
        switch( type ) {
            case "spot":
            case "spotlight":
                //  color, intensity, distance, angle
                this.light = new THREE.SpotLight( color, 2, 1000, Math.PI/2.5  )
                break
            case "point":
            case "pointlight":
                this.light = new THREE.PointLight( color, 2, 5000, Math.PI / 2 )
                // this.light.lookAt(this.container.position)
                break

            case "ambient":
            case "ambientlight":
                this.light = new THREE.AmbientLight( color )
                showMesh = false
                break
            default: 
                throw new Error
                break
        }
        this.container.add(this.light)
        console.log(color)

        this.light.castShadow = true
        this.light.shadow.mapSize.width = 2048 ;  // default
        this.light.shadow.mapSize.height = 2048 ; // default
        this.light.shadow.camera.near = 0.5;       // default
        this.light.shadow.camera.far = 5000      // default
        this.light.shadow.bias = -0.005
        this.light.shadow.radius = 8
        // this.light.shadow.camera.fov = 0
        // this.light.shadow.camera.fov = 100
        
        const { geometry, material } = Settings.light
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.visible = showMesh
        this.container.add(this.mesh)

        this.container.isLight = true

        // this.container.position.set(0,302,0)
        return this.container
    }
}