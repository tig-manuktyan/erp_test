import User from './user/user.js';
import File from './file/file.js';
import Token from './token/token.js';

// Defining relationships between models
User.hasOne(File); // User has one File
User.hasOne(Token); // User has one Token
Token.hasMany(Token); // Token has many Tokens (self-referencing relation)

User.hasMany(File); // User can have many Files
File.belongsTo(User); // File belongs to User

const models = [User, File, Token];

export default models;
