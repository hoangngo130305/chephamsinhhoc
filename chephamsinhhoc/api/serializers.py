"""
EBGreentek Django REST Framework Serializers
Compatible với MariaDB 10.4
Tạo ngày: 2025-01-27
Framework: Django REST Framework 3.14+
"""

from rest_framework import serializers
from .models import (
    User, Product, Article, Contact, Setting, 
    SocialMedia, Certification, Category, 
    AboutFeature, AboutValue, ActivityLog, Media
)
from django.contrib.auth.hashers import make_password
import json


# ============================================================
# 1. USER SERIALIZERS
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    """Serializer cho User"""
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'full_name', 
            'role', 'status', 'last_login', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """Hash password khi tạo user"""
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Hash password khi update user"""
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)


class UserLoginSerializer(serializers.Serializer):
    """Serializer cho login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer cho user profile (không có password)"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'status']


# ============================================================
# 2. PRODUCT SERIALIZERS
# ============================================================
class ProductSerializer(serializers.ModelSerializer):
    """Serializer cho Product - Compatible với MariaDB 10.4"""
    
    # Override JSON fields to handle TextField storage
    features = serializers.ListField(child=serializers.CharField(), required=False, allow_null=True)
    benefits = serializers.ListField(child=serializers.CharField(), required=False, allow_null=True)
    packaging = serializers.ListField(child=serializers.CharField(), required=False, allow_null=True)
    images = serializers.ListField(child=serializers.CharField(), required=False, allow_null=True)
    image_labels = serializers.ListField(child=serializers.CharField(), required=False, allow_null=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'description', 'features', 
            'usage', 'ingredients', 'benefits', 'packaging', 
            'images', 'image_labels', 'status', 'is_popular', 
            'sort_order', 'view_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'view_count', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        """Convert TextField JSON to list when reading"""
        data = super().to_representation(instance)
        
        # Parse JSON fields
        data['features'] = instance.get_features()
        data['benefits'] = instance.get_benefits()
        data['packaging'] = instance.get_packaging()
        data['images'] = instance.get_images()
        data['image_labels'] = instance.get_image_labels()
        
        return data
    
    def to_internal_value(self, data):
        """Convert list to JSON string when writing"""
        internal_data = super().to_internal_value(data)
        return internal_data
    
    def create(self, validated_data):
        """Create product with JSON field conversion"""
        # Extract list fields
        features = validated_data.pop('features', None)
        benefits = validated_data.pop('benefits', None)
        packaging = validated_data.pop('packaging', None)
        images = validated_data.pop('images', None)
        image_labels = validated_data.pop('image_labels', None)
        
        # Create instance
        instance = Product(**validated_data)
        
        # Set JSON fields using helper methods
        if features is not None:
            instance.set_features(features)
        if benefits is not None:
            instance.set_benefits(benefits)
        if packaging is not None:
            instance.set_packaging(packaging)
        if images is not None:
            instance.set_images(images)
        if image_labels is not None:
            instance.set_image_labels(image_labels)
        
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        """Update product with JSON field conversion"""
        # Extract list fields
        features = validated_data.pop('features', None)
        benefits = validated_data.pop('benefits', None)
        packaging = validated_data.pop('packaging', None)
        images = validated_data.pop('images', None)
        image_labels = validated_data.pop('image_labels', None)
        
        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update JSON fields using helper methods
        if features is not None:
            instance.set_features(features)
        if benefits is not None:
            instance.set_benefits(benefits)
        if packaging is not None:
            instance.set_packaging(packaging)
        if images is not None:
            instance.set_images(images)
        if image_labels is not None:
            instance.set_image_labels(image_labels)
        
        instance.save()
        return instance
    
    def validate_features(self, value):
        """Validate features phải là list"""
        if value and not isinstance(value, list):
            raise serializers.ValidationError("Features phải là danh sách")
        return value
    
    def validate_images(self, value):
        """Validate images phải là list"""
        if value and not isinstance(value, list):
            raise serializers.ValidationError("Images phải là danh sách")
        return value


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer cho danh sách sản phẩm (compact)"""
    images = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'description', 
            'images', 'status', 'is_popular', 'view_count'
        ]
    
    def get_images(self, obj):
        """Get parsed images"""
        return obj.get_images()


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer cho chi tiết sản phẩm"""
    features = serializers.SerializerMethodField()
    benefits = serializers.SerializerMethodField()
    packaging = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    image_labels = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_features(self, obj):
        return obj.get_features()
    
    def get_benefits(self, obj):
        return obj.get_benefits()
    
    def get_packaging(self, obj):
        return obj.get_packaging()
    
    def get_images(self, obj):
        return obj.get_images()
    
    def get_image_labels(self, obj):
        return obj.get_image_labels()


# ============================================================
# 3. ARTICLE SERIALIZERS
# ============================================================
class ArticleSerializer(serializers.ModelSerializer):
    """Serializer cho Article - Compatible với MariaDB 10.4"""
    tags = serializers.ListField(child=serializers.CharField(), required=False, allow_null=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'category', 'excerpt', 'content', 
            'image', 'author', 'tags', 'status', 'is_featured', 
            'view_count', 'read_time', 'published_at', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'view_count', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        """Convert TextField JSON to list when reading"""
        data = super().to_representation(instance)
        data['tags'] = instance.get_tags()
        return data
    
    def create(self, validated_data):
        """Create article with JSON field conversion"""
        tags = validated_data.pop('tags', None)
        
        print(f'✅ [ArticleSerializer] Creating article with data: {validated_data.keys()}')
        print(f'📝 [ArticleSerializer] Content length: {len(validated_data.get("content", ""))} chars')
        print(f'📝 [ArticleSerializer] Status: {validated_data.get("status")}')
        
        instance = Article(**validated_data)
        
        if tags is not None:
            instance.set_tags(tags)
        
        print(f'📝 Creating new article: "{instance.title}" with status: {instance.status}')
        instance.save()  # Model.save() will auto-set published_at if status='published'
        return instance
    
    def update(self, instance, validated_data):
        """Update article with JSON field conversion"""
        tags = validated_data.pop('tags', None)
        
        print(f'✅ [ArticleSerializer] Updating article "{instance.title}" with data: {validated_data.keys()}')
        print(f'📝 [ArticleSerializer] Content length: {len(validated_data.get("content", instance.content))} chars')
        print(f'📝 [ArticleSerializer] Status: {validated_data.get("status", instance.status)}')
        
        # Track status change
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if tags is not None:
            instance.set_tags(tags)
        
        # Log status change
        if old_status != new_status:
            print(f'📝 Article status changed: {old_status} → {new_status} for "{instance.title}"')
        
        instance.save()  # Model.save() will auto-set published_at
        return instance


class ArticleListSerializer(serializers.ModelSerializer):
    """Serializer cho danh sách bài viết (compact)"""
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'category', 'excerpt', 'content',
            'image', 'author', 'tags', 'status', 'is_featured', 
            'read_time', 'published_at', 'view_count'
        ]
    
    def get_tags(self, obj):
        """Get parsed tags"""
        return obj.get_tags()


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Serializer cho chi tiết bài viết"""
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = '__all__'
    
    def get_tags(self, obj):
        return obj.get_tags()


# ============================================================
# 4. CONTACT SERIALIZERS
# ============================================================
class ContactSerializer(serializers.ModelSerializer):
    """Serializer cho Contact"""
    replied_by_username = serializers.CharField(source='replied_by.username', read_only=True)
    
    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message', 
            'status', 'admin_reply', 'replied_at', 'replied_by', 
            'replied_by_username', 'ip_address', 'user_agent', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'replied_by_username']


class ContactCreateSerializer(serializers.ModelSerializer):
    """Serializer cho tạo liên hệ từ frontend"""
    class Meta:
        model = Contact
        fields = ['name', 'email', 'phone', 'subject', 'message']
    
    def create(self, validated_data):
        """Tự động thêm IP và User Agent"""
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = self.get_client_ip(request)
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        return super().create(validated_data)
    
    def get_client_ip(self, request):
        """Lấy IP của client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ContactReplySerializer(serializers.Serializer):
    """Serializer cho phản hồi liên hệ"""
    admin_reply = serializers.CharField()


# ============================================================
# 5. SETTING SERIALIZERS
# ============================================================
class SettingSerializer(serializers.ModelSerializer):
    """Serializer cho Setting"""
    
    class Meta:
        model = Setting
        fields = [
            'id', 'setting_key', 'setting_value', 'setting_type', 
            'setting_group', 'description', 'is_public', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SettingPublicSerializer(serializers.ModelSerializer):
    """Serializer cho settings public (không cần auth)"""
    class Meta:
        model = Setting
        fields = ['setting_key', 'setting_value', 'setting_type', 'setting_group']


class SettingBulkUpdateSerializer(serializers.Serializer):
    """Serializer cho update nhiều settings cùng lúc"""
    settings = serializers.DictField(child=serializers.CharField())


# ============================================================
# 6. SOCIAL MEDIA SERIALIZERS
# ============================================================
class SocialMediaSerializer(serializers.ModelSerializer):
    """Serializer cho Social Media"""
    
    class Meta:
        model = SocialMedia
        fields = [
            'id', 'platform', 'url', 'icon_url', 'is_active', 
            'sort_order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================
# 7. CERTIFICATION SERIALIZERS
# ============================================================
class CertificationSerializer(serializers.ModelSerializer):
    """Serializer cho Certification"""
    
    class Meta:
        model = Certification
        fields = [
            'id', 'name', 'description', 'icon', 'icon_color', 
            'image_url', 'certificate_number', 'issued_by', 
            'issued_date', 'expiry_date', 'is_active', 
            'sort_order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================
# 8. CATEGORY SERIALIZERS
# ============================================================
class CategorySerializer(serializers.ModelSerializer):
    """Serializer cho Category"""
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'type', 'description', 'icon', 
            'color', 'parent', 'children', 'sort_order', 'is_active', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_children(self, obj):
        """Lấy danh mục con"""
        if obj.children.exists():
            return CategorySerializer(obj.children.all(), many=True).data
        return []


class CategoryTreeSerializer(serializers.ModelSerializer):
    """Serializer cho cây danh mục"""
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'type', 'icon', 'color', 'children']
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategoryTreeSerializer(obj.children.filter(is_active=True), many=True).data
        return []


# ============================================================
# 9. ABOUT FEATURE SERIALIZERS
# ============================================================
class AboutFeatureSerializer(serializers.ModelSerializer):
    """Serializer cho About Feature"""
    
    class Meta:
        model = AboutFeature
        fields = ['id', 'feature_text', 'sort_order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


# ============================================================
# 10. ABOUT VALUE SERIALIZERS
# ============================================================
class AboutValueSerializer(serializers.ModelSerializer):
    """Serializer cho About Value"""
    
    class Meta:
        model = AboutValue
        fields = ['id', 'title', 'description', 'color', 'icon', 'sort_order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


# ============================================================
# 11. ACTIVITY LOG SERIALIZERS
# ============================================================
class ActivityLogSerializer(serializers.ModelSerializer):
    """Serializer cho Activity Log"""
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = [
            'id', 'user', 'username', 'action', 'entity_type', 
            'entity_id', 'description', 'ip_address', 
            'user_agent', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================
# 12. MEDIA SERIALIZERS
# ============================================================
class MediaSerializer(serializers.ModelSerializer):
    """Serializer cho Media"""
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    
    class Meta:
        model = Media
        fields = [
            'id', 'file_name', 'file_path', 'file_url', 'file_type', 
            'file_size', 'width', 'height', 'uploaded_by', 
            'uploaded_by_username', 'entity_type', 'entity_id', 
            'is_public', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'uploaded_by', 'uploaded_by_username']


class MediaUploadSerializer(serializers.Serializer):
    """Serializer cho upload file"""
    file = serializers.FileField()
    entity_type = serializers.CharField(required=False, allow_blank=True)
    entity_id = serializers.CharField(required=False, allow_null=True)


# ============================================================
# 13. DASHBOARD SERIALIZERS
# ============================================================
class DashboardStatsSerializer(serializers.Serializer):
    """Serializer cho thống kê dashboard"""
    total_products = serializers.IntegerField()
    total_articles = serializers.IntegerField()
    new_contacts = serializers.IntegerField()
    today_contacts = serializers.IntegerField()
    total_product_views = serializers.IntegerField()
    total_article_views = serializers.IntegerField()
