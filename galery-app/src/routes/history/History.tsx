import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./History.style.css";

const History = () => {
  const [searchedWords, setSearchedWords] = useState<string[]>([]);
  const [itemsToShow, setItemsToShow] = useState<string[]>([]);
  const loader = useRef(null);
  const loadingDelay = 500;

  useEffect(() => {
    const words = localStorage.getItem("searchedWords");
    if (words) {
      const loadedWords = JSON.parse(words);
      setSearchedWords(loadedWords);
      setItemsToShow(loadedWords.slice(0, 10));
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && itemsToShow.length < searchedWords.length) {
          setTimeout(() => {
            setItemsToShow((prevItems) => [
              ...prevItems,
              ...searchedWords.slice(prevItems.length, prevItems.length + 10),
            ]);
          }, loadingDelay);
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [searchedWords, itemsToShow]);

  return (
    <>
      <nav>
        <h1>History</h1>
        <Link to="/">Home</Link>
      </nav>
      <div className="history-container">
        <h1>Search History</h1>
        <ul>
          {itemsToShow.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
        {itemsToShow.length < searchedWords.length && (
          <h2 ref={loader}>Loading more...</h2>
        )}
      </div>
    </>
  );
};

export default History;
