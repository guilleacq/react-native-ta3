import React, { useState } from 'react';
import {
  ScrollView,  // agregamos esto pa poder scrollear vió
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// se supone que esto no deberia estar aca perooo ya fue
const API_KEY = 'dbb8434c';

const MovieSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // funcion pa buscar la peli
  const searchMovie = async () => {
    if (searchText.trim() === '') {
      setError('che escribí algo primero');
      return;
    }

    setLoading(true);
    setError('');
    setMovie(null);

    try {
      const response = await fetch(  // aca para esto me asistí con IA porque no me salia jajaj (hice una rima)
        `https://www.omdbapi.com/?t=${encodeURIComponent(searchText)}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Response === 'True') {
        setMovie(data);
      } else {
        setError('no encontré esa peli master');
      }
    } catch (err) {
      setError('uhh se rompió algo, fijate tu internet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* barra de busqueda afuera asi queda fija arriba vió */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar película..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchMovie}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={searchMovie}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* aca metemos todo lo que queremos que scrollee*/}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* loader mientras busca */}
        {loading && (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
        )}

        {/* mensaje de error si hay */}
        {error !== '' && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* info de la peli si la encontro */}
        {movie && (
          <View style={styles.movieContainer}>
            {movie.Poster !== 'N/A' ? (
              <Image
                source={{ uri: movie.Poster }}
                style={styles.poster}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noPoster}>
                <Text>Sin póster :(</Text>
              </View>
            )}

            <Text style={styles.title}>{movie.Title}</Text>
            <Text style={styles.year}>({movie.Year})</Text>

            <View style={styles.infoContainer}>
              <Text style={styles.rating}>⭐ {movie.imdbRating}/10</Text>
              <Text style={styles.runtime}>{movie.Runtime}</Text>
            </View>

            <Text style={styles.plot}>{movie.Plot}</Text>

            <View style={styles.extraInfo}>
              <Text style={styles.director}>Director: {movie.Director}</Text>
              <Text style={styles.actors}>Actores: {movie.Actors}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // estilos pa que el scroll se vea piola
  scrollContent: {
    padding: 16,
    paddingBottom: 24, // un toque más de padding abajo para que quede fachero
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7', // verde más claro cuando está deshabilitado
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 20,
  },
  movieContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: width - 128,
    height: (width - 128) * 1.5,
    borderRadius: 8,
    marginBottom: 16,
  },
  noPoster: {
    width: width - 64,
    height: (width - 64) * 1.5,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  year: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: '#ff9800',
    fontWeight: '600',
  },
  runtime: {
    fontSize: 16,
    color: '#666',
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  extraInfo: {
    width: '100%',
  },
  director: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actors: {
    fontSize: 14,
    color: '#666',
  },
});

export default MovieSearch;