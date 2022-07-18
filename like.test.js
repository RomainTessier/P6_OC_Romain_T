// on récupère la valeur du like provenant du payload (1|0|-1)
// en fonction de la valeur du like
    // si 0
        // vérifier si l'utilisateur est dans le tableau de likes pour cette sauce
            // si c'est le cas, retirer ce user id du usersLiked array + likes--
        // vérifier si l'utilisateur est dans le tableau de dislikes pour cette sauce
            // si c'est le cas, retirer ce user id du usersDisliked array + dislikes--
    // si -1
        // dislikes++
        // ajouter l'id du user id dans le usersDisliked array
    // what happens if the req payload user id already exists in the usersLiked(Disliked) array ?
    // what if the like value of the req payload is not a number but a string ?

const { likeSauceSync } = require("./controllers/sauces");

describe("likeSauceSync", () => {

    it("given a user who has created a sauce, when he wants to modify the like/dislike data of this sauce, then the function returns false", () => {
        // arrange
        const testSauce = {
            _id: "62c9903e9e277e9891857c80",
            userId: '1',
            name: 'rx7',
            manufacturer: 'nissan',
            description: 'ouiii',
            mainPepper: 'oui',
            imageUrl: 'http://localhost:3000/images/horse_png1657377860428.png',
            heat: 9,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        }
        const testPayload = {
            userId: '1',
            like: 1
        } 
        // act
        const actual = likeSauceSync(testSauce, testPayload);
        // assert
        expect(actual).toEqual(false);
    });

    it("given a sauce, when the like prop of the req payload is equal to 1, then the function should return a sauce with its likes incremented by 1 and usersLiked array should include the payload's user id", () => {
        // arrange
        const testSauce = {
            _id: "62c9903e9e277e9891857c80",
            userId: '2',
            name: 'rx7',
            manufacturer: 'nissan',
            description: 'ouiii',
            mainPepper: 'oui',
            imageUrl: 'http://localhost:3000/images/horse_png1657377860428.png',
            heat: 9,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        }
        const testPayload = {
            userId: '1',
            like: 1
        } 
        const expected = {...testSauce, likes: 1, usersLiked: ['1']};
        // act
        const actual = likeSauceSync(testSauce, testPayload);
        // assert
        expect(actual).toEqual(expected);
    });

});


// let like = 0;
// let dislike = 0;
// const likefct = (param) => {
//     if(param == 1){
//         like++;
//         return like;
//     }
//     else if(param == 0){
//         if(like == 1){
//             like--;
//             return like;
//         }
//         else if(dislike == 1){
//             dislike--;
//             return dislike;
//         }
//     }
//     else if(param == -1){
//         dislike++;
//         return dislike;
//     }
// }
// test('validation de like', () => {
//     likefct(-1);
//     expect(dislike).toBe(1);
//     likefct(0);
//     expect(like).toBe(0);
//     expect(dislike).toBe(0);
// })