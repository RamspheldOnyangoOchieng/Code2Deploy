from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class UniqueIDAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = None
        if username:
            # Try unique_id first
            try:
                user = User.objects.get(unique_id=username)
            except User.DoesNotExist:
                pass
            except User.MultipleObjectsReturned:
                user = User.objects.filter(unique_id=username).first()
            
            # Try email if no user found
            if not user:
                try:
                    user = User.objects.get(email=username)
                except User.DoesNotExist:
                    pass
                except User.MultipleObjectsReturned:
                    # Multiple users with same email - try to match password
                    for u in User.objects.filter(email=username):
                        if u.check_password(password):
                            return u
                    return None
            
            # Try username if still no user found
            if not user:
                try:
                    user = User.objects.get(username=username)
                except User.DoesNotExist:
                    return None
                except User.MultipleObjectsReturned:
                    user = User.objects.filter(username=username).first()
        
        if user and user.check_password(password):
            return user
        return None 