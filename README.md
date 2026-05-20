# Movie Recommender

A Machine Learning based Movie Recommendation System built using Flask and deployed as a full-stack web application.

---

## Overview

This project implements a content-based movie recommendation engine that suggests similar movies based on movie metadata such as genres, keywords, cast, directors, and movie overviews.

The system uses Natural Language Processing (NLP) techniques along with cosine similarity to identify and recommend the most relevant movies to users.

The application is deployed online and provides a clean, responsive web interface for real-time recommendations.

---

## Features

* Content-Based Movie Recommendation System
* Cosine Similarity based recommendation engine
* Real movie posters fetched dynamically using TMDb API
* Fast recommendation generation
* Responsive Netflix-style UI
* Flask backend with serverless deployment
* Fully deployed web application on Vercel

---

## Live Application

🎬 Deployed Web App:

[Movie Recommender Live Website](https://movie-recommender-system-pkyhqky95-sidduvanam07-1005s-projects.vercel.app/)

---

## Machine Learning Workflow

The recommendation engine follows the following workflow:

```text
User Selects Movie
        ↓
Movie Metadata Processing
        ↓
Feature Extraction & NLP Processing
        ↓
Count Vectorization
        ↓
Cosine Similarity Computation
        ↓
Top-5 Similar Movie Recommendations
        ↓
Results Displayed on Web Interface
```

---

## ML Model Details

### Algorithm Used

* Content-Based Filtering
* Cosine Similarity

### NLP Techniques

* Tokenization
* Stemming using Porter Stemmer
* Count Vectorization

### Features Used

The recommendation system analyzes:

* Genres
* Keywords
* Cast
* Director
* Movie Overview

---

## Dataset

Dataset Used: TMDb 5000 Movies Dataset

The dataset contains metadata for 5000+ movies including:

* Genres
* Cast Information
* Keywords
* Movie Descriptions
* Crew Information
* Ratings & Popularity

This metadata is processed and transformed into feature vectors for similarity computation.

---

## Tech Stack

### Backend

* Python
* Flask

### Machine Learning & Data Processing

* Pandas
* NumPy
* scikit-learn
* NLTK

### Frontend

* HTML
* CSS
* JavaScript
* jQuery
* Select2

### Deployment

* Vercel

---

## Project Structure

```text
Movie_recommender/
│
├── app.py
├── movies.pkl
├── vectors.pkl
├── requirements.txt
├── runtime.txt
├── vercel.json
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
```

---

## Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sidduvanam07/movie-recommender-system.git
cd movie-recommender-system
```

---

### 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate virtual environment:

#### Windows

```bash
venv\Scripts\activate
```

#### Mac/Linux

```bash
source venv/bin/activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Run the Flask Application

```bash
python app.py
```

Open in browser:

```text
http://localhost:8000
```

---

## Performance

* Dataset Size: 5000+ Movies
* Recommendation Speed: < 1 second
* Recommendation Type: Top-5 Similar Movies
* Real-Time Poster Fetching using TMDb API

---

## Deployment

The application is deployed on Vercel using serverless Flask deployment.

To deploy your own version:

1. Push the project to GitHub
2. Import repository into Vercel
3. Configure Python runtime
4. Deploy directly from GitHub
---

## Author

sidduvanam07

