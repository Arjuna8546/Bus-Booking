
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from .serializers import CoustomTokenObtainPairSerializer
from rest_framework.views import APIView
from .serializers import CustomUserSerializer


class CoustomTokenObtainPairView(TokenObtainPairView):
    serializer = CoustomTokenObtainPairSerializer

    def post(self,request,*args,**kwargs):
        try:
            response = super().post(request,*args,**kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response({
                "status": "success",
                "message": "Tokens generated successfully.",
            }, status=status.HTTP_200_OK)

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite=None,
                path='/'
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite=None,
                path='/'
            )

            return res
        except serializers.ValidationError as e:
            return Response({
                "status": "error",
                "detail": "Invalid credentials or input data.",
                "errors": e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "status": "error",
                "detail": "An unexpected error occurred.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CoustomTokenRefreshView(TokenRefreshView):
    def post(self,request,*args,**kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")

            request.data["refresh"]= refresh_token

            response = super().post(request,*args,**kwargs)

            tokens = response.data
            access_token = tokens["access"]

            res = Response({
                "status": "success",
                "message": "Tokens refreshed successfully.",
            }, status=status.HTTP_200_OK)   

            res.set_cookie(
                key = "access_token",
                value = access_token,
                httponly = True,
                secure=True,
                samesite=None,
                path='/'
            )   
            return res     
        
        except serializers.ValidationError as e:
            return Response({
                "status": "error",
                "detail": "Invalid credentials or input data.",
                "errors": e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "status": "error",
                "detail": "An unexpected error occurred.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RegisterUserView(APIView):
    def post(self,request):
        serializer = CustomUserSerializer(data = request.data)

        try:
            if serializer.is_valid(raise_exception=True): 
                serializer.save()
                return Response({
                    "status": "success",
                    "message": "User registered successfully",
                    "data": {
                        "email": serializer.validated_data.get('email')  
                    }
                }, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response({
                "status": "error",
                "detail": "Invalid registration data.",
                "errors": e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "status": "error",
                "detail": "An unexpected error occurred during registration.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)