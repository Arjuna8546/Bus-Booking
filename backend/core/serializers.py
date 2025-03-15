from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework import serializers
from .models import CustomUser,Bus

class CoustomTokenObtainPairSerializer(TokenObtainSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'phone','password', 'is_active', 'is_staff', 'date_joined']
        read_only_fields = ['is_active', 'is_staff', 'date_joined']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)
    
class BusDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__' 
        read_only_fields = ['id']  