// import * as THREE from "/js/three.js"
// import * as THREE from "/js/three.js"

// export let test = 'XD'
class Light {
    constructor( type = 'spot', scene, color = 0xffffff, size ){
        this.scene = scene
        this.color = color
        this.type = type
        // pusty kontener na inne obiekty
        this.container = new THREE.Object3D()
        this.container.position.set(0,0,0)
        scene.add(this.container)
        console.log('testdawdwdwdwadwdw')
        this.init(type)
    }

    init (type) {
        switch( type ) {
            case "spot":
            case "spotlight":
                //  kolor, intensity, distance, angle
                this.light = new THREE.SpotLight( this.color, 2, 1000, Math.PI / 4 )
                break
            case "point":
            case "pointlight":
                this.light = new THREE.PointLight( this.color, 2, 500, Math.PI / 8 )
                break
            default: 
                throw new Error
                break
        }
        this.light.position.set(0,0,0)
        this.light.intensity = 1
        this.light.castShadow = true

        this.light.shadow.mapSize.width = 2048;  // default
        this.light.shadow.mapSize.height = 2048; // default
        this.light.shadow.camera.near = 0.5;       // default
        this.light.shadow.camera.far = 5000      // default
        this.light.shadow.camera.fov = 100
        this.light.shadow.bias = - 0.005
        this.light.shadow.radius = 8
        // this.light.shadow.bias = 1000
        this.container.add(this.light)
        
        const material = new THREE.MeshBasicMaterial({
            color : this.color,
            // specular : 0xffffff,
            // side: THREE.DoubleSide,
            wireframe : true
        })
        const icosahedronGeometry = new THREE.IcosahedronGeometry(5, 0)
        this.mesh = new THREE.Mesh(icosahedronGeometry, material)
        this.container.add(this.mesh)
    }

    
    getLight() { return this.container }
    changeColor(color) { 
        this.mesh.material.color.setHex( color ) 
        this.light.color.setHex( color )
        this.color = color
    }
    setX(x){ this.container.position.x = x }
    setY(y){ this.container.position.y = y }
    setZ(z){ this.container.position.z = z }

    setIntensity(intensity){ this.light.intensity = intensity }
    setTarget(target) { this.light.target = target }
    setCirclePosition(radius, degree){
        this.container.position.z = radius * Math.cos( degree * Math.PI / 180 )
        this.container.position.x = radius * Math.sin( degree * Math.PI / 180 )
    }
}