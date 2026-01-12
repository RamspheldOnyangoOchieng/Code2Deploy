from rest_framework import serializers
from .models import (
    ContactPageSettings, SiteSettings, 
    HomePageSettings, AboutPageSettings, 
    ProgramsPageSettings, EventsPageSettings
)


class ContactPageSettingsSerializer(serializers.ModelSerializer):
    contact_type_display = serializers.CharField(source='get_contact_type_display', read_only=True)
    
    class Meta:
        model = ContactPageSettings
        fields = [
            'id', 
            'contact_type', 
            'contact_type_display',
            'title', 
            'subtitle', 
            'description', 
            'default_subject',
            'default_message',
            'button_text',
            'contact_info_title',
            'visit_label',
            'visit_address',
            'email_label',
            'primary_email',
            'secondary_email',
            'phone_label',
            'phone_number',
            'phone_hours',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'contact_type_display']


class HomePageSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePageSettings
        fields = [
            'id',
            'hero_title_line1',
            'hero_title_highlight1',
            'hero_title_line2',
            'hero_title_highlight2',
            'hero_description',
            'hero_button1_text',
            'hero_button1_link',
            'hero_button2_text',
            'hero_button2_link',
            'hero_image',
            'hero_image_url',
            'approach_title',
            'approach_description',
            'what_we_do_title',
            'programs_section_title',
            'cta_title',
            'cta_description',
            'cta_button1_text',
            'cta_button1_link',
            'cta_button2_text',
            'cta_button2_link',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AboutPageSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPageSettings
        fields = [
            'id',
            'hero_title',
            'hero_subtitle',
            'hero_image',
            'hero_image_url',
            'mission_title',
            'mission_description',
            'vision_title',
            'vision_description',
            'journey_title',
            'team_title',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProgramsPageSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramsPageSettings
        fields = [
            'id',
            'hero_title',
            'hero_subtitle',
            'hero_description',
            'hero_image',
            'hero_image_url',
            'programs_section_title',
            'no_programs_message',
            'cta_title',
            'cta_description',
            'cta_button_text',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class EventsPageSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventsPageSettings
        fields = [
            'id',
            'hero_title',
            'hero_subtitle',
            'hero_description',
            'hero_image',
            'hero_image_url',
            'events_section_title',
            'no_events_message',
            'cta_title',
            'cta_description',
            'cta_button_text',
            'cta_button_link',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
