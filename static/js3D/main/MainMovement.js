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
    const mouseVector = new THREE.Vector2()
    let isClicked = false

    let clickedVect = new THREE.Vector3(0,0,0)
    let directionVect = new THREE.Vector3(0,0,0)

    $("#root").on('mousemove', ( e ) => {
        mouseVector.x =   (e.clientX / $(window).width( ) ) * 2 - 1;
        mouseVector.y = - (e.clientY / $(window).height() ) * 2 + 1;
    }).on('mousedown', ( e ) => {
        isClicked = true
    }).on('mouseup', ( e ) => {
        isClicked = false
    })



    const player = new Player( true )
    // scene.add(player.container)
    player.scene = scene
    player.camera = camera
    const floor = new THREE.Object3D()
    floor.add(
    new THREE.Mesh(
        Settings.floor.geometry, 
        Settings.floor.material
    ))
    floor.rotation.x = Math.PI / 2
    scene.add(floor)

    function render(){
        player.render()

        raycaster.setFromCamera(mouseVector, camera)
        
        const intersects = raycaster.intersectObjects( floor.children , true)
        
        if ( intersects.length > 0 && isClicked) {
            // console.log(intersects)
            // console.log(intersects[0].point)
            player.move(intersects[0].point)
            // intersects[0].object.parent.rotation.y += 0.01
        } else {
            // isClicked = false
            console.log('siema')
        }
        
        requestAnimationFrame(render)
        renderer.render(scene,camera)
    }

    render()
})