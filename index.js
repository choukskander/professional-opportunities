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

// const dbURI = 'mongodb+srv://skanderchouk:unNlVGQ2DAKwn07i@cluster0.ohjeb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// mongoose.connect(dbURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch((error) => console.error('MongoDB connection error:', error));

// app.use(cors());
// app.use('/uploads', express.static('uploads'));


// app.use(express.json()); 



// app.use('/api/users', userRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/applications', applicationRoutes);


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration MongoDB améliorée
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
})
.then(() => console.log('✅ Connexion MongoDB réussie'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(fileUpload({
    useTempFiles: false, // Traitement en mémoire
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    abortOnLimit: true
}));

// Configuration Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        temperature: 0.5,
        topP: 0.95,
        topK: 40
    }
});

// Routes principales
app.post('/api/chat', async (req, res) => {
    try {
        const { content } = req.body;
        const pdfFile = req.files?.pdf_file;
        let cvText = '';

        // Validation des entrées
        if (!content && !pdfFile) {
            return res.status(400).json({ 
                error: 'Veuillez fournir un message ou un fichier PDF' 
            });
        }

        // Traitement PDF
        if (pdfFile) {
            if (pdfFile.mimetype !== 'application/pdf') {
                return res.status(400).json({ 
                    error: 'Format de fichier non supporté (PDF uniquement)' 
                });
            }

            try {
                const data = await pdfParse(pdfFile.data);
                cvText = data.text;
                
                if (!cvText.trim()) {
                    return res.status(400).json({ 
                        error: 'Le PDF ne contient pas de texte lisible' 
                    });
                }
            } catch (error) {
                console.error('Erreur PDF:', error);
                return res.status(400).json({ 
                    error: 'Impossible de lire le PDF. Vérifiez que le fichier est valide.'
                });
            }
        }

        // Construction du prompt
        const prompt = cvText 
            ? `Analyse de CV :\n\`\`\`\n${cvText}\n\`\`\`\nDemande : ${content || "Analyse complète"}`
            : content;

        // Génération de la réponse
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Formatage de la réponse
        const formattedResponse = textResponse
            .split(/(?=\n## )/) // Split sur les titres Markdown
            .filter(section => section.trim())
            .map(section => {
                const [titleLine, ...content] = section.split('\n');
                const title = titleLine.replace(/^##\s*/, '').trim();
                return {
                    title,
                    content: content
                        .join('\n')
                        .replace(/\*\*(.*?)\*\*/g, '$1') // Enlève le markdown
                        .trim()
                };
            });

        res.json({ response: formattedResponse });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            error: 'Erreur de traitement',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Gestion des erreurs
app.use((req, res) => res.status(404).json({ error: 'Endpoint non trouvé' }));
app.use((err, req, res, next) => {
    console.error('Erreur globale:', err);
    res.status(500).json({ 
        error: 'Erreur interne du serveur',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'développement'}`);
});