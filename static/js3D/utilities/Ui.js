// user interface
console.log("loaded : Ui.js")

class Ui{
    constructor(){
        this.events()
    }

    events(){
        $("#light-intensity").on('input',()=>{
            for (let i in level.lights){
                level.lights[i].children[0].intensity = $("#light-intensity").val() /100
            }
            console.log(level.lights)
        })
        $("#light-height").on('input',()=>{
            // for (let i in level.lights){
            //     level.lights[i].position.y = $("#light-height").val()
            // }
            level.lightsProp.height = $("#light-height").val() / 2
            console.log(level.lightsProp.height)
            console.log(level.lights)
        })
        $("#characters-light-intensity").on('input', (e) => {
            const intensity = $("#characters-light-intensity").val()
            for (let i in level.aureoles)
                level.aureoles[i].intensity = intensity
        })
        $("#camera-height").on('input', (e) => {
            // console.log(e)
            const value = +$("#camera-height").val()
            Settings.camera.position.y = value
            Settings.camera.position.z = value
        })
    }

}