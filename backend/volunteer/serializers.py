from rest_framework.serializers import ModelSerializer

from rest_framework import serializers
from .models import VolunteerWorkingArea, Wing, Level, Designation, Volunteer, Application
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

class VolunteerWorkingAreaSerializer(ModelSerializer):
    class Meta:
        model = VolunteerWorkingArea
        fields = '__all__'

class VolunteerSerializer(ModelSerializer):
    user = UserInfoSerializer(read_only=True)
    wing_name = serializers.CharField(source='wing.name', read_only=True)
    level_name = serializers.CharField(source='level.name', read_only=True)
    designation_title = serializers.CharField(source='designation.title', read_only=True)
    working_areas = VolunteerWorkingAreaSerializer(many=True, read_only=True)
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
        fields = ['id', 'user', 'user_name', 'timestamp', 'wing', 'wing_name', 'level', 'level_name', 'designation', 'designation_title', 'phone_number', 'aadhar_card_front', 'aadhar_card_back', 'image', 'status', 'remarks', 'hindi_name', 'referred_by_volunteer']

class ApplicationDetailSerializer(ModelSerializer):
    user = UserInfoSerializer(read_only=True)
    wing = WingSerializer(read_only=True)
    level = LevelSerializer(read_only=True)
    designation = DesignationSerializer(read_only=True)
    class Meta:
        model = Application
        fields = '__all__'

