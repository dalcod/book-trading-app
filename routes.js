var express = require('express');
var path = require('path');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var request = require('request');
var router = express.Router();

var User = require('./model/user');
var Books = require('./model/books');
var key = require('./secretKey');

function findAndRemove(arr, objToRemove){
    arr.forEach(function(elem, i){
        if (elem.title === objToRemove.title) {
            arr.splice(i, 1);
        }
    });
    var arr1 = arr.filter(function(elem){ return elem !== undefined; });
    return arr1;
}

// effettua una richiesta alla google API tramite proxy per il libro passato nei parametri della url e salva la risposta nel database dopo averla aumentata con una proprietà username, in modo tale da distinguere tra i vari libri chi è il proprietario. 
router.get('/book/:username/:book', passport.authenticate('jwt', {session: false}), function(req, res){
    var bookName = req.params.book;
    var username = req.params.username;
    var url = 'https://www.googleapis.com/books/v1/volumes?q=' + bookName + '&key=' + key.googleKey;
    request.get({url: url}, function(err, httpRes, body){
        if (err) return res.status(500).send(err);
        var resObj = JSON.parse(body);
        resObj.items[0].username = username;
        Books.find({}, function(err, docArr){
            docArr[0].booksList.push(resObj.items[0])
            docArr[0].save(function(err, done){
                if (err) return res.status(500).send(err);
            });
        });
        return res.status(200).json({newBook: resObj.items[0]});
    });
});

// questa route fa il contrario di quella precedente ovvero trova un volume all'interno dell'array nella proprietà 'bookList' e rimuove il libro passato nei parametri, compatta l'array e, primo esempio della serie, 'ri-setta' la proprietà "bookList" tramite il metodo mongoose ".set()" con il nuovo array "arr1". Il motivo di questo procedimento è dovuto al fatto che mongoose, a causa della mia scarsa voglia nell'impostare uno schema per la pappardella di file json ritornato dalla API, non crea dei 'sub-documents' nell'array e quindi non è possibile utilizzare i metodi propri della libreria per trovare ed eliminare gli oggetti, quindi, per aggiornare l'array, sarà necessario crearne uno nuovo e riassegnarlo alla proprietà, fatto questo potremo salvare le modifiche apportate con il metodo ".save()".
router.delete('/book/:username/:book', passport.authenticate('jwt', {session: false}), function(req, res){
    var username = req.params.username;
    var bookTitle = req.params.book;
    Books.find({}, function(err, docArr){
        if (err) return res.status(500).send(err);
        docArr[0].booksList.forEach(function(book, i){
            if (book.volumeInfo.title === bookTitle && book.username === username) {
                docArr[0].booksList.splice(i, 1);
            }
        });
        var arr1 = docArr[0].booksList.filter(function(elem){ return elem !== undefined; });
        docArr[0].set('booksList', arr1);
        docArr[0].save(function(err, done){
            if (err) return res.status(500).send(err);
            res.status(200).end();
        });
    });
});

// ottieni i libri messi in vendita dall'utente. Ricordarsi che abbiamo aumentato ogni oggetto/libro con una proprietà "username" quest'ultima ci consentirà di recuperare gli oggetti di cui avremo bisogno per quel determinato username passato nei parametri della url.
router.get('/mybooks/:username', passport.authenticate('jwt', {session: false}), function(req, res){
    var username = req.params.username;
    Books.find({}, function(err, docArr){
        if (err) return res.status(500).send(err);
        var arr = docArr[0].booksList.filter(function(obj){
            return obj.username === username;
        });
        res.status(200).json({myBooks: arr});
    });
});

// ottieni tutti i libri.
router.get('/all-books', function(req, res){
    Books.find({}, function(err, docArr){
        if (err) return res.status(500).send(err);
        res.status(200).json({list: docArr[0].booksList});
    });
});

router.post('/offer', passport.authenticate('jwt', {session: false}), function(req, res){
    var bookInfo = req.body.bookInfo;
    var bidder = req.body.bidder;
    var seller = req.body.seller;
    var counter = 0;
    bookInfo.seller = seller;
    bookInfo.bidder = bidder;
    Books.find({}, function(err, books){
        if (err) return res.status(500).send(err);
        books[0].booksList.forEach((book, i) => {
            if (book.volumeInfo.title === bookInfo.title) {
                book.canOffer = false;
                books[0].booksList.set(i + '', book);
            }
        });
        books[0].save(function(err){
            if (err) return res.status(500).send(err);
            counter++;
            if(counter === 3) {
                res.status(200).end();
            }
        });
    });
    User.findOne({username: seller}, function(err, user){
        if (err) return res.status(500).send(err);
        user.userData.receivedOffers.push(bookInfo)
        user.save(function(err){
            if (err) return res.status(500).send(err);
            counter++;
            if(counter === 3) {
                res.status(200).end();
            }
        });
    });
    User.findOne({username: bidder}, function(err, user){
        if (err) return res.status(500).send(err);
        user.userData.myOffers.push(bookInfo)
        user.save(function(err){
            if (err) return res.status(500).send(err);
            counter++;
            if(counter === 3) {
                res.status(200).end();
            }
        });
    });
});

// router per gestire le offerte accettate. Non è necessario al momento della richiesta passare come parametri 'seller' e 'bidder', dato che sono già stati inseriti all'interno dell'oggetto 'bookInfo'.
router.put('/offer', passport.authenticate('jwt', {session: false}), function(req, res){
    var bookInfo = req.body.bookInfo;
    var seller = bookInfo.seller;
    var bidder = bookInfo.bidder;
    var counter = 0;
    User.findOne({username: seller}, function(err, user){
        if (err) return res.status(500).send(err);
        user.userData.acceptedOffers.push(bookInfo);
        var arr1 = findAndRemove(user.userData.receivedOffers, bookInfo);
        user.userData.set('receivedOffers', arr1);
        user.save(function(err){
            if (err) return res.status(500).send(err);
            counter++;
            if(counter === 2) {
                res.status(200).end();
            }
        });
    });
    User.findOne({username: bidder}, function(err, user){
        if (err) return res.status(500).send(err);
        user.userData.myAcceptedOffers.push(bookInfo);
        var arr1 = findAndRemove(user.userData.myOffers, bookInfo);
        user.userData.set('myOffers', arr1);
        user.save(function(err){
            if (err) return res.status(500).send(err);
            counter++;
            if(counter === 2) {
                res.status(200).end();
            }
        });
    });
});

router.post('/delete-offer', passport.authenticate('jwt', {session: false}), function(req, res){
    var bookInfo = req.body.bookInfo;
    var seller = bookInfo.seller;
    var bidder = bookInfo.bidder;
    var counter = 0;
    User.findOne({username: seller}, function(err, user){
        if (err) return res.status(500).send(err);
        var arr1 = findAndRemove(user.userData.receivedOffers, bookInfo);
        user.userData.set('receivedOffers', arr1);
        var arr2 = findAndRemove(user.userData.acceptedOffers, bookInfo);
        user.userData.set('acceptedOffers', arr2);
        user.save(function(err){
            if (err) return res.status(500).send(err);
            counter++;
            if(counter === 3) {
                res.status(200).end();
            }
        });
    });
    User.findOne({username: bidder}, function(err, user){
        if (err) return res.status(500).send(err);
        var arr1 = findAndRemove(user.userData.myOffers, bookInfo);
        user.userData.set('myOffers', arr1);
        var arr2 = findAndRemove(user.userData.myAcceptedOffers, bookInfo);
        user.userData.set('myAcceptedOffers', arr2);
        user.save(function(err){
            if (err) return res.status(500).send(err);
            counter++;
            if(counter === 3) {
                res.status(200).end();
            }
        });
    });
    Books.find({}, function(err, books){
        if (err) return res.status(500).send(err);
        books[0].booksList.forEach((book, i) => {
            if (book.volumeInfo.title === bookInfo.title) {
                book.canOffer = true;
                books[0].booksList.set(i + '', book);
            }
        });
        books[0].save(function(err){
            if (err) return res.status(500).send(err);
            counter++;
            if(counter === 3) {
                res.status(200).end();
            }
        });
    });
});

router.get('/data/:username', passport.authenticate('jwt', {session: false}), function(req, res){
    var username = req.params.username;
    User.findOne({username: username}, function(err, user){
        if (err) return res.status(500).send(err);
        res.status(200).json({ userData: user.userData });
    });
});

router.get('/info/:username', passport.authenticate('jwt', {session: false}), function(req, res){
    var username = req.params.username;
    User.findOne({username: username}, function(err, user){
        if (err) return res.status(500).send(err);
        var email = user.email;
        var name = user.name || '';
        var city = user.city || '';
        var state = user.state || '';
        res.status(200).json({ userInfo: { email: email, name: name, city: city, state: state } });
    });
});

router.post('/signup', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    User.findOne({username: username}, function(err, user){
        if (err) return res.status(500).send(err);
        if (user) {
            res.statusMessage = 'This user already exist.';
            res.status(404).end();
        } else {
            User.findOne({email: email}, function(err, user){
                if (user) {
                    res.statusMessage = 'This email already exist.';
                    res.status(404).end();
                } else {
                    var newUser = new User({
                        username: username,
                        email: email,
                        password: password
                    });
                    newUser.save().then(function(){
                        User.findOne({username: username}, function(err, user){
                            if (user) {
                                var payload = {id: user._id};
                                var token = jwt.sign(payload, key.secretKey);
                                res.status(200).json({success: true, token: token});
                            } else {
                                res.statusMessage = 'Cannot create token.';
                                res.status(404).end();
                            }
                        });
                    });
                }
            });
        }
    });
});

router.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username: username}, function(err, user){
        if (err) return res.status(500).send(err);
        if (!user) {
            res.statusMessage = 'User doesn\'t exist.';
            res.status(404).end();
        } else {
            user.checkPassword(password, function(err, isMatch){
                if (err) return res.status(500).send(err);
                if (isMatch) {
                    var payload = {id: user._id};
                    var token = jwt.sign(payload, key.secretKey);
                    res.status(200)
                        .json({success: true, token: token});
                } else {
                    res.statusMessage = 'Current password doesn\'t match.';
                    res.status(404).end();
                }
            });
        }
    });
});

router.put('/update-profile', passport.authenticate('jwt', {session: false}), function(req, res){
    var username = req.body.username;
    var name = req.body.name;
    var city = req.body.city;
    var state = req.body.state;
    User.findOne({username: username}, function(err, user){
        if (err) return res.status(500).send(err);
        user.name = name;
        user.city = city;
        user.state = state;
        user.save(function(err, done){
            if (err) return res.status(500).send(err);
            return res.status(200)
                .json({success: true, message: 'Profile successfully updated.'});
        });
    });
});

router.put('/edit-profile', passport.authenticate('jwt', {session: false}), function(req, res){
    var username = req.body.username;
    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.password;
    User.findOne({username: username}, function(err, user){
        if (err) return res.status(500).send(err);
        user.checkPassword(currentPassword, function(err, isMatch){
            if (err) return res.status(500).send(err);
            if (isMatch) {
                user.password = newPassword;
                user.save(function(err, done){
                    if (err) return res.status(500).send(err);
                    return res.status(200)
                        .json({success: true, message: 'Account succesfully updated.'});
                });
            } else {
                res.statusMessage = 'Password doesn\'t match.';
                res.status(404).end();
            }
        });
    });
});

router.post('/delete-profile', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username: username}, function(err, user){
        if (err) return res.status(500).send(err);
        user.checkPassword(password, function(err, isMatch){
            if (err) return res.status(500).send(err);
            if (isMatch) {
                user.remove();
                res.status(200)
                    .json({success: true, message: 'Account successfully removed.'});
            } else {
                res.statusMessage = 'Password doesn\'t match.';
                res.status(404).end();
            }
        });
    });
});

router.get(['/',
            '/home',
            '/signup',
            '/login',
            '/mybooks',
            '/settings'], function(req, res){
    res.sendFile('index.html', {root: path.join(__dirname, '/dist')});
});

module.exports = router;