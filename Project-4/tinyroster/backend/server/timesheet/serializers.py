from rest_framework import serializers
from .models import TimeSheet, TimeSheetItem
from account.serializers import UserDetailsSerializer
from job.serializers import JobUserSerializer


class TimeSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSheet
        fields = '__all__'


class TimeSheetItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSheetItem
        fields = '__all__'


class TimeSheetItemDetailsSerializer(serializers.ModelSerializer):
    job_item = JobUserSerializer(read_only = True)

    class Meta:
        model = TimeSheetItem
        fields = '__all__'
