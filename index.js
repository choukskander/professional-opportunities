// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config(); 
// const userRoutes = require('./routes/userRoutes');
// const jobRoutes = require('./routes/jobRoutes');
// const applicationRoutes = require('./routes/applicationRoutes');
// const fileUpload = require('express-fileupload'); // Import express-fileupload

// const app = express();
// const PORT = process.env.PORT || 5000;

// const dbURI = 'mongodb+srv://skanderchouk:G73XmRjQghG6hncN@cluster0.hbkir.mongodb.net/professional-opportunities?retryWrites=true&w=majority&appName=Cluster0';

// mongoose.connect(dbURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch((error) => console.error('MongoDB connection error:', error));

// app.use(cors());
// app.use(express.json());

// // Enable file uploads
// app.use(fileUpload({
//   useTempFiles: true,          // Utiliser des fichiers temporaires pour gérer les téléchargements
//   tempFileDir: '/tmp/',        // Répertoire pour les fichiers temporaires
//   createParentPath: true,      // Créer le répertoire parent si nécessaire
//   limits: { fileSize: 50 * 1024 * 1024 }, // Limite de taille de fichier (50MB dans cet exemple)
// }));
 

// app.use('/api/users', userRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/applications', applicationRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const fileUpload = require('express-fileupload'); // Import express-fileupload

const app = express();
const PORT = process.env.PORT || 5000;

const dbURI = 'mongodb+srv://skanderchouk:G73XmRjQghG6hncN@cluster0.hbkir.mongodb.net/professional-opportunities?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

app.use(cors());
app.use(express.json());
 
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
