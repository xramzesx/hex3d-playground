// Main tested template movement file
console.log('loaded : Main3D.js')

$(document).ready(()=> {

    const scene = new THREE.Scene()
    const backgroundColor = 0xff
    let camera = new THREE.PerspectiveCamera(
        100,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    )

    const renderer = new THREE.WebGLRenderer( { antialias : true } )
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor ( backgroundColor )

    $( window ).resize( function (e) {
        renderer.setSize( this.innerWidth, this.innerHeight )
        camera.aspect = this.innerWidth / this.innerHeight
        camera.updateProjectionMatrix()
    })

    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    $("#root").append( renderer.domElement )

    camera.position.set( 100, 200, 100 )

    const orbitControl = new THREE.OrbitControls ( camera, renderer.domElement )
    orbitControl.addEventListener('change', () => {
        renderer.render( scene, camera )
    })

    const axes = new THREE.AxesHelper ( 1000 )
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
    
    const fireplaces = []
    const radius = 200

    for (let i = 0; i < 10; i++){
        fireplaces.push(new Fireplace({
            color: 0xfff, 
            count : 50,
            useSprite : true,
            width : 25,
            height : 100,
            blending : true,
            wireframe: false,
            speed : 1,
        }))
        fireplaces[i].position.set(
            Math.sin( Math.PI / 5 * i ) * radius,
            1,
            -Math.cos( Math.PI / 5 * i ) * radius
            
        )
        scene.add(fireplaces[i])    
    }

    const light = new THREE.PointLight( 0xffff, 1 )
    light.position.set(0,1,0)
    scene.add(light)

    $( "#fire-size" ).on('input', function (e) {
        for (let i in fireplaces)
            fireplaces[i].size = $( "#fire-size" ).val() / 100
    })

    const stats = new Stats()
    stats.showPanel(0)
    document.body.appendChild(stats.dom)

    const render = () => {
        stats.begin()
        for (let i in fireplaces){
            fireplaces[i].update()
        }
        stats.end()
        requestAnimationFrame( render )
        renderer.render( scene, camera )
    }


    render()


})