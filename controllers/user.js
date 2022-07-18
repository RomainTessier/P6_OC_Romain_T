
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(mongoDBRes => { console.log(mongoDBRes); res.status(201).json({ message: 'Utilisateur créé !'})})
            .catch(error => res.status(400).json({ error}));
    })
    .catch(err => res.status(500).json({error: err}));
};

exports.login = (req, res) => {
    console.log(req.body);
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        res.status(401).json({ error: 'Mot de passe incorrect !'});
                    } else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                process.env.JWT_KEY,
                                { expiresIn: '1h' }
                            )
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({error: error}); 
                }); 
        })
    .catch(error => res.status(500).json({error: error}));
};