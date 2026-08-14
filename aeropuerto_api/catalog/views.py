from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Gates, Flights
from .serializers import GatesSerializer, FlightsSerializer
from .permissions import IsAdminOrReadOnly

class GatesViewSet(viewsets.ModelViewSet):
    queryset = Gates.objects.all().order_by("id")
    serializer_class = GatesSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["code","terminal","is_available","created_at"]
    ordering_fields = ["id", "code","terminal","is_available","created_at"]

class FlightsViewSet(viewsets.ModelViewSet):
    queryset = Flights.objects.select_related("gate").all().order_by("-id")
    serializer_class = FlightsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["gate"]
    search_fields = ["gate", "gate_code", "flight_number", "destination", "status", "departure_time", "created_at"]
    ordering_fields = ["id", "gate", "gate_code", "flight_number", "destination", "status", "departure_time", "created_at"]

