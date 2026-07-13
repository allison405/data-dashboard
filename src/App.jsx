import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./App.css";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>📚 Catalog Menu</h2>
        <nav>
          <ul>
            <li><Link to="/">🏠 Dashboard Home</Link></li>
          </ul>
        </nav>
        <div className="sidebar-hint">
          <h4>💡 Insight Tip</h4>
          <p>Filter by language below to watch how the distribution charts shift context!</p>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}


function BookDashboard({ books, filteredBooks, searchQuery, setSearchQuery, selectedLang, setSelectedLang }) {
  const totalCount = filteredBooks.length;

  const avgEditions = filteredBooks.length > 0
    ? (filteredBooks.reduce((sum, book) => sum + (book.edition_count || 0), 0) / filteredBooks.length).toFixed(1)
    : 0;

  const classicBooksCount = filteredBooks.filter(
    (book) => book.first_publish_year && book.first_publish_year < 2000
  ).length;

  const languages = ["All", ...new Set(books.flatMap(book => book.language || []).filter(Boolean))].slice(0, 10);

  // --- CHART 1 DATA: Edition distribution by era ---
  const prepareTimelineData = () => {
    const eras = { "Pre-1950": 0, "1950-1999": 0, "2000-2010": 0, "2011+": 0 };
    filteredBooks.forEach(book => {
      const year = book.first_publish_year;
      if (!year) return;
      if (year < 1950) eras["Pre-1950"]++;
      else if (year < 2000) eras["1950-1999"]++;
      else if (year <= 2010) eras["2000-2010"]++;
      else eras["2011+"]++;
    });
    return Object.keys(eras).map(key => ({ era: key, count: eras[key] }));
  };


  const prepareTopEditionsData = () => {
    return [...filteredBooks]
      .sort((a, b) => (b.edition_count || 0) - (a.edition_count || 0))
      .slice(0, 5)
      .map(book => ({
        title: book.title.length > 20 ? book.title.substring(0, 20) + "..." : book.title,
        editions: book.edition_count || 1
      }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="dashboard-container">
      <header>
        <h1>Open Library Insights</h1>
        
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

      {/* --- DATA VISUALIZATION SECTION --- */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>📅 Publication Timeline Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={prepareTimelineData()}
                dataKey="count"
                nameKey="era"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {prepareTimelineData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>📊 Top 5 Books by Edition Diversity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={prepareTopEditionsData()}>
              <XAxis dataKey="title" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="editions" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
          <span className="feature-main">Book Title & Author</span>
          <span className="feature-meta">Year Published</span>
          <span className="feature-editions">Action</span>
        </div>
        
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => {
            // Open Library keys look like "/works/OL12345W". Extract just the unique ending token.
            const cleanKey = book.key ? book.key.replace("/works/", "") : index;
            return (
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
                  <Link to={`/book/${cleanKey}`} className="detail-link-btn">
                    View Details 🔎
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-results">No library records match your current criteria.</p>
        )}
      </div>
    </div>
  );
}


function BookDetail({ books }) {
  const { id } = useParams();
  
  const book = books.find(b => b.key && b.key.includes(id));

  if (!book) {
    return (
      <div className="detail-error">
        <h2>Book Record Not Found</h2>
        <p>Could not load meta tags for asset ID: {id}</p>
        <Link to="/" className="back-btn">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="detail-card-container">
      <Link to="/" className="back-btn">← Back to Catalog</Link>
      <div className="detail-card-body">
        <span className="detail-badge">Asset Key: {id}</span>
        <h2>{book.title}</h2>
        <h3 className="detail-author-sub">by {book.author_name ? book.author_name.join(", ") : "Unknown"}</h3>
        
        <hr />
        
        <div className="detail-grid">
          <div className="detail-item">
            <strong>First Published:</strong>
            <p>{book.first_publish_year || "N/A"}</p>
          </div>
          <div className="detail-item">
            <strong>Total Formatted Editions:</strong>
            <p>{book.edition_count || 1} iterations</p>
          </div>
          <div className="detail-item">
            <strong>Available System Languages:</strong>
            <p>{book.language ? book.language.join(", ").toUpperCase() : "N/A"}</p>
          </div>
          <div className="detail-item">
            <strong>Ebook/Borrow Availability:</strong>
            <p>{book.has_fulltext ? "✅ Full Digital Text Available" : "❌ Print Only / Restricted Access"}</p>
          </div>
          <div className="detail-item full-width">
            <strong>Subject Classifications:</strong>
            <p className="tags-container">
              {book.subject ? book.subject.slice(0, 8).map((sub, i) => (
                <span key={i} className="tag">{sub}</span>
              )) : "No listed classifications"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
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

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={
              <BookDashboard 
                books={books}
                filteredBooks={filteredBooks}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
              />
            } 
          />
          <Route path="/book/:id" element={<BookDetail books={books} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}