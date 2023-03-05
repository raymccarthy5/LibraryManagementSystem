import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import {AuthContext} from '../context/AuthProvider';
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

const SearchResults = () => {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    console.log(query)
    axios.get(`/books/search/${query}`)
    .then((res) => {
      setBooks(res.data);
      console.log(res.data)
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [query]);

  return (
    <>
    <h2 className='m-5'>Search Results</h2>
    <div className='m-5'>
    <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.genre}</td>
            <td>{book.rating}/5</td>
            <td>
            { isLoggedIn ? (
            <button
              onClick={() => alert(book.id)}
              disabled={book.quantityAvailable < 1}
              className={book.quantityAvailable < 1 ? "btn btn-secondary" : "button"}
            >
              {book.quantityAvailable<1 ? "Out of Stock": "Reserve"}
            </button> ) : ( <Link to="/login"><button
              disabled={book.quantityAvailable < 1}
              className={book.quantityAvailable < 1 ? "btn btn-secondary" : "button"}
            >
              {book.quantityAvailable<1 ? "Out of Stock": "Reserve"}
            </button></Link> )
            }
            { isLoggedIn ? (
            <button onClick={() => alert(book.id)}>
              <FontAwesomeIcon icon={faHeart} />
            </button> ) : (" ")
            }
            </td>
          </tr>
          ))}
        </tbody>
      </table>
      </div>
      </>
  )
}

export default SearchResults