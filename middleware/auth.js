const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID non valide";
        } else {
            next();
        }
    } catch { res.status(401).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette ressource' }); }
};