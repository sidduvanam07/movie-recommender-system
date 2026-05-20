# Movie Recommender System

A content-based movie recommendation system built with Python, Flask, and scikit-learn. The application uses a Netflix-style UI to display the top 5 similar movies based on metadata (genres, keywords, cast, director, and overview).

## 🚀 Features
- **Content-Based Filtering**: Recommendations are generated using Cosine Similarity.
- **Modern UI**: Dark theme, responsive design, searchable dropdown, and hover animations.
- **TMDb API Integration**: Fetches real movie posters dynamically.
- **Vercel Ready**: Comes with configuration for serverless deployment.

## 🛠️ Tech Stack
- **Backend**: Python, Flask
- **Machine Learning**: scikit-learn, Pandas, NumPy, NLTK
- **Frontend**: HTML5, CSS3, JavaScript, jQuery, Select2
- **Deployment**: Vercel

## 📂 Project Structure
```
Movie_recommender/
├── app.py                  # Flask backend application
├── requirements.txt        # Python dependencies
├── runtime.txt             # Python version for Vercel
├── vercel.json             # Vercel deployment configuration
├── movie_recommender.ipynb # Jupyter notebook for ML model creation
├── templates/
│   └── index.html          # Frontend HTML structure
├── static/
│   ├── style.css           # Custom styling
│   └── script.js           # Frontend logic and API calls
└── dataset/                # Folder for TMDb CSV files
```

## ⚙️ Installation & Local Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd movie_recomender_system
```

### 2. Prepare the Dataset & Models
1. Download `tmdb_5000_movies.csv` and `tmdb_5000_credits.csv` from Kaggle.
2. Place them in the `dataset/` folder.
3. Open `movie_recommender.ipynb` (e.g. via Jupyter Notebook or VS Code) and run it cell by cell.
4. This will process the data and generate `movies.pkl` and `similarity.pkl` in the root directory.

### 3. Setup Virtual Environment
```bash
python -m venv venv
# On Windows use: venv\Scripts\activate
# On Mac/Linux use: source venv/bin/activate
venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Run the Flask App
```bash
python app.py
```
Visit `http://localhost:8000` in your browser.

## 🧠 ML Workflow
The `movie_recommender.ipynb` notebook processes the raw data through these steps:
1. **Data Merging & Cleaning**: Combines movies and credits datasets, removes missing values.
2. **Feature Extraction**: Extracts actual names from JSON-like strings for genres, keywords, cast (top 3), and director.
3. **Text Processing**: Removes spaces from words, converts to lowercase, and applies Porter Stemming.
4. **Vectorization**: Uses `CountVectorizer(max_features=5000, stop_words='english')`.
5. **Similarity Matrix**: Calculates cosine similarity between vectors.

## 🌐 Deployment on Vercel
This project is configured for Vercel serverless deployment out-of-the-box.
1. Push your code (including `movies.pkl` and `similarity.pkl`) to GitHub.
2. Go to Vercel, link your GitHub account, and import your repository.
3. Vercel will automatically use `vercel.json` and `runtime.txt` to build and deploy the Flask app.

*Note: Vercel has a 250MB size limit for serverless functions. Ensure your generated `.pkl` files and dependencies do not exceed this.*

## 🔑 TMDb API Setup
1. Create a free account at [The Movie Database (TMDb)](https://www.themoviedb.org/).
2. Get your API key from your profile settings.
3. Update the `api_key` variable in the `fetch_poster()` function inside `app.py`.

## 🔮 Future Improvements
- Implement Collaborative Filtering for better recommendations.
- Add user authentication to save favorite movies.
- Paginate the recommendations.
