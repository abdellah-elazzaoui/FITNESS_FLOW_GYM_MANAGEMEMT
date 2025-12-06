from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta
import datetime
from uuid import uuid4
from django.core.exceptions import ValidationError



#============= USER =============
class User(AbstractUser):
    phone = models.CharField(max_length=13, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)

    @property
    def has_active_subscription(self):
        return self.subscriptions.first().is_valid() if self.subscriptions.exists() else False
    
    @property
    def current_subscription(self):
        return self.subscriptions.filter(is_active=True).first()

    def __str__(self):
        return f"{self.username}"

#============= Coach =============
class Coach(models.Model):
    SPECIALITY_CHOICES = [
        ('cardio', 'Cardio'),
        ('strength', 'Strength'),
        ('yoga', 'Yoga'),
        ('pilates', 'Pilates'),
        ('hiit', "HIIT"),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    phone = models.CharField(max_length=12, blank=True, null=True)
    username = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    birthday = models.DateField(blank=True, null=True)
    speciality = models.CharField(max_length=20, choices=SPECIALITY_CHOICES)
    

    def __str__(self):
        return f"Coach: {self.username} - {self.speciality}"


#============= SUBSCRIPTION =============
class Subscription(models.Model):
    PLAN_CHOICES = [
        ('3_months', '3 Months'),
        ('6_months', '6 Months'), 
        ('12_months', '12 Months'),
    ]
    
    PLAN_DURATIONS = {
        '3_months': 90,   # 3 months ≈ 90 days
        '6_months': 180,  # 6 months ≈ 180 days
        '12_months': 365  # 12 months ≈ 365 days
    }
    
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)  
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')  
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    start_date = models.DateField(default=timezone.now().date())
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-start_date']
        

    @property
    def end_date(self):
        duration_days = self.PLAN_DURATIONS.get(self.plan, 0)
        return self.start_date + timedelta(days=duration_days)
    
    def is_valid(self):
        return timezone.now().date() <= self.end_date

    @property
    def days_remaining(self):
        if not self.is_active:
            return 0
        today = timezone.now().date()
        remaining = (self.end_date - today).days
        return max(0, remaining)
    
    @property
    def is_expired(self):
        if timezone.now().date() > self.end_date:
            self.is_active = False
        if not self.is_active:
            return True
        return timezone.now().date() > self.end_date
    
    def __str__(self):
        return f"{self.user.username} - {self.plan} - Active: {self.is_active}"


# =============== Session =================    
class Session(models.Model):
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
    ]
    
    TYPE_CHOICES = [
        ('cardio', 'Cardio'),
        ('strength', 'Strength'),
        ('yoga', 'Yoga'),
        ('pilates', 'Pilates'),
        ('hiit', "HIIT"),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='sessions')  # Fixed: plural related_name
    day = models.CharField(max_length=20, choices=DAY_CHOICES)
    time = models.TimeField()
    duration = models.PositiveIntegerField(help_text="Duration in minutes")

    def clean(self):
        if self.duration < 30 or self.duration > 180:
            raise ValidationError("Duration must be between 30 and 180 minutes")
        
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def name(self):
        return self.get_type_display()

    def __str__(self):
        return f"{self.get_type_display()} - {self.day} at {self.time} ({self.duration}min)"


class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='week_progresses')  
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    note = models.TextField(max_length=500, blank=True, null=True)
    date = models.DateField(default=timezone.now().date())

    class Meta:
        unique_together = ['user', 'date']  
        ordering = ['-date']

    
    def __str__(self):
        return f"{self.user.username} - {self.session.name} - {self.date}"
    
# ============= Goal ==============
class Goal(models.Model):
    GOAL_CHOICES = [
        ('weight_loss', 'Weight Loss'),
        ('muscle_gain', 'Muscle Gain'),
        ('endurance', 'Endurance'),
        ('flexibility', 'Flexibility'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')  # Fixed: plural related_name
    title = models.CharField(max_length=100, blank=True, null=True)
    goal_type = models.CharField(max_length=20, choices=GOAL_CHOICES)
    current_value = models.DecimalField(max_digits=6, decimal_places=2)
    target_value = models.DecimalField(max_digits=6, decimal_places=2)  
    start_date = models.DateField(default=timezone.now().date())
    end_date = models.DateField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    class Meta:
        ordering = ['-start_date']


    @property
    def progress_percentage(self):
        """Calculate progress as percentage"""
        if self.target_value == 0:
            return 0
            
        if self.goal_type == 'weight_loss':
            total_to_lose = self.current_value - self.target_value
            if total_to_lose <= 0:
                return 100.0
            return 0.0 
        else:
            progress = (self.current_value / self.target_value) * 100
            return round(max(0, min(100, progress)), 2)

    @property
    def is_completed(self):
        if self.goal_type == 'weight_loss':
            return self.current_value <= self.target_value
        else:
            return self.current_value >= self.target_value
    
    @property
    def is_expired(self):
        if self.end_date:
            return timezone.now().date() > self.end_date
        return False
    
    def __str__(self):
        return f"{self.user.username} - {self.get_goal_type_display()} - {self.progress_percentage}%"


# ==================== MESURE ====================
class Mesure(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mesures')  # Fixed: plural related_name
    date = models.DateField(default=timezone.now().date())
    weight = models.DecimalField(max_digits=5, decimal_places=2, help_text="(Kg)")
    height = models.DecimalField(max_digits=5, decimal_places=2, help_text="(cm)")
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']

    """def clean(self):
        if self.weight <= 0 or self.height <= 0:
            raise ValidationError("Weight and height must be positive values")"""

    @property
    def bmi(self):
        if self.height > 0:
            height_m = self.height / 100  # Convert cm to meters
            return round(self.weight / (height_m ** 2), 2)
        return None
    
    @property
    def bmi_category(self):
        bmi = self.bmi
        if not bmi:
            return "Unknown"
        elif bmi < 18.5:
            return "Underweight"
        elif bmi < 25:
            return "Normal"
        elif bmi < 30:
            return "Overweight"
        else:
            return "Obese"

    def __str__(self):
        return f"{self.user.username} - {self.weight}kg"