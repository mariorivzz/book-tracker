import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

export default function Home() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        title: "",
        description: "",
        rating: 0, // Cambiado de string a number
        read: false
    });

    // Obtener los libros al cargar la página
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/books");
            setBooks(res.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };
    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewBook({
            ...newBook,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newBook.title.trim()) return alert("El título es obligatorio");
    
        try {
            await axios.post("http://localhost:5000/books", newBook);
            setNewBook({ title: "", description: "", rating: "", read: false });
            fetchBooks();
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    // Eliminar un libro
    const deleteBook = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/books/${id}`);
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Lista de Libros</h1>

            {/* Formulario para añadir libros */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={newBook.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Descripción"
                    value={newBook.description}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="rating"
                    placeholder="Nota (1-10)"
                    value={newBook.rating}
                    onChange={handleChange}
                    min="1"
                    max="10"
                />
                <label>
                    <input
                        type="checkbox"
                        name="read"
                        checked={newBook.read}
                        onChange={handleChange}
                    />
                    Leído
                </label>
                <button type="submit">Añadir Libro</button>
            </form>

            {/* Lista de libros */}
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        <strong>{book.title}</strong> - {book.description} - Nota: {book.rating} - 
                        {book.read ? " ✅ Leído" : " ❌ No leído"}
                        <button onClick={() => deleteBook(book._id)}>Eliminar</button>
                    </li>
                ))}
             </ul>
        </div>
    );
}