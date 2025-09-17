import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetched } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error('Please enter a valid search query.');
      return;
    }
    setSearchQuery(query);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  useEffect(() => {
    if (isFetched && (data?.results?.length ?? 0) === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isFetched, data]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && (data?.results?.length ?? 0) > 0 && (
        <>
          {(data?.total_pages ?? 0) > 1 && (
            <ReactPaginate
              pageCount={data?.total_pages ?? 0}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data?.results ?? []} onSelect={handleSelectMovie} />
        </>
      )}

      <Toaster position="top-right" />
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default App;
