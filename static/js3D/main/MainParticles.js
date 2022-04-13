// Main tested particle file
console.log('loaded : Main3D.js')

let net
let level

$(document).ready(() => {
    net = new Net()

    const scene = new THREE.Scene()
    const backgroundColor = 0 // 0x121312
    let camera = new THREE.PerspectiveCamera (
        100,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    )

    const renderer = new THREE.WebGLRenderer({antialias : true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(backgroundColor);

    $(window).resize(function(e){
        renderer.setSize(this.innerWidth, this.innerHeight)
        camera.aspect =this.innerWidth / this.innerHeight
        camera.updateProjectionMatrix()
    })

    renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = THREE.BasicShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    $("#root").append(renderer.domElement)

    camera.position.set(100,200,100)
    camera.lookAt(scene.position)

    const orbitControl = new THREE.OrbitControls( camera, renderer.domElement )
    orbitControl.addEventListener('change', () => {
        renderer.render(scene, camera)
    })

    const axes = new THREE.AxesHelper( 1000 )
    scene.add( axes )
    scene.fog = new THREE.Fog( backgroundColor, 1500, 3000 ) 
   
    const floorMaterial = new THREE.MeshPhongMaterial({
        color : 0xffffff,
        side : THREE.BackSide,
        shininess : 100,
    })

    const floor = new THREE.Object3D()
    floor.add(
        new THREE.Mesh(
        Settings.floor.geometry, 
        floorMaterial
    ))

    floor.rotation.x = Math.PI / 2
    floor.scale.set(10,10,10)
    scene.add( floor )
    
    let meshCount = 1
    let speed = 1

    let maxHeight = 100
    let maxWidth = 0
    let particleScale = 1
    let wireframe = true
    let intensity = 10
    let opacity = false
    let blending = false

  
    const fire = new Fireplace({
        count : 10,
        useSprite : false,
        speed : speed,
        wireframe : true,
        color : 0xfff
    })
    fire.position.set( 0, 20, 0 )
    scene.add(fire)


    $("#mesh-count").on('input', ( e ) => {
        const count = $("#mesh-count").val()
        $("#mesh-counter").html( count )
        fire.count = count
    })

    $("#mesh-width").on('input', ( e ) => {
        maxWidth = $("#mesh-width").val()
        intensity = $("#mesh-width").val() /10 + 10
        fire.width = maxWidth
    })

    $("#mesh-speed").on('input', ( e ) => {
        speed = $("#mesh-speed").val()
        speed = speed == 0 ? 1 : speed
    })

    $("#mesh-speed").on('input', ( e ) => {
        speed = $("#mesh-speed").val()
        speed = speed == 0 ? 1 : speed
        fire.speed = speed
    })
    $("#wireframe").on('input', ( e ) => {
        wireframe = !wireframe

        fire.wireframe = wireframe
    })
    $("#blending").on('input', ( e ) => {
        blending = !blending
        fire.blending = blending
    })
    $("#opacity").on('input', ( e ) => {
        opacity = !opacity

        fire.opacity = opacity
    })


    const stats = new Stats()
    stats.showPanel( 0 )
    document.body.appendChild(stats.dom)

    function render ( ) {
        stats.begin()

        fire.update()
        stats.end()
        requestAnimationFrame(render)
        renderer.render(scene,camera)
    }

    render()
})