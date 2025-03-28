
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.conf import settings

# Path to the ML model
MODEL_PATH = getattr(settings, 'ML_MODEL_PATH', 'ml_service/models/recommendation_model.pkl')

def load_model():
    """Load the ML model from disk."""
    try:
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            return model
        else:
            print(f"Model file not found at {MODEL_PATH}")
            return None
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def get_content_recommendations(user_id, content_data, user_activity_data, top_n=5):
    """
    Generate content recommendations for a user based on their viewing history.
    
    In a real implementation, this would use the trained model. For now,
    we'll use a simple content-based filtering approach.
    """
    # Convert to DataFrames for easier manipulation
    content_df = pd.DataFrame(content_data)
    user_activity_df = pd.DataFrame(user_activity_data)
    
    # Filter activities for this user
    user_activities = user_activity_df[user_activity_df['user_id'] == user_id]
    
    if user_activities.empty:
        # User has no activity, return popular content
        popular_content = content_df.sort_values(by='view_count', ascending=False).head(top_n)
        recommendations = []
        for _, content in popular_content.iterrows():
            recommendations.append({
                'content_id': str(content['id']),
                'score': 0.5,  # Default score
                'reason': 'Popular content you might enjoy'
            })
        return recommendations
    
    # Get user's viewed content
    viewed_content_ids = user_activities['content_id'].unique()
    
    # Get user's content preferences
    if 'content_type' in user_activities.columns:
        type_counts = user_activities['content_type'].value_counts()
        preferred_type = type_counts.index[0] if not type_counts.empty else None
    else:
        preferred_type = None
    
    # Combine title and description for content-based filtering
    content_df['text_features'] = content_df['title'] + ' ' + content_df['description']
    
    # Convert tags from JSON string to list if needed
    if 'tags' in content_df.columns and isinstance(content_df['tags'].iloc[0], str):
        content_df['tags'] = content_df['tags'].apply(lambda x: ' '.join(eval(x)) if x else '')
        content_df['text_features'] += ' ' + content_df['tags']
    elif 'tags' in content_df.columns:
        content_df['text_features'] += ' ' + content_df['tags'].apply(lambda x: ' '.join(x) if x else '')
    
    # Create TF-IDF vectors
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(content_df['text_features'].fillna(''))
    
    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Get indices of content viewed by user
    viewed_indices = content_df[content_df['id'].isin(viewed_content_ids)].index.tolist()
    
    # Calculate average similarity score for each content
    sim_scores = np.zeros(len(content_df))
    for idx in viewed_indices:
        sim_scores += cosine_sim[idx]
    
    if viewed_indices:
        sim_scores = sim_scores / len(viewed_indices)
    
    # Create a Series with content indices and similarity scores
    sim_scores_series = pd.Series(sim_scores, index=content_df.index)
    
    # Filter out already viewed content
    sim_scores_series = sim_scores_series.drop(viewed_indices, errors='ignore')
    
    # Get top N recommendations
    top_indices = sim_scores_series.sort_values(ascending=False).head(top_n).index
    
    # Build recommendation response
    recommendations = []
    for idx in top_indices:
        content = content_df.iloc[idx]
        score = sim_scores_series[idx]
        
        # Determine reason for recommendation
        if preferred_type and content['content_type'] == preferred_type:
            reason = f"Based on your interest in {preferred_type}s"
        else:
            reason = "Similar to content you've viewed"
        
        recommendations.append({
            'content_id': str(content['id']),
            'score': min(max(score, 0.0), 1.0),  # Ensure score is between 0 and 1
            'reason': reason
        })
    
    return recommendations

def get_user_insights(user_id, user_activity_data, content_data):
    """
    Generate insights about a user's interests based on their viewing history.
    """
    # Convert to DataFrames
    activity_df = pd.DataFrame(user_activity_data)
    content_df = pd.DataFrame(content_data)
    
    # Filter for this user
    user_activities = activity_df[activity_df['user_id'] == user_id]
    
    if user_activities.empty:
        return []
    
    # Merge with content data
    merged_df = user_activities.merge(content_df, left_on='content_id', right_on='id')
    
    # Calculate interest by category
    if 'category' in merged_df.columns:
        category_counts = merged_df['category'].value_counts().reset_index()
        category_counts.columns = ['category', 'count']
        total = category_counts['count'].sum()
        category_counts['interest'] = (category_counts['count'] / total * 100).astype(int)
        
        # For trend, we'd need historical data. For now, generate random trends
        import random
        trends = ['increasing', 'decreasing', 'stable']
        category_counts['trend'] = [random.choice(trends) for _ in range(len(category_counts))]
        
        # Convert to insight format
        insights = category_counts[['category', 'interest', 'trend']].to_dict('records')
        return insights
    
    # Alternative: use content_type if category is not available
    else:
        type_counts = merged_df['content_type'].value_counts().reset_index()
        type_counts.columns = ['category', 'count']
        total = type_counts['count'].sum()
        type_counts['interest'] = (type_counts['count'] / total * 100).astype(int)
        
        import random
        trends = ['increasing', 'decreasing', 'stable']
        type_counts['trend'] = [random.choice(trends) for _ in range(len(type_counts))]
        
        insights = type_counts[['category', 'interest', 'trend']].to_dict('records')
        return insights

def get_content_trends(content_data, activity_data, period='month'):
    """
    Analyze content viewing trends.
    """
    # Convert to DataFrames
    content_df = pd.DataFrame(content_data)
    activity_df = pd.DataFrame(activity_data)
    
    # Calculate total views per content
    content_views = activity_df[activity_df['action'] == 'view'].groupby('content_id').size().reset_index(name='views')
    
    # Merge with content data
    merged_df = content_views.merge(content_df, left_on='content_id', right_on='id')
    
    # Calculate views by category
    if 'category' in merged_df.columns:
        category_field = 'category'
    else:
        category_field = 'content_type'
    
    category_views = merged_df.groupby(category_field)['views'].sum().reset_index()
    
    # Calculate popularity (normalized)
    total_views = category_views['views'].sum()
    if total_views > 0:
        category_views['popularity'] = (category_views['views'] / total_views * 100).astype(int)
    else:
        category_views['popularity'] = 0
    
    # Add mock growth rate (would be calculated with historical data in real implementation)
    import random
    category_views['growth_rate'] = [round(random.uniform(-0.1, 0.2), 2) for _ in range(len(category_views))]
    
    # Rename columns to match expected format
    category_views = category_views.rename(columns={category_field: 'category', 'views': 'view_count'})
    
    return category_views.to_dict('records')

def get_user_segments(user_data, activity_data, content_data):
    """
    Identify user segments based on viewing behavior.
    """
    # In a real implementation, this would use clustering algorithms on user behavior
    # For now, return mock segments
    
    segments = [
        {
            'id': 'segment-1',
            'name': 'History Enthusiasts',
            'size': 1240,
            'top_interests': ['Ancient Kingdoms', 'Historical Figures'],
            'avg_session_duration': 25.3
        },
        {
            'id': 'segment-2',
            'name': 'Academic Researchers',
            'size': 850,
            'top_interests': ['Primary Sources', 'Archaeological Findings'],
            'avg_session_duration': 42.7
        },
        {
            'id': 'segment-3',
            'name': 'Casual Learners',
            'size': 3200,
            'top_interests': ['Video Content', 'Famous Stories'],
            'avg_session_duration': 15.1
        },
        {
            'id': 'segment-4',
            'name': 'Educators',
            'size': 780,
            'top_interests': ['Educational Materials', 'Timelines'],
            'avg_session_duration': 35.8
        }
    ]
    
    return segments

def predict_content_performance(content_data):
    """
    Predict how well a new piece of content will perform.
    
    In a real implementation, this would use regression models trained on historical data.
    """
    import random
    
    # Mock prediction
    prediction = {
        'estimated_views': random.randint(1000, 10000),
        'target_audience': ['scholars', 'history enthusiasts', 'students'],
        'engagement_score': random.randint(50, 100)
    }
    
    return prediction
