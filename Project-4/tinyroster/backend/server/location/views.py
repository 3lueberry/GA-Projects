from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import (IsAuthenticated, AllowAny, IsAdminUser)
from rest_framework import status

from . import serializers as srlzr
from .models import Location

class LocationList(APIView):
    permission_class = (IsAuthenticated,)

    def get(self, request):
        try:
            locations = Location.objects.all()
            serialized_locations = srlzr.LocationSerializer(locations, many=True)
            return Response(data = serialized_locations.data, status = status.HTTP_200_OK)
        except:
            return Response(
                data = { "message": "no location available" },
                status = status.HTTP_404_INTERNAL_SERVER_ERROR
            )
        

class LocationList(APIView):
    permission_class = (IsAuthenticated,)

    def get(self, request, id):
        try:
            location = Location.objects.get(id = id)
        except:
            return Response(
                data = { "message": "location not found" },
                status = status.HTTP_404_NOT_FOUND
            )
        
        serialized_location = srlzr.LocationSerializer(location)
        return Response(data = serialized_location.data, status = status.HTTP_200_OK)



class CreateLocation(APIView):
    permission_class = (IsAdminUser,)

    def put(self, request):
        if not request.user.has_perm('location.add_location'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        new_location = srlzr.LocationSerializer(data = request.data)
        if new_location.is_valid():
            new_location.save()
            return Response(
                data = new_location.data,
                status = status.HTTP_201_CREATED
            )
        else:
            return Response(
                data = { "message": "invalid location details" },
                status = status.HTTP_400_BAD_REQUEST
            )

    
class UpdateLocation(APIView):
    permission_class = (IsAdminUser,)
    
    def patch(self, request, id):
        if not request.user.has_perm('location.change_location'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            location = Location.objects.get(id=id)
        except:
            return Response(
                data = { "message": "location not found" },
                status = status.HTTP_404_NOT_FOUND
            )
        
        updated_location = srlzr.LocationSerializer(instance=location, data=request.data, partial=True)
        if not updated_location.is_valid():
            return Response(
                data = { "message": "invalid location details" },
                status = status.HTTP_400_BAD_REQUEST
            )
        updated_location.save()
        return Response(data = updated_location.data, status = status.HTTP_202_ACCEPTED)
        
    
class UpdateLocation(APIView):
    permission_class = (IsAdminUser,)
    
    def delete(self, request, id):
        if not request.user.has_perm('location.delete_location'):
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            location = Location.objects.get(id=id)
        except:
            return Response(
                data = { "message": "location not found" },
                status = status.HTTP_404_NOT_FOUND
            )

        try:
            location.delete()
            return Response(
                data = {
                    "message": "location deleted"
                },
                status = status.HTTP_200_OK
            )
        except:
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )