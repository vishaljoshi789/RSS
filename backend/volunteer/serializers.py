from rest_framework.serializers import ModelSerializer
from .models import Wing, Level, Designation, Volunteer

class WingSerializer(ModelSerializer):
    class Meta:
        model = Wing
        fields = '__all__'

class LevelSerializer(ModelSerializer):
    class Meta:
        model = Level
        fields = '__all__'

class DesignationSerializer(ModelSerializer):
    class Meta:
        model = Designation
        fields = '__all__'

class VolunteerSerializer(ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'

        