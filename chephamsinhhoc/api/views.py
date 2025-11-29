"""
EBGreentek Django REST Framework Views
Tạo ngày: 2025-01-27
Framework: Django REST Framework 3.14+
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q, Count, Sum
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    User, Product, Article, Contact, Setting,
    SocialMedia, Certification, Category,
    AboutFeature, AboutValue, ActivityLog, Media
)
from .serializers import (
    UserSerializer, UserLoginSerializer, UserProfileSerializer,
    ProductSerializer, ProductListSerializer, ProductDetailSerializer,
    ArticleSerializer, ArticleListSerializer, ArticleDetailSerializer,
    ContactSerializer, ContactCreateSerializer, ContactReplySerializer,
    SettingSerializer, SettingPublicSerializer, SettingBulkUpdateSerializer,
    SocialMediaSerializer, CertificationSerializer, CategorySerializer, CategoryTreeSerializer,
    AboutFeatureSerializer, AboutValueSerializer,
    ActivityLogSerializer, MediaSerializer, MediaUploadSerializer,
    DashboardStatsSerializer
)


# ============================================================
# CUSTOM PAGINATION
# ============================================================
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 50


class ArticlePagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50


# ============================================================
# AUTHENTICATION VIEWS
# ============================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Đăng nhập và lấy JWT token"""
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Tên đăng nhập hoặc mật khẩu không đúng'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if user.status != 'active':
        return Response(
            {'error': 'Tài khoản đã bị vô hiệu hóa'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Update last login
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    # Log activity
    ActivityLog.objects.create(
        user=user,
        action='login',
        description=f'User {username} logged in',
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserProfileSerializer(user).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Đăng xuất"""
    # Log activity
    ActivityLog.objects.create(
        user=request.user,
        action='logout',
        description=f'User {request.user.username} logged out',
        ip_address=get_client_ip(request)
    )
    
    return Response({'message': 'Đăng xuất thành công'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Lấy thông tin profile"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


def get_client_ip(request):
    """Lấy IP của client"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


# ============================================================
# USER VIEWSET
# ============================================================
class UserViewSet(viewsets.ModelViewSet):
    """API CRUD cho User"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'email', 'full_name']
    filterset_fields = ['role', 'status']


# ============================================================
# PRODUCT VIEWSET
# ============================================================
class ProductViewSet(viewsets.ModelViewSet):
    """API CRUD cho Product"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = ProductPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'category']
    filterset_fields = ['category', 'status', 'is_popular']
    ordering_fields = ['created_at', 'view_count', 'sort_order']
    ordering = ['-is_popular', 'sort_order', '-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer
    
    def get_queryset(self):
        """Filter products dựa vào permissions"""
        queryset = Product.objects.all()
        
        # Nếu không phải admin, chỉ hiển thị active products
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='active')
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Tăng view count khi xem chi tiết"""
        instance = self.get_object()
        instance.increment_view()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Lấy sản phẩm phổ biến"""
        products = self.get_queryset().filter(is_popular=True, status='active')[:8]
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Lấy sản phẩm theo danh mục"""
        category = request.query_params.get('category')
        if not category:
            return Response({'error': 'Category required'}, status=status.HTTP_400_BAD_REQUEST)
        
        products = self.get_queryset().filter(category=category, status='active')
        page = self.paginate_queryset(products)
        
        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


# ============================================================
# ARTICLE VIEWSET
# ============================================================
class ArticleViewSet(viewsets.ModelViewSet):
    """API CRUD cho Article"""
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = ArticlePagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'excerpt', 'content', 'category']
    filterset_fields = ['category', 'status', 'is_featured', 'author']
    ordering_fields = ['created_at', 'published_at', 'view_count']
    ordering = ['-is_featured', '-published_at', '-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        elif self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleSerializer
    
    def get_queryset(self):
        """Filter articles dựa vào permissions"""
        queryset = Article.objects.all()
        
        # Nếu không phải admin, chỉ hiển thị published articles
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(
                status='published',
                published_at__lte=timezone.now()
            )
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Tăng view count khi xem chi tiết"""
        instance = self.get_object()
        instance.increment_view()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Lấy bài viết nổi bật"""
        articles = self.get_queryset().filter(is_featured=True, status='published')[:3]
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Lấy bài viết theo danh mục"""
        category = request.query_params.get('category')
        if not category:
            return Response({'error': 'Category required'}, status=status.HTTP_400_BAD_REQUEST)
        
        articles = self.get_queryset().filter(category=category, status='published')
        page = self.paginate_queryset(articles)
        
        if page is not None:
            serializer = ArticleListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)
# ============================================================
# CONTACT VIEWSET
# ============================================================
class ContactViewSet(viewsets.ModelViewSet):
    """API CRUD cho Contact"""
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'email', 'message']
    filterset_fields = ['status']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """Public có thể tạo contact, admin mới xem được list"""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ContactCreateSerializer
        return ContactSerializer
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Phản hồi liên hệ"""
        contact = self.get_object()
        serializer = ContactReplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        contact.admin_reply = serializer.validated_data['admin_reply']
        contact.replied_at = timezone.now()
        contact.replied_by_id = request.user.id        
        contact.status = 'replied'
        contact.save()
        
        # Log activity
        ActivityLog.objects.create(
            user_id=request.user.id,
            action='reply_contact',
            entity_type='contact',
            entity_id=contact.id,
            description=f'Replied to contact from {contact.name}'
        )
        
        return Response(ContactSerializer(contact).data)
    
    @action(detail=False, methods=['get'])
    def new(self, request):
        """Lấy liên hệ mới"""
        contacts = self.get_queryset().filter(status='new')
        page = self.paginate_queryset(contacts)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)


# ============================================================
# SETTING VIEWSET
# ============================================================
class SettingViewSet(viewsets.ModelViewSet):
    """API CRUD cho Setting"""
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    pagination_class = None  # Không phân trang
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['setting_group', 'is_public']
    lookup_field = 'setting_key'
    
    def get_permissions(self):
        """Public có thể xem settings public"""
        if self.action in ['list', 'retrieve', 'public']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter settings dựa vào permissions"""
        if self.request.user.is_authenticated:
            return Setting.objects.all()
        return Setting.objects.filter(is_public=True)
    
    @action(detail=False, methods=['get'])
    def public(self, request):
        """Lấy tất cả settings public"""
        settings = Setting.objects.filter(is_public=True)
        
        # Group by setting_group
        grouped = {}
        for setting in settings:
            group = setting.setting_group
            if group not in grouped:
                grouped[group] = {}
            grouped[group][setting.setting_key] = setting.setting_value
        
        return Response(grouped)
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Cập nhật nhiều settings cùng lúc"""
        serializer = SettingBulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        settings_data = serializer.validated_data['settings']
        updated = []
        
        for key, value in settings_data.items():
            # Extract group from key (e.g., "general.logo_url" -> "general")
            group = key.split('.')[0] if '.' in key else 'general'
            
            setting, created = Setting.objects.update_or_create(
                setting_key=key,
                defaults={
                    'setting_value': value,
                    'setting_group': group,
                    'is_public': True  # Auto-set public for bulk updates
                }
            )
            updated.append(setting.setting_key)
        
        return Response({
            'message': f'Updated {len(updated)} settings',
            'updated': updated
        })



# ============================================================
# SOCIAL MEDIA VIEWSET
# ============================================================
class SocialMediaViewSet(viewsets.ModelViewSet):
    """API CRUD cho Social Media"""
    queryset = SocialMedia.objects.all()
    serializer_class = SocialMediaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    ordering = ['sort_order', 'platform']
    
    def get_queryset(self):
        """Chỉ hiển thị active social media cho public"""
        queryset = SocialMedia.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)
        return queryset.order_by('sort_order', 'platform')


# ============================================================
# CERTIFICATION VIEWSET
# ============================================================
class CertificationViewSet(viewsets.ModelViewSet):
    """API CRUD cho Certification"""
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    ordering = ['sort_order', 'name']
    
    def get_queryset(self):
        """Chỉ hiển thị active certifications cho public"""
        queryset = Certification.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)
        return queryset.order_by('sort_order', 'name')


# ============================================================
# CATEGORY VIEWSET
# ============================================================
class CategoryViewSet(viewsets.ModelViewSet):
    """API CRUD cho Category"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'is_active']
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Lấy cây danh mục"""
        type_filter = request.query_params.get('type')
        queryset = Category.objects.filter(parent__isnull=True, is_active=True)
        
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        
        queryset = queryset.order_by('sort_order', 'name')
        serializer = CategoryTreeSerializer(queryset, many=True)
        return Response(serializer.data)


# ============================================================
# ABOUT FEATURE VIEWSET
# ============================================================
class AboutFeatureViewSet(viewsets.ModelViewSet):
    """API CRUD cho About Feature"""
    queryset = AboutFeature.objects.all()
    serializer_class = AboutFeatureSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    ordering = ['sort_order']
    
    def get_queryset(self):
        """Chỉ hiển thị active features cho public"""
        queryset = AboutFeature.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)
        return queryset.order_by('sort_order')


# ============================================================
# ABOUT VALUE VIEWSET
# ============================================================
class AboutValueViewSet(viewsets.ModelViewSet):
    """API CRUD cho About Value"""
    queryset = AboutValue.objects.all()
    serializer_class = AboutValueSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None
    ordering = ['sort_order']
    
    def get_queryset(self):
        """Chỉ hiển thị active values cho public"""
        queryset = AboutValue.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)
        return queryset.order_by('sort_order')


# ============================================================
# ACTIVITY LOG VIEWSET
# ============================================================
class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """API read-only cho Activity Log"""
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['user', 'action', 'entity_type']
    ordering = ['-created_at']



# ============================================================
# MEDIA VIEWSET
# ============================================================
class MediaViewSet(viewsets.ModelViewSet):
    """API CRUD cho Media"""
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['file_name']
    filterset_fields = ['file_type', 'entity_type', 'is_public']
    ordering = ['-created_at']


# ============================================================
# IMAGE UPLOAD VIEW
# ============================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """Upload image và trả về URL"""
    try:
        if 'image' not in request.FILES:
            return Response(
                {'error': 'Không có file ảnh'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        image_file = request.FILES['image']
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if image_file.content_type not in allowed_types:
            return Response(
                {'error': 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (max 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        if image_file.size > max_size:
            return Response(
                {'error': 'File quá lớn. Kích thước tối đa 5MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user instance properly
        print(f"🔍 DEBUG: request.user type = {type(request.user)}")
        print(f"🔍 DEBUG: request.user = {request.user}")
        print(f"🔍 DEBUG: is_authenticated = {request.user.is_authenticated if hasattr(request.user, 'is_authenticated') else 'N/A'}")
        
        try:
            user_instance = User.objects.get(id=request.user.id) if request.user and request.user.is_authenticated else None
            print(f"✅ DEBUG: user_instance = {user_instance}")
        except Exception as user_err:
            print(f"❌ DEBUG: Failed to get user - {user_err}")
            user_instance = None
        
        # Create Media object
        media = Media.objects.create(
            file_name=image_file.name,
            file_size=image_file.size,
            file_type='image',
            is_public=True,
            uploaded_by=user_instance
        )
        
        # Save file
        media.file.save(image_file.name, image_file, save=True)
        
        # Log activity
        ActivityLog.objects.create(
            user=user_instance,
            action='upload_image',
            description=f'Uploaded image: {image_file.name}',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Return URL
        return Response({
            'url': request.build_absolute_uri(media.file.url),
            'file_url': request.build_absolute_uri(media.file.url),
            'image_url': request.build_absolute_uri(media.file.url),
            'id': str(media.id),
            'file_name': media.file_name,
            'file_size': media.file_size
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



# ============================================================
# DASHBOARD VIEW
# ============================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Lấy thống kê cho dashboard"""
    from django.db.models import Q
    from datetime import date
    
    stats = {
        'total_products': Product.objects.filter(status='active').count(),
        'total_articles': Article.objects.filter(status='published').count(),
        'new_contacts': Contact.objects.filter(status='new').count(),
        'today_contacts': Contact.objects.filter(created_at__date=date.today()).count(),
        'total_product_views': Product.objects.aggregate(Sum('view_count'))['view_count__sum'] or 0,
        'total_article_views': Article.objects.aggregate(Sum('view_count'))['view_count__sum'] or 0,
    }
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)
