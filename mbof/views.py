import os
import logging
import datetime

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework import generics, viewsets

from .models import Event, User, Vote
from .serializers import EventSerializer, UserSerializer, VoteSerializer

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('surname')
    serializer_class = UserSerializer


class CurrentUserViewSet(UserViewSet):
    queryset = User.objects.filter(loginName=os.getenv('REMOTE_USER')).order_by('surname')


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Event.objects.all().order_by('postingTime')
    serializer_class = EventSerializer


class EventListViewSet(generics.ListAPIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = EventSerializer

    def get_queryset(self):
        ACTIVE = 'active'
        logger.debug('Type=' + self.kwargs['type'])
        current_time = timezone.now()
        if self.kwargs['type'] is None:
            return Event.objects.all().order_by('postingTime')
        query_type = self.kwargs['type']
        query_type = query_type.replace('/', '')
        if query_type == 'current':
            return Event.objects.filter(startTime__lte=current_time, endTime__gte=current_time, status=ACTIVE).order_by('postingTime')
        if query_type == 'upcoming':
            one_week_out = current_time + datetime.timedelta(days=7)
            return Event.objects.filter(startTime__range=[current_time, one_week_out], status=ACTIVE).order_by('postingTime')
        else:
            return Event.objects.all().order_by('postingTime')


class VoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
