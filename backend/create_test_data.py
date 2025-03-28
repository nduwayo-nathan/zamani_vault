
import os
import django
import random
import datetime
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zamanivault.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import UserActivity
from content.models import Content, Category, ContentCategory, Comment
from subscriptions.models import SubscriptionPlan, UserSubscription
from ml_service.models import MLModel

User = get_user_model()

def create_test_data():
    print("Creating test data...")

    # Create admin user
    admin_user, created = User.objects.get_or_create(
        email='admin@example.com',
        defaults={
            'first_name': 'Admin',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True,
            'subscription_type': 'premium'
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"Created admin user: {admin_user.email}")
    
    # Create regular user
    regular_user, created = User.objects.get_or_create(
        email='user@example.com',
        defaults={
            'first_name': 'Test',
            'last_name': 'User',
            'subscription_type': 'free'
        }
    )
    if created:
        regular_user.set_password('user123')
        regular_user.save()
        print(f"Created regular user: {regular_user.email}")
    
    # Create subscription plans
    plans = [
        {
            'name': 'Free',
            'description': 'Basic access to free content',
            'price': 0.00,
            'billing_cycle': 'monthly',
            'features': ['Access to free content', 'Limited recommendations']
        },
        {
            'name': 'Premium',
            'description': 'Full access to all content and features',
            'price': 9.99,
            'billing_cycle': 'monthly',
            'features': ['Access to all content', 'Advanced recommendations', 'HD video quality']
        },
        {
            'name': 'Scholar',
            'description': 'Academic access with research tools',
            'price': 19.99,
            'billing_cycle': 'monthly',
            'features': ['Access to all content', 'Research tools', 'Export functionality', 'Citation tools']
        }
    ]
    
    for plan_data in plans:
        plan, created = SubscriptionPlan.objects.get_or_create(
            name=plan_data['name'],
            defaults={
                'description': plan_data['description'],
                'price': plan_data['price'],
                'billing_cycle': plan_data['billing_cycle'],
                'features': plan_data['features']
            }
        )
        if created:
            print(f"Created subscription plan: {plan.name}")
    
    # Create categories
    categories = [
        {
            'name': 'Ancient Kingdoms',
            'description': 'Content about ancient African kingdoms and empires'
        },
        {
            'name': 'Historical Figures',
            'description': 'Biographies and content about important historical figures'
        },
        {
            'name': 'Architecture',
            'description': 'African architectural history and structures'
        },
        {
            'name': 'Artifacts',
            'description': 'Historical artifacts and archaeological finds'
        },
        {
            'name': 'Cultural Practices',
            'description': 'Content about cultural traditions and practices'
        }
    ]
    
    for i, category_data in enumerate(categories):
        category, created = Category.objects.get_or_create(
            name=category_data['name'],
            defaults={
                'description': category_data['description'],
                'order': i
            }
        )
        if created:
            print(f"Created category: {category.name}")
    
    # Create content
    content_items = [
        {
            'title': 'The Great Mali Empire',
            'description': 'Documentary about the Mali Empire and its influence on West Africa',
            'content_type': 'video',
            'is_premium': False,
            'duration': '45:20',
            'tags': ['mali', 'empire', 'west africa', 'mansa musa'],
            'creator': 'African History Channel',
            'year': 2022,
            'region': 'West Africa',
            'categories': ['Ancient Kingdoms']
        },
        {
            'title': 'Mansa Musa: The Richest Man in History',
            'description': 'Biography of Mansa Musa, ruler of the Mali Empire',
            'content_type': 'video',
            'is_premium': True,
            'duration': '32:15',
            'tags': ['mansa musa', 'mali', 'biography', 'wealth'],
            'creator': 'Historical Biographies',
            'year': 2021,
            'region': 'West Africa',
            'categories': ['Historical Figures', 'Ancient Kingdoms']
        },
        {
            'title': 'Great Zimbabwe: Engineering Marvel',
            'description': 'Analysis of the architectural achievements of Great Zimbabwe',
            'content_type': 'article',
            'is_premium': False,
            'tags': ['great zimbabwe', 'architecture', 'stone buildings'],
            'creator': 'Archaeological Review',
            'year': 2023,
            'region': 'Southern Africa',
            'categories': ['Architecture', 'Ancient Kingdoms']
        },
        {
            'title': 'The Benin Bronzes',
            'description': 'Comprehensive guide to the famous Benin Bronzes',
            'content_type': 'book',
            'is_premium': True,
            'duration': '320 pages',
            'tags': ['benin', 'bronzes', 'art', 'sculpture'],
            'creator': 'Dr. Adebayo Ogunlesi',
            'year': 2020,
            'region': 'West Africa',
            'categories': ['Artifacts', 'Cultural Practices']
        },
        {
            'title': 'Pyramids of Nubia',
            'description': 'Exploration of the pyramids of ancient Nubia and Kush',
            'content_type': 'video',
            'is_premium': True,
            'duration': '58:30',
            'tags': ['nubia', 'kush', 'pyramids', 'archaeology'],
            'creator': 'Ancient Explorers',
            'year': 2021,
            'region': 'East Africa',
            'categories': ['Architecture', 'Ancient Kingdoms']
        }
    ]
    
    for content_data in content_items:
        category_names = content_data.pop('categories')
        content, created = Content.objects.get_or_create(
            title=content_data['title'],
            defaults={
                'description': content_data['description'],
                'content_type': content_data['content_type'],
                'is_premium': content_data['is_premium'],
                'duration': content_data.get('duration', ''),
                'tags': content_data['tags'],
                'creator': content_data['creator'],
                'year': content_data['year'],
                'region': content_data['region'],
                'is_featured': random.choice([True, False]),
                'view_count': random.randint(50, 1000)
            }
        )
        
        if created:
            print(f"Created content: {content.title}")
            
            # Add categories
            for category_name in category_names:
                try:
                    category = Category.objects.get(name=category_name)
                    ContentCategory.objects.get_or_create(content=content, category=category)
                except Category.DoesNotExist:
                    pass
    
    # Create user activity
    if Content.objects.exists():
        for _ in range(20):
            content = random.choice(Content.objects.all())
            user = random.choice([admin_user, regular_user])
            action = random.choice(['view', 'like', 'bookmark'])
            
            UserActivity.objects.create(
                user=user,
                content_id=str(content.id),
                content_type=content.content_type,
                action=action,
                progress=random.random() if action == 'view' else 0
            )
        print("Created user activity records")
    
    # Create comments
    if Content.objects.exists():
        for content in Content.objects.all():
            for _ in range(random.randint(0, 3)):
                user = random.choice([admin_user, regular_user])
                
                comment = Comment.objects.create(
                    content=content,
                    user=user,
                    text=f"This is a test comment on {content.title}."
                )
                
                # Add a reply occasionally
                if random.random() > 0.5:
                    reply_user = admin_user if user == regular_user else regular_user
                    Comment.objects.create(
                        content=content,
                        user=reply_user,
                        parent=comment,
                        text=f"This is a reply to the comment on {content.title}."
                    )
        print("Created comments")
    
    # Create ML model record
    MLModel.objects.get_or_create(
        name="Content Recommendation Engine",
        defaults={
            'version': '1.0.0',
            'file_path': 'ml_service/models/recommendation_model.pkl',
            'description': 'Model for recommending content based on user activity',
            'metrics': {
                'accuracy': 0.85,
                'precision': 0.82,
                'recall': 0.79
            },
            'is_active': True
        }
    )
    print("Created ML model record")
    
    print("Test data creation complete!")

if __name__ == '__main__':
    create_test_data()
