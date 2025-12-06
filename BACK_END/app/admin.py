from django.contrib import admin
from .models import User, Coach, Subscription, Session, Goal ,Progress ,Mesure

# Register your models here.

@admin.register(User)
class AdminUser(admin.ModelAdmin):
    list_display = ["username",'first_name','last_name','email','phone','birthday','has_active_subscription','is_superuser','is_staff','current_subscription','date_joined']

@admin.register(Coach)
class CoachAdmin(admin.ModelAdmin):
    list_display = ['username','first_name','last_name','phone','speciality']

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user','plan','start_date','is_active','is_expired','days_remaining']

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['type','coach','day','time','duration']

@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ['user','session','note','date']

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['user','title','goal_type','current_value','current_value','start_date','end_date','is_completed','is_expired']

@admin.register(Mesure)
class MesureAdmin(admin.ModelAdmin):
    list_display = ['user','weight','height','date','bmi','bmi_category']

