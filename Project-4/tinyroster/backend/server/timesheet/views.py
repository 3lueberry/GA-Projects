from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import (IsAuthenticated, IsAdminUser)
from rest_framework import status

from . import serializers as srlzr
from .models import TimeSheet, TimeSheetItem
from job.models import Job, JobUser
from account.models import Account
from datetime import date, datetime, time, timedelta

class CreateOrAddTimeSheet(APIView):
    permission_class = (IsAdminUser,)

    def post(self, request):
        if not request.user.type.is_manager:
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )

        try:
            period = datetime.fromisoformat(request.data.get("check_out", None)).replace(day=1, hour=8, minute=0, second=0, microsecond=0)
            staff = Account.objects.get(id=request.data.get('staff', ''))
            timesheet, created = TimeSheet.objects.get_or_create(staff=staff, period=period)
            if created:
                serialized_timesheet = srlzr.TimeSheetSerializer(instance=timesheet, data={}, partial=True)
                serialized_timesheet.is_valid()
                serialized_timesheet.save()
                timesheet_id = serialized_timesheet.data.id
            else:
                timesheet_id = timesheet.id

            total_hours = datetime.fromisoformat(request.data.get("check_out", None)) - datetime.fromisoformat(request.data.get("check_in", None))
            data = { 'timesheet': timesheet_id, 'job_item': request.data.get("id", None), "total_hours": total_hours, "approved_by": request.user.name }
            print(data)
            serialized_timesheet_item = srlzr.TimeSheetItemSerializer(data=data)
            if serialized_timesheet_item.is_valid():
                serialized_timesheet_item.save()
                return Response(data = {"period": period, "total_hours": total_hours}, status = status.HTTP_200_OK)
            else:
                return Response(
                    data = { "message": "unable to create timesheet" },
                    status = status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(e)
            return Response(
                data = { "message": "something went wrong" },
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        


class TimeSheetList(APIView):
    permission_class = (IsAuthenticated,)

    def get(self, request, id):
        try:
            timesheets = TimeSheet.objects.filter(staff=id)
            serialized_timesheets = srlzr.TimeSheetSerializer(timesheets, many=True)
            return Response(data = serialized_timesheets.data, status = status.HTTP_200_OK)
        except:
            return Response(
                data = { "message": "no timesheet available" },
                status = status.HTTP_404_NOT_FOUND
            )


class TimeSheetItemList(APIView):
    permission_class = (IsAuthenticated,)

    def get(self, request, id, timesheet):
        try:
            timesheet_items = TimeSheetItem.objects.filter(timesheet=timesheet)
            serialized_timesheet_items = srlzr.TimeSheetItemDetailsSerializer(timesheet_items, many=True)
            return Response(data = serialized_timesheet_items.data, status = status.HTTP_200_OK)
        except:
            return Response(
                data = { "message": "no timesheet item list available" },
                status = status.HTTP_404_NOT_FOUND
            )

    
    def patch(self, request, id, timesheet):
        if not request.user.type.is_payroll:
            return Response(
                data = { "message": "permission denied" },
                status = status.HTTP_401_UNAUTHORIZED
            )

        try:
            timesheet = TimeSheet.objects.get(id=timesheet)
            data = {
                "is_paid": True,
                "paid_on": datetime.now().replace(microsecond=0),
                "paid_by": request.user.name
            }
            serialized_timesheet = srlzr.TimeSheetSerializer(instance=timesheet, data=data, partial=True)
            if serialized_timesheet.is_valid():
                serialized_timesheet.save()
                return Response(data = serialized_timesheet.data, status = status.HTTP_200_OK)
            else:
                return Response(
                    data = { "message": "something went wrong" },
                    status = status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except:
            return Response(
                data = { "message": "no timesheet available" },
                status = status.HTTP_404_NOT_FOUND
            )