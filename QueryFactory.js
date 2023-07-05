
const GetLoginQuery = () => {
    return "SELECT * FROM users WHERE (Name = ? OR Email = ?) AND Password = ?";
}

const GetIsEmailExistQuery = () => {
    return "SELECT * FROM users WHERE Email = ?";
};

const GetIsUsernameExistQuery = () => {
    return "SELECT * FROM users WHERE Name = ?";
};

const GetResetPasswordQuery = () => {
    return "INSERT INTO users SET Password = ? WHERE Email = ?";
}

const GetNewUserQuery = () => {
    return "INSERT INTO users values (?, ?, ?)";
}

module.exports = {   
    GetLoginQuery,
    GetIsEmailExistQuery,
    GetIsUsernameExistQuery,
    GetResetPasswordQuery,
    GetNewUserQuery,
};