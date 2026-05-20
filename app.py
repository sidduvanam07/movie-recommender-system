from flask import Flask, request, jsonify, render_template
from sklearn.metrics.pairwise import cosine_similarity
import os
import pickle
import requests
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed

app = Flask(__name__)


# Load models safely
try:
    movies_data = pickle.load(open('movies.pkl', 'rb'))
    movies = pd.DataFrame(movies_data) if isinstance(movies_data, dict) else movies_data

    vectors = pickle.load(open('vectors.pkl', 'rb'))

    all_movies = movies['title'].values

except Exception as e:
    print("Error loading model files:", e)

    movies = None
    vectors = None
    all_movies = []

TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8"
PLACEHOLDER   = "https://placehold.co/300x450/111318/555e72?text=No+Poster"

def fetch_poster(movie_id):
    """Fetches the movie poster URL from TMDb API with a 5s timeout."""
    url = (
        f"https://api.themoviedb.org/3/movie/{movie_id}"
        f"?api_key={TMDB_API_KEY}&language=en-US"
    )
    try:
        data = requests.get(url, timeout=5).json()
        path = data.get('poster_path')
        return f"https://image.tmdb.org/t/p/w500{path}" if path else PLACEHOLDER
    except Exception as e:
        print(f"Poster fetch error for {movie_id}: {e}")
        return PLACEHOLDER

def recommend(movie):
    """Returns the top 5 similar movies with posters fetched concurrently."""
    if movies is None or vectors is None:
        return []

    try:
        movie_index      = movies[movies['title'] == movie].index[0]
        distances = cosine_similarity([vectors[movie_index]], vectors)[0]
        top5             = sorted(enumerate(distances), key=lambda x: x[1], reverse=True)[1:6]

        # Build candidate list
        candidates = [
            {"title": movies.iloc[i].title, "movie_id": movies.iloc[i].movie_id}
            for i, _ in top5
        ]

        # Fetch all 5 posters concurrently
        results = [None] * len(candidates)
        with ThreadPoolExecutor(max_workers=5) as pool:
            future_map = {
                pool.submit(fetch_poster, c["movie_id"]): idx
                for idx, c in enumerate(candidates)
            }
            for future in as_completed(future_map):
                idx = future_map[future]
                results[idx] = {
                    "title":  candidates[idx]["title"],
                    "poster": future.result()
                }

        return results

    except IndexError:
        return []

@app.route('/')
def index():
    return render_template('index.html', movies=list(all_movies))

@app.route('/recommend', methods=['POST'])
def get_recommendation():
    movie = request.form.get('movie')
    if not movie:
        return jsonify({"error": "No movie provided"}), 400
    return jsonify({"recommendations": recommend(movie)})

# Required for Vercel deployment
handler = app

if __name__ == '__main__':
    app.run(debug=True, port=8000)
