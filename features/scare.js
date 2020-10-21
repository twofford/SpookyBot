module.exports = controller => {

    controller.hears("spooktacular", "message", async () => {
        console.log('Ahh!')
        // const skull = document.getElementById("scary")
        // skull.style.display = "block";
    })
}