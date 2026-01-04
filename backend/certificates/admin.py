from django.contrib import admin
from .models import Certificate, Badge


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = [
        'certificate_id', 'title', 'user', 'certificate_type', 
        'status', 'issued_date', 'issued_by'
    ]
    list_filter = [
        'status', 'certificate_type', 'issued_by', 
        'issued_date', 'program', 'event'
    ]
    search_fields = [
        'certificate_id', 'title', 'user__username', 
        'user__email', 'user__unique_id'
    ]
    readonly_fields = ['certificate_id', 'issued_date', 'created_at', 'updated_at']
    date_hierarchy = 'issued_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'description', 'certificate_type', 'status')
        }),
        ('Related Content', {
            'fields': ('program', 'event'),
            'classes': ('collapse',)
        }),
        ('Certificate Details', {
            'fields': ('certificate_id', 'issued_date', 'expiry_date', 'certificate_url', 'score', 'issued_by')
        }),
        ('Skills & Metadata', {
            'fields': ('skills_covered',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'user', 'badge_type', 'points', 
        'awarded_date', 'color'
    ]
    list_filter = [
        'badge_type', 'awarded_date', 'program', 'event'
    ]
    search_fields = [
        'title', 'user__username', 'user__email', 'user__unique_id'
    ]
    readonly_fields = ['awarded_date']
    date_hierarchy = 'awarded_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'description', 'badge_type')
        }),
        ('Related Content', {
            'fields': ('program', 'event'),
            'classes': ('collapse',)
        }),
        ('Badge Details', {
            'fields': ('icon_url', 'color', 'points', 'awarded_date')
        }),
        ('Criteria', {
            'fields': ('criteria',),
            'classes': ('collapse',)
        }),
    ) 