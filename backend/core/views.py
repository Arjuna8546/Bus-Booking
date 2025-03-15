
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
import requests
from .models import Bus
import math


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
        
MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYXJqdW5hY2hhbmRyYW52diIsImEiOiJjbTg5cHNpZ2MwMzdjMmxyMHNjcjRsMWJoIn0.OldnwVWzWiJ5ZdWr9-1Vwg"

class GetRouteWithBusStops(APIView):
    def get(self, request):
        bus_id = request.GET.get("id")
        bus = Bus.objects.filter(id=bus_id).first()

        if not bus:
            return Response({"error": "Bus not found"}, status=404)

        start_place = bus.start_stop
        end_place = bus.destination_stop

        user_agent = {"User-Agent": "MyDjangoApp"}

        def get_coordinates(place):
            geocode_url = f"https://nominatim.openstreetmap.org/search?format=json&q={place}"
            try:
                response = requests.get(geocode_url, headers=user_agent).json()
                if response:
                    return float(response[0]["lat"]), float(response[0]["lon"])
            except requests.exceptions.RequestException:
                return None
            return None

        start_coords = get_coordinates(start_place)
        end_coords = get_coordinates(end_place)

        if not start_coords or not end_coords:
            return Response({"error": "Invalid start or destination"}, status=400)

        # Get the route from Mapbox
        mapbox_url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{start_coords[1]},{start_coords[0]};{end_coords[1]},{end_coords[0]}?geometries=geojson&access_token={MAPBOX_ACCESS_TOKEN}"
        try:
            route_response = requests.get(mapbox_url).json()
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Mapbox request failed: {str(e)}"}, status=500)

        if "routes" not in route_response or not route_response["routes"]:
            return Response({"error": "Route not found"}, status=404)

        route_geometry = route_response["routes"][0]["geometry"]
        route_coords = route_geometry["coordinates"]  # [lon, lat] pairs

        # Calculate bounding box with buffer
        buffer = 0.01  # ~1km buffer
        min_lat = min(coord[1] for coord in route_coords) - buffer
        max_lat = max(coord[1] for coord in route_coords) + buffer
        min_lon = min(coord[0] for coord in route_coords) - buffer
        max_lon = max(coord[0] for coord in route_coords) + buffer

        # Fetch bus stops from OSM
        overpass_query = f"""
        [out:json];
        (
        node["highway"="bus_stop"]({min_lat},{min_lon},{max_lat},{max_lon});
        node["place"="town"]({min_lat},{min_lon},{max_lat},{max_lon});
        node["place"="city"]({min_lat},{min_lon},{max_lat},{max_lon});
        node["place"="village"]({min_lat},{min_lon},{max_lat},{max_lon});
        node["highway"="traffic_signals"]({min_lat},{min_lon},{max_lat},{max_lon});
        node["junction"="roundabout"]({min_lat},{min_lon},{max_lat},{max_lon});
        node["highway"="crossing"]({min_lat},{min_lon},{max_lat},{max_lon});
        );
        out body;
        """

        overpass_url = "https://overpass-api.de/api/interpreter"
        try:
            overpass_response = requests.post(overpass_url, data=overpass_query).json()
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Overpass request failed: {str(e)}"}, status=500)

        results = overpass_response.get("elements", [])
        all_bus_stops = [
            {
                "name": element["tags"].get("name", f"Stop {i+1}"),
                "latitude": element["lat"],
                "longitude": element["lon"]
            }
            for i, element in enumerate(results)
            if "tags" in element and "highway" in element["tags"] and element["tags"]["highway"] == "bus_stop"
        ]

        # Simplified distance calculation to nearest route point (faster approximation)
        def distance_to_route(lat, lon, route_coords):
            def haversine(lat1, lon1, lat2, lon2):
                R = 6371  # Earth's radius in km
                lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
                dlat = lat2 - lat1
                dlon = lon2 - lon1
                a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
                c = 2 * math.asin(math.sqrt(a))
                return R * c

            return min(
                haversine(lat, lon, coord[1], coord[0])
                for coord in route_coords
            )

        MAX_DISTANCE_KM = 0.05  
        bus_stops_on_route = [
            stop for stop in all_bus_stops
            if distance_to_route(stop["latitude"], stop["longitude"], route_coords) <= MAX_DISTANCE_KM
        ]

        return Response({
            "start": start_place,
            "end": end_place,
            "route": route_geometry,
            "bus_stops": bus_stops_on_route
        })
    

# class UserSelectedRoute(APIView):
#     def post(self,request):
