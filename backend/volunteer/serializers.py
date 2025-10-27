from rest_framework.serializers import ModelSerializer

from rest_framework import serializers
from .models import Wing, Level, Designation, Volunteer, Application
from dashboard.serializers import UserInfoSerializer

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
    user_name = serializers.CharField(source='user.username', read_only=True)
    wing_name = serializers.CharField(source='wing.name', read_only=True)
    level_name = serializers.CharField(source='level.name', read_only=True)
    designation_title = serializers.CharField(source='designation.title', read_only=True)
    class Meta:
        model = Application
        fields = ['__all__', 'user_name', 'wing_name', 'level_name', 'designation_title']

class ApplicationDetailSerializer(ModelSerializer):
    user = UserInfoSerializer(read_only=True)
    wing = WingSerializer(read_only=True)
    level = LevelSerializer(read_only=True)
    designation = DesignationSerializer(read_only=True)
    class Meta:
        model = Application
        fields = '__all__'