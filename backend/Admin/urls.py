from django.urls import path
from .views import *
urlpatterns = [

    path('token/', CoustomTokenPairObtainView.as_view(), name='token_obtain_pair'),
    path('get-bus-stop/',GetNearestBusStop.as_view(),name="getbuststop"),
    path('register-bus/',RegisterBus.as_view(),name="register_bus")
]