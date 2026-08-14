from rest_framework import serializers

class AirlinesSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    code = serializers.CharField(max_length=120)
    country = serializers.CharField(max_length=120)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateField(required=False) 



class Estado:
        CREATED = "created"
        BOARDING_STARTED = "boarding started"
        DEPARTED = "departed"
        DELAYED = "deplayed"
        CANCELLED = "cancelled"
        

        CHOICES = [
            (CREATED, "Created"),
            (BOARDING_STARTED, "Boarding started"),
            (DEPARTED, "Departed"),
            (DELAYED, "Deplayed"),
            (CANCELLED, "Cancelled"),
        ]


class Estadox:
        WEB = "web"
        MOBILE = "mobile"
        SYSTEM = "system"

        CHOICES = [
            (WEB, "Web"),
            (MOBILE, "Mobile"),
            (SYSTEM, "System"),
        ]



class FlightEventsSerializer(serializers.Serializer):
    flight_id = serializers.IntegerField()     
    event_type = serializers.ChoiceField(
        choices=Estado.CHOICES,
        default=Estado.CREATED
    )   
    source = serializers.ChoiceField(
        choices=Estadox.CHOICES,
        default=Estadox.WEB
    )
    created_at = serializers.DateField(required=False)  
    note = serializers.CharField(required=False, allow_blank=True)



