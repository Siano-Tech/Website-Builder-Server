const { v4: uuidv4 } = require('uuid');
 
const generateUid = () => uuidv4();

module.exports = { generateUid }