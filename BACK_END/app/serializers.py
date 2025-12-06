from rest_framework import serializers
from django.contrib.auth import get_user_model
import datetime
from django.utils import timezone
from .models import User, Goal, Subscription, Mesure ,Session , Coach ,Progress

User = get_user_model()


# ==================== AUTH SERIALIZERS ====================
class UserRegistrationSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True, min_length=8)
    comfirm_password = serializers.CharField(write_only=True, min_length=8)  

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "phone", "birthday",
                  "password", "comfirm_password"] 
        
    def validate(self, data):
        # Add password validation
        if data.get('password') != data.get('comfirm_password'):
            raise serializers.ValidationError({
                "comfirm_password": "Passwords do not match."
            })
        return data

    def create(self, validated_data):
        validated_data.pop("comfirm_password")
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):  
    has_active_subscription = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name", "email", "phone", "birthday", "has_active_subscription","date_joined",'is_staff',
            'is_superuser'
        ]  
        read_only_fields = ['id', 'username', 'has_active_subscription',"date_joined"]


# ==================== MEASUREMENT SERIALIZERS ====================
class MesureSerializer(serializers.ModelSerializer):  # Fixed: typo in class name
    bmi = serializers.ReadOnlyField()
    bmi_category = serializers.ReadOnlyField()

    class Meta:
        model = Mesure
        fields = [
            "id", "user", "date", "weight", "height", "bmi", "bmi_category"  
        ]
        read_only_fields = ["user", "bmi", "bmi_category"]  

class CreateMesureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesure
        fields = ["date", "weight", "height"]

    def validate(self, data):
        user = self.context['request'].user
        date = timezone.now().date()

        if Mesure.objects.filter(user=user, date=date).exists():
            raise serializers.ValidationError("Measurement already exists for this date")
        return data


# ==================== GOAL SERIALIZERS ====================
class GoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    is_completed = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()

    class Meta:
        model = Goal
        fields = [
            "title", "goal_type", "current_value", "target_value", 
            "progress_percentage", "is_completed", "is_expired"  
        ]
        read_only_fields = ["user", "progress_percentage", "is_completed", "is_expired"]  


class GoalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['title', 'goal_type', 'current_value', 'target_value']  


# ==================== SUBSCRIPTION SERIALIZERS ====================
class SubscriptionSerializer(serializers.ModelSerializer):
    end_date = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    user = UserProfileSerializer()
    class Meta:
        model = Subscription
        fields = [
            "id", "user", "plan", "start_date", "end_date", "days_remaining", 
            "is_expired", "is_active"  
        ]
        read_only_fields = ["user", "start_date", "end_date", "days_remaining", "is_expired"] 



class CreateSubscriptionSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Subscription
        fields = ["plan"]  


# ==================== COACH SERIALIZERS ====================
class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = ['id','username',"first_name","last_name","speciality","birthday","phone"]



# ==================== SESSION SERIALIZERS ====================
class SessionSerializer(serializers.ModelSerializer):
    coach = CoachSerializer(read_only=True)
    class Meta:
        model = Session
        fields = ["id",'type',"duration","coach","day","time","name"]
        

# ==================== PROGRESS SERIALIZERS ====================
class ProgressSerializer(serializers.ModelSerializer):
    session = SessionSerializer(read_only=True)
    class Meta:
        model = Progress
        fields = ['id','user','session','note','date']
        ordering = ['-date']
        read_only_fields = ['user']


class CreateProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['session','note','date']

        def validate(self,data):
            user = self.context['request'].user
            date = data['date']
            if Session.objects.filter(user=user,date=date).exists():
                raise serializers.ValidationError("Session already exists for this date")
            return data
