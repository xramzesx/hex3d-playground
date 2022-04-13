const manager = new THREE.LoadingManager()
const playerSkin = new THREE.TextureLoader().load("mats/player_skin.png")
const wallMaterial = [
    new THREE.MeshPhongMaterial({
        color : 0xffffff,
        // color : 0x181818,
        shininess: 50,
        side: THREE.FrontSide,
        shadowSide: THREE.DoubleSide,
        bumpScale : 10,
        bumpMap : new THREE.TextureLoader(manager).load("mats/brick_bump_side.png"),
        map : new THREE.TextureLoader(manager).load("mats/brick_bump_side.png")
        // map: new THREE.TextureLoader().load("mats/grasstop.jpg"),
    }),
    new THREE.MeshPhongMaterial({
        color : 0xffffff,
        // color : 0x181818,
        shininess: 50,
        side: THREE.FrontSide,
        shadowSide: THREE.DoubleSide,
        bumpScale : 10,
        bumpMap : new THREE.TextureLoader(manager).load("mats/brick_bump_side.png"),
        map : new THREE.TextureLoader(manager).load("mats/brick_bump_side.png")
        // map: new THREE.TextureLoader().load("mats/grasstop.jpg"),
    }),
    new THREE.MeshPhongMaterial({
        color : 0xffffff,
        // color : 0x181818,
        shininess: 50,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide,
        // bumpScale : 10,
        bumpMap : new THREE.TextureLoader(manager).load("mats/brick_bump_top.png"),
        map : new THREE.TextureLoader(manager).load("mats/brick_bump_top.png"),
        // map : new THREE.TextureLoader().load("mats/brick_bump_top.png")
        // map: new THREE.TextureLoader().load("mats/grasstop.jpg"),
    }),
    new THREE.MeshPhongMaterial({
        color : 0xffffff,
        // color : 0x181818,
        shininess: 50,
        side: THREE.FrontSide,
        shadowSide: THREE.DoubleSide,
        bumpScale : 10,
        bumpMap : new THREE.TextureLoader(manager).load("mats/brick_bump_side.png"),
        map : new THREE.TextureLoader(manager).load("mats/brick_bump_side.png")
        // map: new THREE.TextureLoader().load("mats/grasstop.jpg"),
    }),
    new THREE.MeshPhongMaterial({
        color : 0xffffff,
        // color : 0x181818,
        shininess: 50,
        side: THREE.FrontSide,
        shadowSide: THREE.DoubleSide,
        bumpScale : 10,
        bumpMap : new THREE.TextureLoader(manager).load("mats/brick_bump.jpg"),
        map : new THREE.TextureLoader(manager).load("mats/brick_bump.jpg")
        // map: new THREE.TextureLoader().load("mats/grasstop.jpg"),
    }),
    new THREE.MeshPhongMaterial({
        color : 0xffffff,
        // color : 0x181818,
        shininess: 50,
        side: THREE.FrontSide,
        shadowSide: THREE.DoubleSide,
        bumpScale : 10,
        bumpMap : new THREE.TextureLoader(manager).load("mats/brick_bump.jpg"),
        map : new THREE.TextureLoader(manager).load("mats/brick_bump.jpg")
        // map: new THREE.TextureLoader().load("mats/grasstop.jpg"),
    }),
]

const Settings = {
    radius : 200,
    wall : {
        dimensions: {
            width: this.radius / Math.sqrt(3),     // x    //additional
            height: 100,    // y
            depth: 10 ,     // z
        },
        material : wallMaterial ,
        geometry : new THREE.BoxBufferGeometry(1,1,1),
        // geometry : new THREE.CylinderGeometry( 0.8 / Math.sqrt( 2 ), 1 / Math.sqrt( 2 ), 1, 4, 1),
    },
    base : {
        dimensions : { },
        material : new THREE.MeshStandardMaterial({
            color: 0xff,
            shininess : 100,
            side : THREE.FrontSide,
            shadowSide: THREE.DoubleSide,
            rougness: 0.5,
            metalness: 0.75,
            // transparent : true,
            // alphaMap : new THREE.TextureLoader().load("mats/floor_texture.jpg"),
            // map : new THREE.TextureLoader().load("mats/floor_texture.jpg"),
            // bumpScale : 5,
            
            // bumpMap : new THREE.TextureLoader().load("mats/floor_texture.jpg"),
            bumpMap : new THREE.TextureLoader(manager).load("mats/White_hexagonal_tiles_01_1K_AO.png"),
            map : new THREE.TextureLoader(manager).load("mats/White_hexagonal_tiles_01_1K_AO.png"),
        }),
        // geometry : new THREE.CylinderGeometry(1,1,6,6)
        geometry : new THREE.CircleGeometry(1,6)
    },
    materials : {
        wireframe : new THREE.MeshBasicMaterial({
            wireframe : true,
            color : 0xffffff,
        })
    },
    light : {
        color: 0xfff0ff,
        geometry : new THREE.IcosahedronGeometry(5, 0),
        material : new THREE.MeshLambertMaterial({
            color : 0x0d9aff,
            // specular : 0xffffff,
            // side: THREE.FrontSide,
            // wireframe : true,
            transparent : true,
            emissive : 0x0d9aff,
            emissiveIntensity : 10,
        }),
    },
    treasure : {
        geometry : new THREE.BoxBufferGeometry(1,1,1),
        material : new THREE.MeshPhongMaterial({
            color: 0xffffaa ,
            map : new THREE.TextureLoader(manager).load("mats/crate1_diffuse.png"),
            bumpScale : 10,
            bumpMap : new THREE.TextureLoader(manager).load("mats/crate1_bump.png"),
            shadowSide : THREE.FrontSide,
            side : THREE.FrontSide,
        }),
    },
    player : {
        geometry : new THREE.BoxBufferGeometry(1,1,1),
        material : new THREE.MeshPhongMaterial({
            color : 0xff00ff,
            emissive : 0xff00ff,
            side : THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
            wireframe : true
        }),
        model : {
            material : new THREE.MeshStandardMaterial({
                map : playerSkin,
                // map : new THREE.TextureLoader().load("mats/player_skin.png"),
                metalness : 0.75,
                rougness : 0.5,
                morphTargets: true,
                bumpScale : 10,
                // shininess : 100,
                // displacementScale : 1,
                bumpMap : new THREE.TextureLoader(manager).load("mats/player_ambientOcc_map.png"),
                // displacementMap : new THREE.TextureLoader().load("mats/player_displacement_map.png"),
                shadowSide : THREE.FrontSide,
                side : THREE.FrontSide,
            }),
            scale : 1.5,
        } 
    },
    ally : {
        material : new THREE.MeshStandardMaterial ({
            shadowSide: THREE.FrontSide,
            side : THREE.FrontSide,
            morphTargets : true,
            rougness : 1,
            metalness : 0.75,
            shininess : 100,
            bumpScale : 10,
            map : new THREE.TextureLoader(manager).load("mats/ally_skin.png"),
            bumpMap : new THREE.TextureLoader(manager).load("mats/ally_ambientOcclusion.png")
        }),
        ring : {
            geometry : new THREE.RingGeometry ( 2,3,3 ) , 
            material : {
                texture : new THREE.MeshPhongMaterial ( {
                    color : 0xfff,
                    emissive : 0xffff00,
                    transparent : true,
                    // alphaMap : new THREE.TextureLoader().load("mats/test_alpha.png"),
    
                    // transparent: true,
                    // alphaMap : new THREE.TextureLoader().load("mats/next_alpha.png"),
                }),
                border : new THREE.MeshPhongMaterial ({
                    color : 0xfff,
                    emissive : 0xffff00,
                    wireframe : true,
                })
            } 
        }
    },
    floor : {
        geometry : new THREE.PlaneBufferGeometry(1000,1000),
        material : new THREE.MeshPhongMaterial({
            color : 0xffffff,
            emissive : 0xffffff,
            side : THREE.DoubleSide,
            shininess : 100,
        })
    },
    pointer: {
        geometry : new THREE.IcosahedronGeometry(5,0),
        material : new THREE.MeshPhongMaterial({
            color : 0xff,
            emissive : 0xff,
            wireframe : true
        })
    },
    particle : {
        geometry : new THREE.BoxBufferGeometry(10,10,10),
        material : new THREE.MeshBasicMaterial({
            color : 0xffff,
            transparent : true,
            opacity : 0.5,
            depthWrite : false,
            blending : THREE.AdditiveBlending
        }),
        sprite : new THREE.SpriteMaterial({
            size : 1,
            color : 0x00aaff,
            // sizeAttenuation : false,
            transparent : true,
            depthWrite : false,
            blending : THREE.AdditiveBlending,
            map : new THREE.TextureLoader(manager).load( "mats/fire_particle.png" )
        }),
        max : {
            height : 100,
            width : 0
        }
    },
    camera : {
        position : new THREE.Vector3(0,10,10)
    },
    skybox: {
        geometry : new THREE.CubeGeometry(1000,1000,1000),
        material : [
            new THREE.MeshBasicMaterial({ fog: true, emissive : 0x222222, color : 0xffffff, side : THREE.BackSide, map : new THREE.TextureLoader(manager).load("mats/skybox/front.png") }),
            new THREE.MeshBasicMaterial({ fog: true, emissive : 0x222222, color : 0xffffff, side : THREE.BackSide, map : new THREE.TextureLoader(manager).load("mats/skybox/back.png") }),
            new THREE.MeshBasicMaterial({ fog: true, emissive : 0x222222, color : 0xffffff, side : THREE.BackSide, map : new THREE.TextureLoader(manager).load("mats/skybox/top.png") }),
            new THREE.MeshBasicMaterial({ fog: true, emissive : 0x222222, color : 0xffffff, side : THREE.BackSide, map : new THREE.TextureLoader(manager).load("mats/skybox/bottom.png") }),
            new THREE.MeshBasicMaterial({ fog: true, emissive : 0x222222, color : 0xffffff, side : THREE.BackSide, map : new THREE.TextureLoader(manager).load("mats/skybox/left.png") }),
            new THREE.MeshBasicMaterial({ fog: true, emissive : 0x222222, color : 0xffffff, side : THREE.BackSide, map : new THREE.TextureLoader(manager).load("mats/skybox/right.png") }),
        ]
    },
    clones : [],    //for mapping
    directions : [
        [
            { x : 0,  z : -1 },   // 0
            { x : 1,  z : -1 },   // 1
            { x : 1,  z : 0  },   // 2
            { x : 0,  z : 1  },   // 3
            { x : -1, z : 0  },   // 4
            { x : -1, z : -1 },   // 5
        ],
        [
            { x : 0,  z : -1},    // 0
            { x : 1,  z : 0 },    // 1
            { x : 1,  z : 1 },    // 2
            { x : 0,  z : 1 },    // 3
            { x : -1, z : 1 },    // 4
            { x : -1, z : 0 },    // 5
        ]
    ],
}

function getRandom (from, to){
    min = Math.ceil(from);
    max = Math.floor(to);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//// ADDITIONAL SETTINGS ////

const { geometry, material } = Settings.wall
Settings.wall.mesh = new THREE.Mesh( geometry, material )
Settings.wall.mesh.receiveShadow = true
Settings.wall.mesh.castShadow = true
Settings.wall.dimensions.width = Settings.radius * 2/ Math.sqrt(3)

Settings.base.geometry.rotateY(Math.PI / 6)
const { geometry : baseGeom, material : baseMat } = Settings.base
Settings.base.mesh = new THREE.Mesh(baseGeom, baseMat)
// Settings.base.mesh.rotation.x = Math.PI /4
Settings.base.mesh.rotation.y -= Math.PI /6
Settings.base.mesh.rotation.x -= Math.PI /2
Settings.base.mesh.receiveShadow = true
Settings.base.mesh.castShadow = true

const { geometry : treasureGeom, material : treasureMat } = Settings.treasure
Settings.treasure.mesh = new THREE.Mesh(treasureGeom, treasureMat)
Settings.treasure.mesh.receiveShadow = true
Settings.treasure.mesh.castShadow = true