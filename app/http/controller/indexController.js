

const indexControler = () => {
    return {
        home(req, res) {
            res.render("home")
        },
    }
}

module.exports = indexControler