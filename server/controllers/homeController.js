const home = async (req, res) => {
    try {

        res.status(200).json({ username: req.username })
    }
    catch (err) {
        return res.status(401).json({ message: ` ${err}` });
    }
}
module.exports = {home};