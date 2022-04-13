// Main3D file
console.log('loaded : Main3D.js')

let net
let ui 
let level


$(document).ready(() => {
    net = new Net()
    ui = new Ui()
    
    // const manager = new THREE.LoadingManager()

    // manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    //     console.log(url, itemsLoaded, itemsTotal)
    // }

    const scene = new THREE.Scene()

    let camera = new THREE.PerspectiveCamera (
        100,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    )

    const renderer = new THREE.WebGLRenderer( {antialias : true} )
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
    // orbitControl.addEventListener('change', ()=>{
    //     renderer.render(scene, camera)
    // })
    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)
    scene.fog = new THREE.Fog( 0xff, 2000, 8000 ) 

    

    playerSkin.anisotropy = renderer.getMaxAnisotropy()

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

    const center = {
        x : 0,
        y : 0,  //additional
        z : 0, 
    }

    const ambient = new THREE.AmbientLight( 0xaaaaff , 0.25)
    // const ambient = new THREE.DirectionalLight( 0xaaaaff , 0.25)
    // const ambient = new THREE.HemisphereLight( 0xaaaaff )
    // ambient.castShadow = true
    // ambient.intensity = 0.25
    scene.add( ambient )

    const model = new Model( false )
    
    level = new Level3D(scene)
    level._player = model
    level.aureoles.push(model.aureole)
    model.camera = camera
    model.load('models/tris.js',()=>{
        const vect = new THREE.Vector3(
            level._init_player_position.x,
            level._init_player_position.y,
            level._init_player_position.z
        )
        
        model.scene = scene
        
        model.position.set( 
            vect.x,
            vect.y,
            vect.z
        )
        model.move( vect )
    }, undefined, manager)

    const allies = []

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        
        $("#loading__progress--bar")
            .css('width', `${itemsLoaded / itemsTotal * 100}%` )
        $("#loading__progress--percentage")
            .html(`${ parseInt( itemsLoaded / itemsTotal * 100)} %`)
        $("#loading__info")
            .html( `${url} (${itemsLoaded} / ${itemsTotal})` )
        
    }

    manager.onLoad = () => {
        console.log('sssssssssssssssssss')
        $("#loading")
            .css('opacity', 0)
            .css('pointer-events', 'none')
    }

    // let isAllyActualyClicked = false
    // let dontClick = false
    

    // let check = true

    const stats = new Stats()
    stats.showPanel( 0 )
    $("#ui").append(stats.domElement)


    function render(){
        stats.begin( )
        const delta = level.clock.getDelta()

        model.render( delta )

        level.render( delta, model.position )

        raycaster.setFromCamera(
            events.move.vector,
            camera
        )
        
        //// SELECTING ALLIES ////

        const alliesIntersects = raycaster.intersectObjects( level.allies, true )
        if ( events.check ) {
            if ( alliesIntersects.length > 0 ) {
                const raycast = alliesIntersects[0].object.parent
                                
                if ( !raycast.isSelected ) {
                    raycast.hover (true)

                    if ( events.ally.isClicked ) {
                        raycast.select( model.position )
                        allies.push ( raycast )
                        events.mode = "add_ally"
                    }
                }
            }
        }

        //// SETTING MOVE POINTS ////
        if ( events.mode == "move" ){
            const moveIntersects = raycaster.intersectObjects( level.base , true )
            
            if ( moveIntersects.length > 0 && events.move.isClicked){
                model.move( moveIntersects[0].point )
                events.check = false

            } else {
    
            }
        }

        // const allies = level.allies

        if ( allies.length > 0 ){
            allies[0].move ( model.position )
        }

        for ( let i = 1; i < allies.length; i++ ) {
            allies[ i ].move ( allies[ i - 1 ].position )
        }

        stats.end()
        requestAnimationFrame(render)
        renderer.render(scene,camera)
    }

    render()
})