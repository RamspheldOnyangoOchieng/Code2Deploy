from django.contrib import admin
from .models import Program

# Register your models here.

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ['title', 'level', 'mode', 'created_at']
    list_filter = ['level', 'mode', 'created_at']
    search_fields = ['title', 'description']

