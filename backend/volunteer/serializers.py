from rest_framework.serializers import ModelSerializer

from rest_framework import serializers
from .models import Wing, Level, Designation, Volunteer, Application

class WingSerializer(ModelSerializer):
    class Meta:
        model = Wing
        fields = '__all__'

class LevelSerializer(ModelSerializer):
    class Meta:
        model = Level
        fields = '__all__'

class DesignationSerializer(ModelSerializer):
    volunteer_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Designation
        fields = '__all__'

class VolunteerSerializer(ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'

class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'