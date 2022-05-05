from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import (IsAuthenticated, IsAdminUser)
from rest_framework import status

from . import serializers as srlzr
from .models import Job, JobUser
from account.models import Account
from location.models import Location
from datetime import date, datetime, time, timedelta

class JobList(APIView):
    permission_class = (IsAuthenticated,)

    def get(self, request):
        try:
            if request.user.type.is_manager:
                jobs = Job.objects.filter(created_by=request.user.id)
            else:
                jobs = Job.objects.filter(is_deleted=False)
            serialized_jobs = srlzr.JobSerializer(jobs, many=True)
            return Response(data = serialized_jobs.data, status = status.HTTP_200_OK)
        except:
            return Response(
                data = { "message": "no job available" },
                status = status.HTTP_404_NOT_FOUND
            )
        

class JobDetails(APIView):
    permission_class = (IsAuthenticated,)

    def get(self, request, id):
        try:
            job = Job.objects.get(id = id)
        except:
            return Response(
                data = { "message": "job not found" },
                status = status.HTTP_404_NOT_FOUND
            )
        serialized_job= srlzr.JobSerializer(job)

        if request.user.type.is_manager:
            applied = JobUser.objects.filter(job=id)
        else:
            applied = JobUser.objects.filter(staff=request.user.id)

        serialized_applied = srlzr.JobUserSerializer(applied, many=True)

        data = {'details': serialized_job.data, 'applied': serialized_applied.data }
        return Response(data = data, status = status.HTTP_200_OK)



class CreateJob(APIView):
    permission_class = (IsAdminUser,)

    def put(self, request):
        if not request.user.type.is_manager:
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        data = request.data
        data['created_by'] = request.user.id
        data['start_time'] = datetime.fromisoformat(request.data.get("start_time", 0)).replace(microsecond=0)
        data['end_time'] = datetime.fromisoformat(request.data.get("end_time", 0)).replace(microsecond=0)

        try:
            location = Location.objects.get(manager=request.user.id)
            data['location'] = location.id
        except:
            return Response(
                data = { "message": "user does not have location assigned" },
                status = status.HTTP_404_NOT_FOUND
            )

        new_job = srlzr.CreateJobSerializer(data = data)
        print(new_job.initial_data)
        if new_job.is_valid():
            new_job.save()
            return Response(
                data = new_job.data,
                status = status.HTTP_201_CREATED
            )
        else:
            return Response(
                data = { "message": "invalid job details" },
                status = status.HTTP_400_BAD_REQUEST
            )
            

    
class UpdateJob(APIView):
    permission_class = (IsAdminUser,)
    
    def patch(self, request, id):
        if not request.user.type.is_manager:
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )

        try:
            job = Job.objects.filter(created_by=request.user.id).get(id=id)
        except:
            return Response(
                data = { "message": "job not found" },
                status = status.HTTP_404_NOT_FOUND
            )
        
        data = request.data
        if request.data.get("start_time", 0):
            data['start_time'] = datetime.fromisoformat(request.data.get("start_time", 0))
        if request.data.get("end_time", 0):
            data['end_time'] = datetime.fromisoformat(request.data.get("end_time", 0))
        
        updated_job = srlzr.CreateJobSerializer(instance=job, data=data, partial=True)
        if not updated_job.is_valid():
            return Response(
                data = { "message": "invalid job details" },
                status = status.HTTP_400_BAD_REQUEST
            )
        updated_job.save()
        return Response(data = updated_job.data, status = status.HTTP_202_ACCEPTED)
        
    
class DeleteJob(APIView):
    permission_class = (IsAdminUser,)
    
    def delete(self, request, id):
        if not request.user.type.is_manager:
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            job = Job.objects.filter(created_by=request.user.id).get(id=id)
        except:
            return Response(
                data = { "message": "location not found" },
                status = status.HTTP_404_NOT_FOUND
            )


        deleted_job = srlzr.CreateJobSerializer(instance=job, data={"is_deleted": True}, partial=True)
        if not deleted_job.is_valid():
            return Response(
                data = { "message": "unable to delete job" },
                status = status.HTTP_400_BAD_REQUEST
            )
        deleted_job.save()
        return Response(
                data = {
                    "message": "job deleted"
                },
                status = status.HTTP_200_OK
            )


class ApplyOrStatusJob(APIView):
    permission_class = (IsAuthenticated,)

    def post(self, request, id):
        try:
            staff = Account.objects.get(id=request.data.get('staff'))
            job = Job.objects.get(id=id)
            apply_job, created = JobUser.objects.get_or_create(job=job, staff=staff)
            data = request.data
            if request.data.get('status', '') == 'CHECKED IN':
                data['check_in'] = datetime.now().replace(microsecond=0)
            elif request.data.get('status', '') == 'CHECKED OUT':
                data['check_out'] = datetime.now().replace(microsecond=0)
            elif request.data.get('status', '') == 'APPROVED':
                data['is_approved'] = True

            serialized_apply_job = srlzr.JobUserSerializer(instance=apply_job, data=data, partial=True)
            if serialized_apply_job.is_valid():
                serialized_apply_job.save()
                return Response(data = serialized_apply_job.data, status = status.HTTP_202_ACCEPTED)

        except Exception as e:
            print(e)
            return Response(
                data = { "message": "unable to apply job or update status" },
                status = status.HTTP_400_BAD_REQUEST
            )