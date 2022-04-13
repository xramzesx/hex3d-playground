// Main tested template movement file
console.log('loaded : Main3D.js')

let net
let level

$(document).ready(() => {
    net = new Net()

    const scene = new THREE.Scene()

    let camera = new THREE.PerspectiveCamera (
        100,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    )

    const renderer = new THREE.WebGLRenderer({antialias : true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x121312);

    $(window).resize(function(e){
        renderer.setSize(this.innerWidth, this.innerHeight)
        camera.aspect =this.innerWidth / this.innerHeight
        camera.updateProjectionMatrix()
    })

    renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = THREE.BasicShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    $("#root").append(renderer.domElement)

    camera.position.set(100,300,100)
    camera.lookAt(scene.position)

    // const orbitControl = new THREE.OrbitControls( camera, renderer.domElement )
    // orbitControl.addEventListener('change', () => {
    //     renderer.render(scene, camera)
    // })

    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)
    scene.fog = new THREE.Fog( 0xffffff, 1500, 3000 ) 

    const center = {
        x : 0,
        y : 0,  //additional
        z : 0, 
    }
    
    let selected

    const raycaster = new THREE.Raycaster()
    const events = {
        check : true,
        mode : "move",
        modes : [
            "move",
            "add_ally"
        ],
        move : {
            vector : new THREE.Vector3(0,0,0),
            isClicked : false,
        },
        ally : {
            vector : new THREE.Vector3(0,0,0),
            isClicked : false,
        }
    }

    $( document ).on( 'mousemove', ( e ) => {
        events.move.vector.x =   (e.clientX / $(window).width( ) ) * 2 - 1;
        events.move.vector.y = - (e.clientY / $(window).height() ) * 2 + 1;
    }).on( 'mousedown', ( e ) => {
        events.move.isClicked = true
        events.ally.isClicked = true

        events.ally.vector.x =   (e.clientX / $(window).width( ) ) * 2 - 1;
        events.ally.vector.y = - (e.clientY / $(window).height() ) * 2 + 1;    
    }).on( 'mouseup', ( e ) => {
        events.move.isClicked = false
        events.ally.isClicked = false
        events.mode = events.modes[0]
        events.check = true
    })

    //// PLAYER SETTING UP ////

    const player = new Player( true )
    // scene.add(player.container)
    player.scene = scene
    player.camera = camera
    
    //// FLOOR SETTING UP ///
    
    const floor = new THREE.Object3D()
    floor.add(
    new THREE.Mesh(
        Settings.floor.geometry, 
        Settings.floor.material
    ))
    floor.rotation.x = Math.PI / 2
    scene.add(floor)

    //// ALLY SETTING UP ////

    const ally = new Ally()
    scene.add(ally)
    ally.position.set(200,0,-200)

    const alliesCont = new THREE.Object3D()
    alliesCont.add(ally)
    scene.add(alliesCont)
    
    const allies = []

    function render ( ) {
        player.render ( )
        // ally.render ( )
        
        for (let i in allies){
            allies[i].move(player.position)
            allies[i].render()
        }


        raycaster.setFromCamera(
            events.move.vector,
            camera
        )
        
        //// SELECTING ALLIES ////

        const alliesIntersects = raycaster.intersectObjects( alliesCont.children, true )
        if ( events.check ) {
            if ( alliesIntersects.length > 0 ) {
                const raycast = alliesIntersects[0].object.parent
                                
                if ( !raycast.isSelected ) {

                    if ( events.ally.isClicked ) {
                        raycast.select( player.position )
                        allies.push ( raycast )
                        events.mode = "add_ally"
                    }
                }
            }
        }

        //// SETTING MOVE POINTS ////
        if ( events.mode == "move" ){
            const moveIntersects = raycaster.intersectObjects( floor.children , true )
            
            if ( moveIntersects.length > 0 && events.move.isClicked){
                player.move( moveIntersects[0].point )
                events.check = false

            } else {
    
            }
        }

        // const allies = level.allies

        // if ( allies.length > 0 ){
        //     allies[0].move ( player.position )
        // }

        // for ( let i = 1; i < allies.length; i++ ) {
        //     allies[ i ].move ( allies[ i - 1 ].position )
        // }        
     
        requestAnimationFrame(render)
        renderer.render(scene,camera)
    }

    render()
})