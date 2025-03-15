
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
import requests
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from core.serializers import CoustomTokenObtainPairSerializer
from rest_framework.views import APIView
from core.serializers import CustomUserSerializer,BusDetailSerializer
from rest_framework.exceptions import ValidationError,AuthenticationFailed
from core.models import CustomUser,Bus
from http import HTTPStatus
from django.shortcuts import get_object_or_404


class CoustomTokenPairObtainView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):

        try:
            email = request.data.get("email")

            if not CustomUser.objects.filter(email=email,is_superuser=True).exists():
                return Response(
                    {"success": False, "message": "Admin with this account doesn't exist"},
                    status=HTTPStatus.BAD_REQUEST
                )
            response = super().post(request, *args, **kwargs)
            token = response.data

            access_token = token["access"]
            refresh_token = token["refresh"]

            res = Response(status=HTTPStatus.OK)

            user = get_object_or_404(CustomUser,email=email)

            res.data = {"success":True,"message": "Admin login succsessfully", "userDetail":{"username":user.name,"email":user.email}}

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=False,
                secure=True,
                samesite=None,
                path='/'
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=False,
                secure=True,
                samesite=None,
                path='/'
            )
            return res
        except AuthenticationFailed as af:
            return Response(
                {"success": False, "message": "Invalid credentials"},
                status=HTTPStatus.BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"success": False, "message": f"An error occurred: {str(e)}"},
                status=HTTPStatus.INTERNAL_SERVER_ERROR
            )


class GetNearestBusStop(APIView):
    def get(self,request):
        district = request.GET.get("district", "Thrissur")  

        
        geocode_url = f"https://nominatim.openstreetmap.org/search?format=json&q={district}&polygon_geojson=1"
        
        try:
            geo_response = requests.get(geocode_url, headers={"User-Agent": "MyDjangoApp"}).json()
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Request failed: {str(e)}"}, status=500)

        if not geo_response:
            return Response({"error": "District not found"}, status=400)

        location = geo_response[0]
        bounding_box = location["boundingbox"]  

        min_lat, max_lat = bounding_box[0], bounding_box[1]
        min_lon, max_lon = bounding_box[2], bounding_box[3]

        overpass_query = f"""
        [out:json];
        area[name="{district}"]->.searchArea;
        (
        node["highway"="bus_stop"](area.searchArea);
        );
        out body;
        """

        overpass_url = "https://overpass-api.de/api/interpreter"
        
        try:
            overpass_response = requests.post(overpass_url, data=overpass_query).json()
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Overpass request failed: {str(e)}"}, status=500)

        results = overpass_response.get("elements", [])

        bus_stops = []
        for element in results:
            if "name" in element["tags"]: 
                bus_stops.append({
                    "name": element["tags"]["name"],
                    "latitude": element["lat"],
                    "longitude": element["lon"]
                })

        if not bus_stops:
            return Response({"error": "No major bus stops found in this district"}, status=404)

        return Response({"district": district, "bus_stops": bus_stops})
    
class RegisterBus(APIView):
    def post(self,request):
        data = request.data.copy()
        data['bus_name'] = data.pop('busName', '')
        data['start_stop'] = data.pop('startStop', '')
        data['destination_stop'] = data.pop('destinationStop', '')
        data['start_time'] = data.pop('startTime', '')
        data['reach_time'] = data.pop('reachTime', '')
        data['owner_name'] = data.pop('ownerName', '')
        data['owner_phone'] = data.pop('ownerPhone', '')
        data['owner_upi'] = data.pop('ownerUpi', '')
        
        serializer = BusDetailSerializer(data=data)

        try:
            if serializer.is_valid(raise_exception=True): 
                serializer.save()
                return Response({
                    "status": "success",
                    "message": "Bus registered successfully",
                    "data": {
                        "Bus name": serializer.validated_data.get('busName')  
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
        
    def get(self,request):
        buses = Bus.objects.all()
        serializer = BusDetailSerializer(buses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)