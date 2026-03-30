# import os
# from pathlib import Path
# from datetime import timedelta
# from dotenv import load_dotenv

# # from rest_framework_simplejwt.views import TokenRefreshView

# load_dotenv()

# BASE_DIR = Path(__file__).resolve().parent.parent
# SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-x@2KQ7J$ZpA9Nq!wE4R9mP0Kc')
# DEBUG = os.getenv('DEBUG', 'True') == 'True'

# ALLOWED_HOSTS = ['localhost','127.0.0.1']
# # ALLOWED_HOSTS = ["*"]

# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
    
#     # Third party
#     'rest_framework',
#     'rest_framework_simplejwt',
#     'corsheaders',
#     'django_filters',
    
#     # Apps
#     'users',
#     'products',
#     'orders.apps.OrdersConfig',
#     'analytics',
#     # "ai_engine",
#     'review.apps.ReviewConfig',  
# ]

# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',
#     'django.middleware.security.SecurityMiddleware',
#     'whitenoise.middleware.WhiteNoiseMiddleware',

#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
# ]

# ROOT_URLCONF = 'techmart.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'techmart.wsgi.application'

# DATABASES = {
#     'default': {
      
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': os.getenv('DB_NAME', ),
#         'USER': os.getenv('DB_USER', ),
#         'PASSWORD': os.getenv('DB_PASSWORD', ),
#         'HOST': os.getenv('DB_HOST', ),
#         'PORT': os.getenv('DB_PORT', ),
#     }
# }

# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# ]

# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True

# STATIC_URL = 'static/'
# # STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
#     # "DEFAULT_PERMISSION_CLASSES": [
#     #     "rest_framework.permissions.IsAuthenticated",
#     # ],
#     "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
#     "PAGE_SIZE": 12,
#     'DEFAULT_PERMISSION_CLASSES': (
#         'rest_framework.permissions.IsAuthenticatedOrReadOnly',
#     ),
#     'DEFAULT_FILTER_BACKENDS': (
#         'django_filters.rest_framework.DjangoFilterBackend',
#         'rest_framework.filters.SearchFilter',
#         'rest_framework.filters.OrderingFilter',
#     ),
# }

# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
#     'ROTATE_REFRESH_TOKENS': False,
#     'BLACKLIST_AFTER_ROTATION': True,
#     'ALGORITHM': 'HS256',
#     'SIGNING_KEY': SECRET_KEY,
#     'AUTH_HEADER_TYPES': ('Bearer',),
# }

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000" #your frontend url
# ]
# CORS_ALLOW_ALL_ORIGINS = True # For development


# AUTH_USER_MODEL='users.User'


























import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url

# from rest_framework_simplejwt.views import TokenRefreshView

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-x@2KQ7J$ZpA9Nq!wE4R9mP0Kc')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# ALLOWED_HOSTS = ['localhost','127.0.0.1']
# ALLOWED_HOSTS = ["*"]
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    
    # Third party
    
    'rest_framework_simplejwt',
   
    'django_filters',
    
    # Apps
    'users',
    'products',
    'orders.apps.OrdersConfig',
    'analytics',
    # "ai_engine",
    'review.apps.ReviewConfig',  
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

ROOT_URLCONF = 'techmart.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'techmart.wsgi.application'

# DATABASES = {
#     # 'default': dj_database_url.config(default="postgresql://neondb_owner:npg_x1gERwt7jShm@ep-red-cloud-amou76ul-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"),
#    'default': dj_database_url.config(
#         default=os.getenv("DATABASE_URL"),
#         conn_max_age=600,
#         ssl_require=True
#     )
#     #     'default': {
#     #     'NAME': os.getenv('DB_NAME', ),
#     #     'USER': os.getenv('DB_USER', ),
#     #     'PASSWORD': os.getenv('DB_PASSWORD', ),
#     #     'HOST': os.getenv('DB_HOST', ),
#     #     'PORT': os.getenv('DB_PORT', ),
#     #  }{
#     # 'default': {
#     #     'ENGINE': 'django.db.backends.postgresql',
#     #     'NAME': os.getenv('DB_NAME'),
#     #     'USER': os.getenv('DB_USER'),
#     #     'PASSWORD': os.getenv('DB_PASSWORD'),
#     #     'HOST': os.getenv('DB_HOST'),
#     #     'PORT': os.getenv('DB_PORT', '5432'),
#     #     'OPTIONS': {
#     #         'sslmode': 'require',
#     #     },
#     # }
# }


DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True
    )
}
        
    


AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # "DEFAULT_PERMISSION_CLASSES": [
    #     "rest_framework.permissions.IsAuthenticated",
    # ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000" #your frontend url
# ]
CORS_ALLOW_ALL_ORIGINS = True # For development


AUTH_USER_MODEL='users.User'
