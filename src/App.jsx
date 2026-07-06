import React, { useState, useEffect } from "react";
import "./App.css"; 

export default function BookDashboard() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("All");

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch("https://openlibrary.org/search.json?q=fiction&limit=40");
        const data = await response.json();
        
        const items = data.docs || [];
        setBooks(items);
        setFilteredBooks(items);
      } catch (error) {
        console.error("Error retrieving library catalog data:", error);
      }
    };

    fetchBookData();
  }, []);

  useEffect(() => {
    let tempBooks = [...books];

    if (searchQuery.trim() !== "") {
      tempBooks = tempBooks.filter((book) =>
        book.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLang !== "All") {
      tempBooks = tempBooks.filter((book) =>
        book.language?.includes(selectedLang)
      );
    }

    setFilteredBooks(tempBooks);
  }, [searchQuery, selectedLang, books]);

  const totalCount = filteredBooks.length;

  const avgEditions = filteredBooks.length > 0
    ? (filteredBooks.reduce((sum, book) => sum + (book.edition_count || 0), 0) / filteredBooks.length).toFixed(1)
    : 0;

  const classicBooksCount = filteredBooks.filter(
    (book) => book.first_publish_year && book.first_publish_year < 2000
  ).length;

  const languages = ["All", ...new Set(books.flatMap(book => book.language || []).filter(Boolean))].slice(0, 10);

  return (
    <div className="dashboard-container">
      <header>
        <h1>📚 Open Library Dashboard</h1>
        
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Books Shown</h3>
            <p className="stat-num">{totalCount}</p>
          </div>
          <div className="stat-card">
            <h3>Avg Edition Count</h3>
            <p className="stat-num">{avgEditions}</p>
          </div>
          <div className="stat-card">
            <h3>Pre-2000 Classics</h3>
            <p className="stat-num">{classicBooksCount}</p>
          </div>
        </div>
      </header>

      <div className="controls-panel">
        <input
          type="text"
          placeholder="Filter by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select 
          value={selectedLang} 
          onChange={(e) => setSelectedLang(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All Languages</option>
          {languages.filter(lang => lang !== "All").map((lang, idx) => (
            <option key={idx} value={lang}>{lang.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="list-view">
        <div className="list-header-row">
          <span className = "feature-main">Book Title & Author</span>
          <span className = "feature-meta">Year Published</span>
          <span className = "feature-editions">Number of Editions</span>
        </div>
        
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div key={book.key || index} className="list-row">
              <div className="feature-main">
                <span className="book-title">{book.title}</span>
                <span className="book-author">
                  by {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
                </span>
              </div>
              
              <div className="feature-meta">
                <span>⏳ {book.first_publish_year || "N/A"}</span>
              </div>

              <div className="feature-editions">
                <span>🗂️ {book.edition_count || 1} editions</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No library records match your current criteria.</p>
        )}
      </div>
    </div>
  );
}