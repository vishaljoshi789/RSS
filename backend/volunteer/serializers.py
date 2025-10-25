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

class NestedDesignationSerializer(ModelSerializer):
    volunteer_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Designation
        fields = ('id', 'title', 'total_positions', 'volunteer_count')

class NestedLevelSerializer(ModelSerializer):
    designations = NestedDesignationSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ('id', 'name', 'designations')

class WingDetailSerializer(ModelSerializer):
    levels = NestedLevelSerializer(many=True, read_only=True)

    class Meta:
        model = Wing
        fields = ('id', 'name', 'description', 'levels') 