from rest_framework import serializers
from .models import Job, JobUser, JobStatus
from account.serializers import UserDetailsSerializer
from location.serializers import CreateLocationSerializer


class JobSerializer(serializers.ModelSerializer):
    created_by = UserDetailsSerializer(read_only = True)
    location = CreateLocationSerializer(read_only = True)

    class Meta:
        model = Job
        fields = '__all__'

    # def validate_type(self, value):
    #     return value.upper()


class CreateJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class JobUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobUser
        fields = '__all__'