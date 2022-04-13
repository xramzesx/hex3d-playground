// main Level3D class
console.log("loaded : Level3D")

class Level3D {

    constructor( scene ){
        this.scene = scene
        this.frame = 1
        this.lights = []
        this.aureoles = []
        this.fireplaces = []
        this.lightsProp = {
            height : 50,
            diff : 5,
        }
        this.skybox = new THREE.Mesh( 
            Settings.skybox.geometry,
            Settings.skybox.material
        )
        this._allies = []
        this._base = []
        this._player = null
        this._angle = 1

        this._clock = new THREE.Clock()
        this._init_player_position = null
        this.getData();
        
    }

    getData(){
       // pobranie danych levelu ajaxem z serwera
       // i uruchomienie generowania levelu (makeLevel)
        net.sendData( { action : "SELECTED_SAVE" }, '/loadLevel', ( res ) => {
            let data
            try {
                data = JSON.parse(res)
            } catch{
                data = res
            }
            this.size = data.size
            this.level = data.level
       
            this.map = []
       
            console.log(data)
            this.makeLevel()
            
        })
    
    }
 
    set angle ( angle ) {
        if ( angle < 0 )
            angle *= -1
        
        angle %= 360

        this._angle = angle * Math.PI / 180
    }

    get angle ( ) {
        return this._angle
    }
    render ( delta , point ) {
        for (let i in this._allies){
            this._allies[i].render( delta , this.isMoving)
            this._allies[i].hover()
        }

        // this.angle++
        this._angle++
        this._angle %= 360
        const height = 
            this.lightsProp.height +
            (Math.sin( 2* this._angle * Math.PI / 180 ) *
            this.lightsProp.diff);
        
        for (let i in this.lights) {
            this.lights[i].position.y = height >= 0 ? height : 0;
        }

        for (let i in this.fireplaces)
            this.fireplaces[i].update( point )
        
        /// SKYBOX ANIMATION
        this.skybox.rotation.x += 0.001
        this.skybox.rotation.y += 0.001
        this.skybox.rotation.z += 0.001
        this.skybox.position.set (
            point.x,
            point.y,
            point.z
        )
        console.log("isMoving ",this.isMoving)
    }

    makeLevel( scene ) {
        this.scene = scene || this.scene
        
        this.skybox.scale.set(10,10,10)
        // tu wygeneruj level (ściany, światła, itemy) na podstawie danych zwracanych z serwera
        // i
        // - albo zwróć je do sceny w kontenerze
        // - albo wstaw bezpośrednio do sceny, przekazanej w konstruktorze klasy Level3D
        for (let i = 0; i < this.size; i++){
            this.map.push([])
            for (let j = 0; j < this.size; j++){
                this.map[i].push({ dirIn : [] })
            }
        }
        console.log(this.map)
        const { radius } = Settings
        const { width } = Settings.wall.dimensions;
        const level = this.level
        
        for (let i in level){
            level[i].x = +level[i].x
            level[i].z = +level[i].z
            level[i].dirOut = +level[i].dirOut
            level[i].dirIn = +level[i].dirIn
            
            const position = Settings.directions[ level[i].x % 2][ level[i].dirOut ]
            try{
                this.map[position.z + level[i].z][ position.x + level[i].x ].dirIn.push( level[i].dirIn )
            }catch{}
        }
        console.log("map")
        console.log(this.map)

        
        for (let i in level){
            console.log(i)
          
            console.log(level[i].z, level[i].x , 'z', level[i].dirIn, +level[i].dirOut)
            
            const hex = new Hex3D(level[i].dirOut, this.map[level[i].z][level[i].x].dirIn )
            
            console.log(this.map[level[i].z][level[i].x].dirIn, 'c')

            switch( level[i].type ) {
                case "wall" : 
                    break
                    
                case "light" : 
                    const light = new Light()
                    // light.lookAt(hex.position)
                    light.position.y = this.lightsProp.height
                    // light.lookAt(hex.position)
                    this.lights.push(light)
                    hex.add(light)
                    break
                
                case "fireplace":
                    const fireplace = new Fireplace({
                        count : 50,
                        width : 25,
                        castShadow : true,
                        intensity : 10,
                    })
                    this.fireplaces.push(fireplace)
                    fireplace.distance = Settings.radius * 1.75
                    fireplace.position.y = 1
                    hex.add(fireplace)
                    break

                case "enemy" : 
                    const enemy = new AllyModel(75)
                    enemy.load("models/ally_tris.js", ()=>{
                        const vect = new THREE.Vector3(
                            level[i].x * width * 1.5 ,
                            0,
                            level[i].z * radius * 2 + level[i].x % 2 * radius
                        )
                        
                        enemy.position.set( 
                            vect.x,
                            vect.y,
                            vect.z
                        )
                        
                        enemy.move( vect )
                    }, undefined, manager)
                    this._allies.push( enemy )
                    this.scene.add(enemy)
                    this.aureoles.push( enemy.aureole )
                    break
                    
                case "treasure" : 
                    const treasure = new Item3D()

                    hex.add(treasure)
                    break
                
            }

            hex.position.set( 
                level[i].x * width * 1.5 ,
                0,
                level[i].z * radius * 2 + level[i].x % 2 * radius
            )

            this.scene.add(hex)
            this._base.push(hex.base)
            if ( i == 0 ) {
                // const copy = JSON.parse(JSON.stringify())
                this._init_player_position = hex.position.clone()
            }
        }
        console.log(this.map)
        for ( let i in this.fireplaces){
            this.fireplaces[i].isListening = true
            this.fireplaces[i].size = 1.25
        }
        this.scene.add(this.skybox)

    }
 
    // set player ( player ) {
    //     this._player = player
    // }

    get allies ( ) {
        return this._allies
    }

    get base(){
        return this._base
    }
 
    get clock ( ) {
        return this._clock
    }

    get isMoving ( ) {
        return this._player ? this._player._isMoving : false
    }
}