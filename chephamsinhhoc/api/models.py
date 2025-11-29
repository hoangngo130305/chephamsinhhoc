

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator
import uuid
import json


# ============================================================
# 1. MODEL USER - Quản lý tài khoản admin
# ============================================================
class User(AbstractUser):
    """Quản lý tài khoản admin"""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('editor', 'Editor'),
        ('viewer', 'Viewer'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    full_name = models.CharField(max_length=100, null=True, blank=True, verbose_name='Họ tên')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='editor', verbose_name='Vai trò')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', verbose_name='Trạng thái')
    last_login = models.DateTimeField(null=True, blank=True, verbose_name='Lần đăng nhập cuối')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Ngày cập nhật')
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    # FIX xung đột
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_permissions',
        blank=True
    )

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return self.username



# ============================================================
# 2. MODEL PRODUCT - Quản lý sản phẩm
# ============================================================
class Product(models.Model):
    """Quản lý sản phẩm sinh học"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    # MariaDB 10.4: Use CHAR(36) instead of UUIDField for better compatibility
    id = models.CharField(max_length=36, primary_key=True, default=lambda: str(uuid.uuid4()), editable=False)
    name = models.CharField(max_length=200, verbose_name='Tên sản phẩm')
    category = models.CharField(max_length=100, verbose_name='Danh mục')
    description = models.TextField(verbose_name='Mô tả')
    
    # MariaDB 10.4: Use TextField with JSON for better compatibility
    features = models.TextField(null=True, blank=True, verbose_name='Tính năng')
    usage = models.TextField(null=True, blank=True, verbose_name='Hướng dẫn sử dụng')
    ingredients = models.TextField(null=True, blank=True, verbose_name='Thành phần')
    benefits = models.TextField(null=True, blank=True, verbose_name='Lợi ích')
    packaging = models.TextField(null=True, blank=True, verbose_name='Đóng gói')
    images = models.TextField(null=True, blank=True, verbose_name='Hình ảnh')
    image_labels = models.TextField(null=True, blank=True, verbose_name='Nhãn ảnh')
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', verbose_name='Trạng thái')
    is_popular = models.BooleanField(default=False, verbose_name='Phổ biến')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    view_count = models.PositiveIntegerField(default=0, verbose_name='Lượt xem')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Ngày cập nhật')
    
    class Meta:
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-is_popular', 'sort_order', '-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['status']),
            models.Index(fields=['is_popular']),
        ]
    
    def __str__(self):
        return self.name
    
    def increment_view(self):
        """Tăng lượt xem"""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    # Helper methods for JSON fields
    def get_features(self):
        """Parse features từ JSON string"""
        if self.features:
            try:
                return json.loads(self.features)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    def set_features(self, value):
        """Set features as JSON string"""
        self.features = json.dumps(value) if value else None
    
    def get_benefits(self):
        """Parse benefits từ JSON string"""
        if self.benefits:
            try:
                return json.loads(self.benefits)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    def set_benefits(self, value):
        """Set benefits as JSON string"""
        self.benefits = json.dumps(value) if value else None
    
    def get_packaging(self):
        """Parse packaging từ JSON string"""
        if self.packaging:
            try:
                return json.loads(self.packaging)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    def set_packaging(self, value):
        """Set packaging as JSON string"""
        self.packaging = json.dumps(value) if value else None
    
    def get_images(self):
        """Parse images từ JSON string"""
        if self.images:
            try:
                return json.loads(self.images)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    def set_images(self, value):
        """Set images as JSON string"""
        self.images = json.dumps(value) if value else None
    
    def get_image_labels(self):
        """Parse image_labels từ JSON string"""
        if self.image_labels:
            try:
                return json.loads(self.image_labels)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    def set_image_labels(self, value):
        """Set image_labels as JSON string"""
        self.image_labels = json.dumps(value) if value else None


# ============================================================
# 3. MODEL ARTICLE - Quản lý tin tức
# ============================================================
# ============================================================
# 3. MODEL ARTICLE - Quản lý tin tức
# ============================================================
class Article(models.Model):
    """Quản lý tin tức và bài viết"""
    STATUS_CHOICES = [
        ('published', 'Published'),
        ('draft', 'Draft'),
    ]
    
    id = models.CharField(max_length=36, primary_key=True, default=lambda: str(uuid.uuid4()), editable=False)
    title = models.CharField(max_length=300, verbose_name='Tiêu đề')
    category = models.CharField(max_length=100, verbose_name='Danh mục')
    excerpt = models.TextField(verbose_name='Tóm tắt')
    content = models.TextField(verbose_name='Nội dung')
    image = models.URLField(max_length=500, null=True, blank=True, verbose_name='Hình ảnh')
    author = models.CharField(max_length=100, default='Admin', verbose_name='Tác giả')
    tags = models.TextField(null=True, blank=True, verbose_name='Tags')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='Trạng thái')
    is_featured = models.BooleanField(default=False, verbose_name='Nổi bật')
    view_count = models.PositiveIntegerField(default=0, verbose_name='Lượt xem')
    read_time = models.CharField(max_length=20, null=True, blank=True, verbose_name='Thời gian đọc')
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='Ngày xuất bản')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Ngày cập nhật')
    
    class Meta:
        db_table = 'articles'
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'
        ordering = ['-is_featured', '-published_at', '-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['status']),
            models.Index(fields=['is_featured']),
        ]
    
    def __str__(self):
        return self.title
    
    def increment_view(self):
        """Tăng lượt xem"""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    def get_tags(self):
        """Parse tags từ JSON string"""
        if self.tags:
            try:
                return json.loads(self.tags)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    def set_tags(self, value):
        """Set tags as JSON string"""
        self.tags = json.dumps(value) if value else None
    
    def save(self, *args, **kwargs):
        """Override save để auto-set published_at khi publish"""
        from django.utils import timezone
        
        # Auto-set published_at khi status chuyển sang published
        if self.status == 'published' and self.published_at is None:
            self.published_at = timezone.now()
            print(f'✅ Auto-set published_at for article: {self.title}')
        
        # Clear published_at khi chuyển về draft
        if self.status == 'draft' and self.published_at is not None:
            self.published_at = None
            print(f'🔄 Cleared published_at for draft article: {self.title}')
        
        super().save(*args, **kwargs)




# ============================================================
# 4. MODEL CONTACT - Quản lý liên hệ
# ============================================================
class Contact(models.Model):
    """Quản lý liên hệ từ khách hàng"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('replied', 'Replied'),
        ('closed', 'Closed'),
    ]
    
    id = models.CharField(max_length=36, primary_key=True, default=lambda: str(uuid.uuid4()), editable=False)
    name = models.CharField(max_length=100, verbose_name='Tên')
    email = models.EmailField(validators=[EmailValidator()], verbose_name='Email')
    phone = models.CharField(max_length=20, null=True, blank=True, verbose_name='Điện thoại')
    subject = models.CharField(max_length=200, null=True, blank=True, verbose_name='Chủ đề')
    message = models.TextField(verbose_name='Nội dung')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='new', verbose_name='Trạng thái')
    admin_reply = models.TextField(null=True, blank=True, verbose_name='Phản hồi')
    replied_at = models.DateTimeField(null=True, blank=True, verbose_name='Ngày phản hồi')
    replied_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contact_replies',
        verbose_name='Người phản hồi',
        db_column='replied_by_id',        # RÕ RÀNG: cột trong DB là replied_by_id
        to_field='id'                     # Rõ ràng dùng id
    )    
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name='IP')
    user_agent = models.CharField(max_length=500, null=True, blank=True, verbose_name='User Agent')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Ngày cập nhật')
    
    class Meta:
        db_table = 'contacts'
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['email']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.email}"


# ============================================================
# 5. MODEL SETTING - Cấu hình website
# ============================================================
class Setting(models.Model):
    """Cấu hình website"""
    TYPE_CHOICES = [
        ('text', 'Text'),
        ('json', 'JSON'),
        ('number', 'Number'),
        ('boolean', 'Boolean'),
        ('image', 'Image'),
    ]
    
    setting_key = models.CharField(max_length=100, unique=True, verbose_name='Key')
    setting_value = models.TextField(null=True, blank=True, verbose_name='Value')
    setting_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='text', verbose_name='Type')
    setting_group = models.CharField(max_length=50, default='general', verbose_name='Group')
    description = models.CharField(max_length=300, null=True, blank=True, verbose_name='Mô tả')
    is_public = models.BooleanField(default=False, verbose_name='Public')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Ngày cập nhật')
    
    class Meta:
        db_table = 'settings'
        verbose_name = 'Setting'
        verbose_name_plural = 'Settings'
        ordering = ['setting_group', 'setting_key']
        indexes = [
            models.Index(fields=['setting_key']),
            models.Index(fields=['setting_group']),
        ]
    
    def __str__(self):
        return self.setting_key


# ============================================================
# 6. MODEL SOCIAL MEDIA - Mạng xã hội
# ============================================================
class SocialMedia(models.Model):
    """Quản lý mạng xã hội"""
    id = models.CharField(max_length=36, primary_key=True, default=lambda: str(uuid.uuid4()), editable=False)
    platform = models.CharField(max_length=50, verbose_name='Platform')
    url = models.URLField(max_length=500, verbose_name='URL')
    icon_url = models.URLField(max_length=500, null=True, blank=True, verbose_name='Icon URL')
    is_active = models.BooleanField(default=True, verbose_name='Active')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Ngày cập nhật')
    
    class Meta:
        db_table = 'social_media'
        verbose_name = 'Social Media'
        verbose_name_plural = 'Social Media'
        ordering = ['sort_order', 'platform']
    
    def __str__(self):
        return self.platform


# ============================================================
# 7. MODEL CERTIFICATION - Chứng nhận
# ============================================================
class Certification(models.Model):
    """Chứng nhận chất lượng"""
    id = models.CharField(max_length=36, primary_key=True, default=lambda: str(uuid.uuid4()), editable=False)
    name = models.CharField(max_length=200, verbose_name='Tên chứng nhận')
    description = models.TextField(null=True, blank=True, verbose_name='Mô tả')
    icon = models.CharField(max_length=50, default='Award', verbose_name='Icon')
    icon_color = models.CharField(max_length=50, default='blue', verbose_name='Màu icon')
    image_url = models.URLField(max_length=500, null=True, blank=True, verbose_name='Hình ảnh')
    certificate_number = models.CharField(max_length=100, null=True, blank=True, verbose_name='Số chứng nhận')
    issued_by = models.CharField(max_length=200, null=True, blank=True, verbose_name='Cơ quan cấp')
    issued_date = models.DateField(null=True, blank=True, verbose_name='Ngày cấp')
    expiry_date = models.DateField(null=True, blank=True, verbose_name='Ngày hết hạn')
    is_active = models.BooleanField(default=True, verbose_name='Active')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Ngày cập nhật')
    
    class Meta:
        db_table = 'certifications'
        verbose_name = 'Certification'
        verbose_name_plural = 'Certifications'
        ordering = ['sort_order', 'name']
    
    def __str__(self):
        return self.name


# ============================================================
# 8. MODEL CATEGORY - Danh mục
# ============================================================
class Category(models.Model):
    """Danh mục sản phẩm và bài viết"""
    TYPE_CHOICES = [
        ('product', 'Product'),
        ('article', 'Article'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Tên danh mục')
    slug = models.SlugField(max_length=150, unique=True, verbose_name='Slug')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name='Loại')
    description = models.TextField(null=True, blank=True, verbose_name='Mô tả')
    icon = models.CharField(max_length=50, null=True, blank=True, verbose_name='Icon')
    color = models.CharField(max_length=50, null=True, blank=True, verbose_name='Màu')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children', verbose_name='Danh mục cha')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    is_active = models.BooleanField(default=True, verbose_name='Active')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Ngày cập nhật')
    
    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['type', 'sort_order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['type']),
        ]
    
    def __str__(self):
        return self.name


# ============================================================
# 9. MODEL ABOUT FEATURE - Tính năng About
# ============================================================
class AboutFeature(models.Model):
    """Tính năng trong About section"""
    feature_text = models.CharField(max_length=200, verbose_name='Nội dung')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    is_active = models.BooleanField(default=True, verbose_name='Active')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    
    class Meta:
        db_table = 'about_features'
        verbose_name = 'About Feature'
        verbose_name_plural = 'About Features'
        ordering = ['sort_order']
    
    def __str__(self):
        return self.feature_text


# ============================================================
# 10. MODEL ABOUT VALUE - Giá trị cốt lõi
# ============================================================
class AboutValue(models.Model):
    """Giá trị cốt lõi công ty"""
    title = models.CharField(max_length=100, verbose_name='Tiêu đề')
    description = models.TextField(verbose_name='Mô tả')
    color = models.CharField(max_length=50, default='blue', verbose_name='Màu')
    icon = models.CharField(max_length=50, null=True, blank=True, verbose_name='Icon')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    is_active = models.BooleanField(default=True, verbose_name='Active')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    
    class Meta:
        db_table = 'about_values'
        verbose_name = 'About Value'
        verbose_name_plural = 'About Values'
        ordering = ['sort_order']
    
    def __str__(self):
        return self.title


# ============================================================
# 11. MODEL ACTIVITY LOG - Lịch sử hoạt động
# ============================================================
class ActivityLog(models.Model):
    """Lịch sử hoạt động admin"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='User')
    action = models.CharField(max_length=50, verbose_name='Hành động')
    entity_type = models.CharField(max_length=50, null=True, blank=True, verbose_name='Loại')
    entity_id = models.CharField(max_length=36, null=True, blank=True, verbose_name='ID')
    description = models.TextField(null=True, blank=True, verbose_name='Mô tả')
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name='IP')
    user_agent = models.CharField(max_length=500, null=True, blank=True, verbose_name='User Agent')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    
    class Meta:
        db_table = 'activity_logs'
        verbose_name = 'Activity Log'
        verbose_name_plural = 'Activity Logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['action']),
            models.Index(fields=['entity_type']),
        ]
    
    def __str__(self):
        return f"{self.action} - {self.entity_type} - {self.created_at}"




# ============================================================
# 12. MODEL MEDIA - Quản lý files
# ============================================================
# ============================================================
# 12. MODEL MEDIA - Quản lý files
# ============================================================
class Media(models.Model):
    """Quản lý media files"""
    id = models.CharField(max_length=36, primary_key=True, default=lambda: str(uuid.uuid4()), editable=False)
    file = models.FileField(upload_to='uploads/%Y/%m/%d/', null=True, blank=True, verbose_name='File')
    file_name = models.CharField(max_length=255, verbose_name='Tên file')
    file_path = models.CharField(max_length=500, null=True, blank=True, verbose_name='Đường dẫn')
    file_url = models.URLField(max_length=500, null=True, blank=True, verbose_name='URL')
    file_type = models.CharField(max_length=50, null=True, blank=True, verbose_name='Loại file')
    file_size = models.BigIntegerField(null=True, blank=True, verbose_name='Kích thước')
    width = models.PositiveIntegerField(null=True, blank=True, verbose_name='Chiều rộng')
    height = models.PositiveIntegerField(null=True, blank=True, verbose_name='Chiều cao')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Người upload')
    entity_type = models.CharField(max_length=50, null=True, blank=True, verbose_name='Liên kết')
    entity_id = models.CharField(max_length=36, null=True, blank=True, verbose_name='ID liên kết')
    is_public = models.BooleanField(default=True, verbose_name='Public')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    
    class Meta:
        db_table = 'media'
        verbose_name = 'Media'
        verbose_name_plural = 'Media'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['entity_type']),
            models.Index(fields=['file_type']),
        ]
    
    def __str__(self):
        return self.file_name
