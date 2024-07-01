from django.urls import path
from .views import spirograph_patterns

urlpatterns = [
    path('patterns/', spirograph_patterns),
]
