import React, { useState, useEffect, useRef } from 'react';
import './TaskThree.css';

// Модифицированная функция для получения данных с поддержкой AbortController
const fetchData = async (search, signal) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?q=${search}`,
      { signal }
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Fetch error:', error);
    }
    return [];
  }
};

// Кастомный хук для поиска с debounce и защитой от race condition
const useDebouncedSearch = (apiFunc, delay = 500) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Очищаем предыдущий таймер при каждом изменении searchTerm
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Сбрасываем результаты при пустом поисковом запросе
    if (!searchTerm.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Устанавливаем новый таймер для debounce
    timeoutRef.current = setTimeout(async () => {
      try {
        // Отменяем предыдущий запрос, если он был
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Создаем новый контроллер для текущего запроса
        abortControllerRef.current = new AbortController();
        const data = await apiFunc(searchTerm, abortControllerRef.current.signal);
        
        setResults(data);
        setIsLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to fetch data');
          setIsLoading(false);
        }
      }
    }, delay);

    // Очистка при размонтировании компонента
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchTerm, apiFunc, delay]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error
  };
};

// Основной компонент
export default function TaskThree() {
  const { 
    searchTerm, 
    setSearchTerm, 
    results, 
    isLoading, 
    error 
  } = useDebouncedSearch(fetchData, 500);

  return (
    <div className="TaskThree">
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search posts"
        className="search-input"
      />
      
      <h1>Posts</h1>
      
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <ul className="results-list">
        {results.map(item => (
          <li key={item.id} className="post-item">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
        
        {!isLoading && !error && results.length === 0 && searchTerm && (
          <li className="no-results">No posts found</li>
        )}
      </ul>
    </div>
  );
}
