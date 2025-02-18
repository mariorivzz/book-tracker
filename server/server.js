require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./models/Book"); // Importa el modelo

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB conectado correctamente");

        // Rutas
        // GET Todos los libros
        app.get('/books', async (req, res) => {
            try {
                const books = await Book.find();
                res.json(books);
            } catch (error) {
                res.status(500).json({ error: "Error obteniendo libros" });
            }
        });

        // POST Crear libro
        app.post('/books', async (req, res) => {
            try {
                const newBook = new Book(req.body);
                const savedBook = await newBook.save();
                res.status(201).json(savedBook);
            } catch (error) {
                res.status(400).json({ error: "Error creando libro" });
            }
        });

        // DELETE Eliminar libro
        app.delete('/books/:id', async (req, res) => {
            try {
                await Book.findByIdAndDelete(req.params.id);
                res.status(200).json({ message: "Libro eliminado" });
            } catch (error) {
                res.status(400).json({ error: "Error eliminando libro" });
            }
        });

        // Iniciar servidor
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => console.error("❌ Error conectando a MongoDB:", err));