const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const clinic = require('./routes/clinicRoutes');

app.use('/api/users', userRoutes);
app.use('/api/clinic', clinic);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
