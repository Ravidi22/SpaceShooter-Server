const QueryFactory = require("./QueryFactory")
// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ravidiref2288',
  database: 'SpaceShooterDatebase'
});

connection.connect(error =>{
    error ? console.error(error):console.log ('Database connected');
});


const CheckLogin = (params, callback) =>{
    const query = QueryFactory.GetLoginQuery();
    connection.query(query, [params.Name, params.Email, params.Password], (err, result, fields) => {
        callback(result);
    });
}

const IsEmailAlreadyExist = (params, callback) =>{
    const query = QueryFactory.GetIsEmailExistQuery();
    connection.query(query, [params.Email], (err, result, fields) => {
        result.length ? callback(true) : callback(false);

    });
}

const IsUsernameAlreadyExist = (params, callback)=> {
    const query = QueryFactory.GetIsUsernameExistQuery();
    connection.query(query, [params.Name], (err, result, fields) => {
        result.length ? callback(true) : callback(false);

    });
}



const ResetPassword = (params) => {
    const query = QueryFactory.GetResetPasswordQuery();
    connection.query(query, [params.Password, params.Email]);
}

const AddNewUser=(params)=>{
    const query = QueryFactory.GetNewUserQuery();
    connection.query(query, [params.Name, params.Password, params.Email])
}


module.exports = {
    CheckLogin,
    IsEmailAlreadyExist,
    IsUsernameAlreadyExist,
    ResetPassword,
    AddNewUser,
};

