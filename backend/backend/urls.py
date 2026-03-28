"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]


from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api.views import (
    CategoryViewSets, DecorViewSets, SubCategoryViewSets, CultureViewSets, StyleViewSets, SizeViewSets, ExpansionViewSets, test_decor, register_view, login_view, me_view
)


router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSets)
router.register(r'decors', DecorViewSets)
router.register(r'subcategories', SubCategoryViewSets)
router.register(r'culture', CultureViewSets)
router.register(r'style', StyleViewSets)
router.register(r'size', SizeViewSets)
router.register(r'expansions', ExpansionViewSets)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    path("api/test/", test_decor),

    path("api/register/", register_view),
    path("api/login/", login_view),
    path("api/me/", me_view),
]

#Itt ügye az apuTEST-et utólag biggyesztettem hozzá a teszteléshez.

#Sokadik: És ügye hozzáteszem a utólagosan a views.get_decors - a regisztrációs URLT-t - és a login URLT-t is.