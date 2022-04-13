// treasure item
console.log("loaded : Item.js")

class Item3D{
    constructor(){
        this.container = new THREE.Object3D()
        const { width } = Settings.wall.dimensions
        const { geometry, material } = Settings.treasure
        const treasure = Settings.treasure.mesh.clone()
        treasure.scale.set(width/4, width/4, width/4)
        treasure.position.y = width/8

        this.container.add(treasure)
        return this.container
    }
}