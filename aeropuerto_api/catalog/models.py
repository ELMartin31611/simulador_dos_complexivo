from django.db import models

class Gates(models.Model):
    code = models.CharField(max_length=10, unique=True)
    terminal = models.CharField(max_length=20, unique=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(null=True, blank=True)      


    def __str__(self):
        return self.code



class Estado(models.TextChoices):
    SCHEDULED = "scheduled", "Scheduled"
    BOARDING = "boarding", "Boarding"
    DEPARTED = "departed", "Departed"
    DELAYED = "delayed", "Delayed"
    CANCELLED = "cancelled", "Cancelled"


class Flights(models.Model):
    gate = models.ForeignKey(Gates, on_delete=models.PROTECT, related_name="gate")
    flight_number = models.CharField(max_length=20)
    destination = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.SCHEDULED
    )
    departure_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.gate.code} {self.flight_number} ({self.destination})"




