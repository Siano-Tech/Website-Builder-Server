const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const { generateUid } = require('../utils/utils');

const registerUser = async (req, res) => {
  const { name, email, phoneNo, password } = req.body;
  const uid = generateUid();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      phoneNo,
      password: hashedPassword,
      uid,
      timeStamp: new Date().toISOString()
    };

    const usersRef = db.ref('users');
    usersRef.orderByChild('phoneNo').equalTo(phoneNo).once('value', async (snapshot) => {
      if (snapshot.exists()) {
        return res.status(400).json({ message: 'Phone no. already registered, please try with a different phone no.' });
      }

      const userRef = db.ref('users/'+ uid);
      await userRef.set(user);
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerGuestUser = async (req, res) => {
  const { phoneNo } = req.body;
  const uid = generateUid();

  try {
    const user = {
      phoneNo,
      uid,
      timeStamp: new Date().toISOString()
    };

    const usersRef = db.ref('users');
    usersRef.orderByChild('phoneNo').equalTo(phoneNo).once('value', async (snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.val();
        const userId = Object.keys(user)[0];
        let userData = user[userId];
        // return res.status(400).json({ message: 'Phone no. already registered, please try with a different phone no.' });
        return res.status(200).json({ message: 'Phone no. already registered, loggin in', user: userData });
      }

      const userRef = db.ref('users/'+ uid);
      await userRef.set(user);
      res.status(201).json({ message: 'Guest user registered successfully', user: user });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { phoneNo, password } = req.body;

  try {
    const usersRef = db.ref('users');
    usersRef.orderByChild('phoneNo').equalTo(phoneNo).once('value', async (snapshot) => {
      if (!snapshot.exists()) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const user = snapshot.val();
      const userId = Object.keys(user)[0];
      let userData = user[userId];

      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      delete userData.password;
      
      const token = jwt.sign({ id: userId }, 'JWT_SECRET', { expiresIn: '1h' });
      res.json({ token, user: userData, message: 'Login Successful' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, registerGuestUser, loginUser };
