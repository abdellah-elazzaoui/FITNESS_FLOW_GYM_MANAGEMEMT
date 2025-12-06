from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.utils import timezone

from .models import User, Coach, Session, Subscription, Progress


class AddSessionTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
		# give user an active subscription
		Subscription.objects.create(user=self.user, plan='3_months')

		self.coach = Coach.objects.create(username='c1', first_name='Coach', last_name='One', speciality='cardio')
		self.session = Session.objects.create(type='cardio', coach=self.coach, day='monday', time='09:00', duration=60)

	def test_add_session_success(self):
		self.client.force_authenticate(user=self.user)
		resp = self.client.post('/add_session/', {'type': 'cardio', 'note': 'Nice session'})
		self.assertEqual(resp.status_code, 201)
		self.assertIn('session', resp.data)
		# check a Progress entry exists for today
		today = timezone.now().date()
		self.assertTrue(Progress.objects.filter(user=self.user, date=today).exists())

	def test_add_session_duplicate(self):
		self.client.force_authenticate(user=self.user)
		# first create
		resp1 = self.client.post('/add_session/', {'type': 'cardio'})
		self.assertEqual(resp1.status_code, 201)
		# second attempt same day should fail
		resp2 = self.client.post('/add_session/', {'type': 'cardio'})
		self.assertEqual(resp2.status_code, 400)
		self.assertIn('error', resp2.data)

	def test_add_session_invalid_type(self):
		self.client.force_authenticate(user=self.user)
		resp = self.client.post('/add_session/', {'type': 'unknown'})
		self.assertEqual(resp.status_code, 400)
		self.assertIn('error', resp.data)
