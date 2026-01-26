import os
import django
import sys
import cloudinary
import cloudinary.uploader

# Set up Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_cloudinary():
    import cloudinary
    import cloudinary.uploader
    from django.conf import settings
    
    print("Testing with CURRENT DJANGO SETTINGS...")
    print(f"Cloud Name: {cloudinary.config().cloud_name}")
    print(f"API Key: {cloudinary.config().api_key}")
    
    try:
        # 1x1 transparent pixel in base64
        test_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        result = cloudinary.uploader.upload(test_image, folder="test_suite_django")
        print(f"\nSUCCESS! Image URL: {result.get('secure_url')}")
    except Exception as e:
        print(f"\nFAILED with Django settings: {str(e)}")

if __name__ == "__main__":
    test_cloudinary()
