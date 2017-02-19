var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

// signup
exports.showSignup = function( req, res ) {
  res.render( 'signup', {
    title: '注册页面'
  } );
};

exports.showSignin = function( req, res ) {
  res.render( 'signin', {
    title: '登录页面'
  } );
};
//注册
exports.signup = function( req, res ) {
  var _user = req.body.user;
  if ( _user.name === 'admin' )_user.role = 11;//如果大于等于10是管理员
  console.log( '___signup:', _user );
  User.findOne( { name: _user.name },  function( err, user ) {
    if ( err ) {
      console.log( err );
    }
    if ( user ) {//检查是否已经有这个用户,有就跳转到登录页
      return res.redirect( '/signin' );
    } else {//如果没有就在数据库里新建
      user = new User( _user );
      user.save( function( err, user ) {
        if ( err ) {
          console.log( err );
        }
        res.redirect( '/' );
      } );
    }
  } );
};

// signin
exports.signin = function( req, res ) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne( { name: name }, function( err, user ) {
    if ( err ) {
      console.log( err );
    }
    console.log( 'signin================>>>', user );
    if ( !user ) {
      return res.redirect( '/signup' );
    }

    user.comparePassword( password, function( err, isMatch ) {
      if ( err ) {
        console.log( err );
      }

      if ( isMatch ) {
        req.session.user = user;
        return res.redirect( '/' );

      } else {
        return res.redirect( '/signin' );
      }
    } );
  } );
};

// logout
exports.logout =  function( req, res ) {
  delete req.session.user;
  //delete app.locals.user

  res.redirect( '/' );
};

// userlist page
exports.list = function( req, res ) {
  User.fetch( function( err, users ) {
    if ( err ) {
      console.log( err );
    }
    console.log( '================>>>', users );
    res.render( 'userlist', {
      title: 'imooc 用户列表页',
      users: users
    } );
  } );
};

// midware for user
exports.signinRequired = function( req, res, next ) {
  var user = req.session.user;
  console.log( 'signinRequired___=>>>', req.session );
  if ( !user ) {
    return res.redirect( '/signin' );
  }

  next();
};

exports.adminRequired = function( req, res, next ) {
  var user = req.session.user;
  console.log( 'adminRequired___=>>>', req.session );
  if ( user.role <= 10 ) {
    return res.redirect( '/signin' );
  }

  next();
};
