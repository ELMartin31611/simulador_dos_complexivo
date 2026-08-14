from rest_framework import serializers
from .models import Gates, Flights

class GatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gates
        fields = ["id", "code","terminal","is_available", "created_at"]

class FlightsSerializer(serializers.ModelSerializer):
    gate_code = serializers.CharField(source="gate.code", read_only=True)

    class Meta:
        model = Flights
        fields = ["id", "gate", "gate_code", "flight_number", "destination", "status", "departure_time", "created_at"]