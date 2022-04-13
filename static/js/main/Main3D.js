// Main3D file
console.log('loaded : Main3D.js')

let net

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    $("#root").append(renderer.domElement)

    camera.position.set(100,300,100)
    camera.lookAt(scene.position)

    const orbitControl = new THREE.OrbitControls( camera, renderer.domElement )
    orbitControl.addEventListener('change', ()=>{
        renderer.render(scene, camera)
    })
    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)


    // var geometry = new THREE.CylinderGeometry( 0.8 / Math.sqrt( 2 ), 1 / Math.sqrt( 2 ), 1, 4, 1 ); // size of top can be changed
    // geometry.rotateY( Math.PI / 4 );
    // geometry.rotateX( Math.PI / 2 )
    // geometry.computeFlatVertexNormals();
    // const mesh = new THREE.Mesh( geometry, Settings.wall.material );

    // mesh.scale.set( 100, 100, 10 );
    // mesh.position.set(0,0,0)
    // scene.add(mesh)

    // const gem = new THREE.BoxGeometry(100,100,10)
    // const another = new THREE.Mesh( gem, Settings.materials.wireframe)
    // scene.add(another)
    
    // const test = new Wall3D(0, 0, 100)
    const center = {
        x : 0,
        y : 0,  //additional
        z : 0, 
    }
    // for (let i = 0 ; i < 6; i++)
    // scene.add(new Doors3D(center, i, undefined))
    const hex = new Hex3D(0,[4,1])
    scene.add(hex)

    const light = new Light("spot", 0xffffff)
    light.position.set(
        250,
        200,
        0
    )
    scene.add(light)
    function render(){
        requestAnimationFrame(render)
        renderer.render(scene,camera)
    }

    render()
})