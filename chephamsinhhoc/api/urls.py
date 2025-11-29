from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# ============================================================
# ROUTER CONFIGURATION
# ============================================================
router = DefaultRouter()

# Đăng ký các ViewSets
router.register(r'users', views.UserViewSet, basename='users')
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'articles', views.ArticleViewSet, basename='articles')
router.register(r'contacts', views.ContactViewSet, basename='contacts')
router.register(r'settings', views.SettingViewSet, basename='settings')
router.register(r'social-media', views.SocialMediaViewSet, basename='social-media')
router.register(r'certifications', views.CertificationViewSet, basename='certifications')
router.register(r'categories', views.CategoryViewSet, basename='categories')
router.register(r'about-features', views.AboutFeatureViewSet, basename='about-features')
router.register(r'about-values', views.AboutValueViewSet, basename='about-values')
router.register(r'activity-logs', views.ActivityLogViewSet, basename='activity-logs')
router.register(r'media', views.MediaViewSet, basename='media')

# ============================================================
# URL PATTERNS
# ============================================================
urlpatterns = [
    # Authentication endpoints
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.profile_view, name='profile'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Image upload
    path('upload-image/', views.upload_image, name='upload-image'),
    
    # Dashboard
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    
    # Router URLs
    path('', include(router.urls)),
]