import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import customFetch from "../../utils/customFetch";
import { useCallback } from "react";
import "./MainPage.style.css";
import { debounce, set } from "lodash";
import { Photo } from "./MainPage.interface.";
import { Link } from "react-router-dom";

const fetchPhotos = async ({
  pageParam = 1,
  query,
}: {
  pageParam?: number;
  query: string;
}) => {
  const acces_key = "6Z2CPDb_LVCZEtxascOrsic-GMSdYzuA8RF5lzSn1CA";
  const endpoint = query ? "search/photos" : "photos";
  const params = query
    ? { query, client_id: acces_key, per_page: 20, page: pageParam }
    : {
        order_by: "popular",
        client_id: acces_key,
        per_page: 20,
        page: pageParam,
      };

  const response = await customFetch.get(endpoint, { params });
  return query ? response.data.results : response.data;
};

const MainPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [searchedWords, setSearchedWords] = useState<string[]>([]);
  const loadingDelay = 1000;
  const debouncedSearchTerm = useRef(
    debounce((nextValue) => setSearchTerm(nextValue), 1000)
  ).current;

  useEffect(() => {
    debouncedSearchTerm(inputValue);
    return () => debouncedSearchTerm.cancel();
  }, [inputValue]);
  useEffect(() => {
    const storedWords = localStorage.getItem("searchedWords");
    if (storedWords) {
      setSearchedWords(JSON.parse(storedWords));
    }
  }, []);
  useEffect(() => {
    if (searchTerm) {
      const updatedWords = Array.from(new Set([searchTerm, ...searchedWords]));
      setSearchedWords(updatedWords);
      localStorage.setItem("searchedWords", JSON.stringify(updatedWords));
    }
  }, [searchTerm]);

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["photos", searchTerm],
    ({ pageParam }) => fetchPhotos({ pageParam, query: searchTerm.trim() }),
    {
      getNextPageParam: (lastPage, allPages) => allPages.length + 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && searchTerm !== "") {
          setShowLoading(true);
          setTimeout(() => {
            fetchNextPage().finally(() => setShowLoading(false));
          }, loadingDelay);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage, searchTerm, loadingDelay]
  );

  return (
    <main>
      <nav>
        <h1>Unsplash Gallery</h1>
        <Link to="/history">History</Link>
      </nav>
      <div className="search-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="search-input"
          placeholder="Search for photos"
        />
      </div>
      <section className="photos">
        {data?.pages.map((group, i) =>
          group.map((photo: Photo, index: number) => (
            <div
              key={photo.id}
              ref={group.length === index + 1 ? lastElementRef : null}
            >
              <Link to={`/photo/${photo.id}`}>
                <img
                  src={photo.urls.small}
                  alt={photo.description || "Photo"}
                  width={300}
                  height={300}
                />
              </Link>
            </div>
          ))
        )}
        {showLoading && <div className="spinner"></div>}
      </section>
    </main>
  );
};

export default MainPage;
