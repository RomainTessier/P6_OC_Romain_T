const Sauces = require('../models/sauces');
const auth = require('../middleware/auth');
const fs = require('fs');

exports.postSauce = (req,res,next) =>{
    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    if(req.body.name.value.match("/^[a-zA-Z0-9\s,.'-]{3,}$/") && req.body.description.value.match("/^[a-zA-Z0-9\s,.'-]{3,}$/") && req.body.mainPepper.value.match("/^[a-zA-Z0-9\s,.'-]{3,}$/")){
        const sauce = new Sauces ({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes:0,
            usersLiked:[],
            usersDisliked : []
        });
        sauce.save()
        .then(sauce => {
            res.status(201).json({message : 'sauce créée'})
        })
        .catch(error => res.status(400).json({message : error}));
    } else {
        res.status(400).json({message : 'Un des champs est invalide'})
    };
};

exports.getSauce = (req,res) =>{
    Sauces.find()
    .then(sauces => {
        res.status(200).json(sauces);
        console.log(sauces)
    })
    .catch(err => res.status(400).json({ err }))
}

exports.getSauceId = (req,res) =>{
    Sauces.findOne({_id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(err => res.status(400).json({ err }))
}

exports.putSauce = async (req,res) =>{
    let sauce = await Sauces.findOne({_id: req.params.id});
    console.log(sauce.imageUrl)
    console.log(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`);
    if(sauce.imageUrl != `${req.protocol}://${req.get('host')}/images/${req.file.filename}`){        
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            console.log("ouii");
            Sauces.updateOne({_id:req.params.id}, {...req.body, _id : req.params.id, imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
            .then(() => res.status(200).json({message : 'sauce supprimée'}))
            .catch(err => res.status(400).json({err}))
        })
    } else {
        Sauces.updateOne({_id:req.params.id}, {...req.body, _id : req.params.id})
        .then(() => res.status(200).json({message : 'objet modifié'}))
        .catch(err => res.status(400).json({err}))
    }
    
}

exports.deleteSauce = (req,res) =>{
    Sauces.findOne({_id: req.params.id})
    .then(sauce => {
        if(sauce.userId != req.auth.userId){
            res.status(401).json({message : 'Vous n\'avez pas le droit de supprimer cette sauce'})
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message : 'sauce supprimée'}))
                .catch(err => res.status(400).json({err}))
            })
        }
    })
    .catch(err => res.status(400).json({ err }))
    Sauces.deleteOne({_id:req.params.id})
    .then(() => res.status(200).json({message : 'objet supprimé'}))
    .catch(err => res.status(400).json({err}))
}

// exports.likeSauceSync = (sauce, likePayload) => {
//     if(likePayload.userId === sauce.userId) {
//         return false;
//     }
//     if(likePayload.like == 1){
//         sauce.likes++;
//         sauce.usersLiked.push(likePayload.userId);
//     } else if(likePayload.like == 0){
//         if(sauce.usersLiked.includes(likePayload.userId)){
//             sauce.usersLiked.splice(sauce.usersLiked.indexOf(likePayload.userId),1);
//             sauce.likes--;
//         } else if(sauce.usersDisliked.includes(likePayload.userId)){
//             sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(likePayload.userId),1);
//             sauce.dislikes--;
//         }
//     } else if(likePayload.like == -1){
//         sauce.dislikes++;
//         sauce.usersDisliked.push(likePayload.userId);
//     }
//     return sauce;
// }

exports.likeSauce = async (req,res) => {
    let sauce;
    try {
        sauce = await Sauces.findOne({_id: req.params.id});
    } catch {
        res.status(500).json({message: "Il y a eu un problème veuillez réessayer"});
        return;
    }

    if(req.body.userId != sauce.userId){
        Sauces.updateOne({_id: req.params.id}, sauce)
            .then(() => res.status(200).json({message: "Sauce modifiée"}))
            .catch(err => res.status(400).json({err}))
    } else {
        res.status(401).json({message: "Vous ne pouvez pas liker votre propre sauce"});
    }
}






