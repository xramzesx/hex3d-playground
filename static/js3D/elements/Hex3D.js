//
console.log('loaded : Hex3D.js')

class Hex3D {
    constructor( doorOut, doorIn , center = {x:0,z:0}){
        const { radius } = Settings
        const { depth } = Settings.wall.dimensions
        
        this.item = null

        this.center = center
        // console.log(center)
        this.radius = radius
        this.container = new THREE.Object3D()
        this.doors = {
            in : Array.isArray( doorIn ) ? doorIn : [ doorIn ],
            out : parseInt(doorOut)
        }

        const doors = JSON.parse(JSON.stringify(this.doors.in))
        doors.push(this.doors.out)
        this.doors.all = doors
        this.walls = { 
            all : []
        }
        
        for (let i = 0; i < 6; i++){
            if ( !this.doors.all.includes( i ) ) {
                this.walls.all.push(i)
                console.log(i)
            }
        }
        // console.log('doors:')
        // console.log(this.doors.in)
        // console.log(this.doors.all)
        // console.log('walls :')
        // console.log(this.walls.all)
        
        for (let i in this.doors.all){
            this.container.add(
                new Doors3D(
                    this.center,
                    this.doors.all[i],
                    this.doors.all[i] == this.doors.out ? "OUT" : "IN"
                )
            )
        }

        for (let i in this.walls.all){
            this.container.add(
                new Wall3D(
                    this.center,
                    this.walls.all[i]
                    )
                )
        }

        const base = Settings.base.mesh.clone()
        base.scale.set (
            2 * radius / Math.sqrt(3),
            2 * radius / Math.sqrt(3),
            2 * radius / Math.sqrt(3)
        )
        // base.scale.set(2 * radius / Math.sqrt(3), 0.000001, 2 * radius / Math.sqrt(3) )
        this.container.base = base
        this.container.add(base)

        this.container.receiveShadow = true
        this.container.castShadow = true
        this.container.scale.set(1,1,-1)
        return this.container
    }

    setItem(type){

        switch (type){
            case "wall":
                return;
            case "enemy":
                break
            case "treasure":
                break
            case "light":
                this.item = new Light()
                break
        }

    }
}