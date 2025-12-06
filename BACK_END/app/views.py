from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
import datetime as dt
from datetime import timedelta
from django.db.models.functions import ExtractMonth, ExtractYear

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import *
from .serializers import (UserRegistrationSerializer ,UserProfileSerializer ,SessionSerializer ,MesureSerializer ,CreateProgressSerializer,CreateMesureSerializer,
                          GoalSerializer,GoalCreateSerializer , CreateSubscriptionSerializer , SubscriptionSerializer,ProgressSerializer , CoachSerializer)

# Create your views here.
User = get_user_model()

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = request.data
        required_fields = ['username', 'email', 'password', 'comfirm_password']
        for field in required_fields:
            if field not in data or not data[field]:
                return Response(
                    {'error': f"{field.replace('_', ' ').title()} is required!"},
                    status=status.HTTP_400_BAD_REQUEST
                )        
        if data['password'] != data['comfirm_password']:  
            return Response(
                {"error": "Passwords do not match"},  
                status=status.HTTP_400_BAD_REQUEST  
            )
        if User.objects.filter(username=data['username']).exists():
            return Response(
                {'error': 'Username already exists'},  
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(phone=data['phone']).exists():
            return Response(
                {'error': 'Phone Number already exists'},  
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'error': "Email already exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = UserRegistrationSerializer(data=data)          
        
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response(
                {
                    'message': "Account created successfully",  
                    "user": UserRegistrationSerializer(user).data,  
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token)
                    }
                },
                status=status.HTTP_201_CREATED
            )
        else:
            print("Serializer errors:", serializer.errors)  
            return Response(
                {
                    'error': 'Error creating account', 
                    'details': serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")  
        return Response(
            {
                'error': 'Internal server error',  
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_user(request):
    try:
        data = request.data
        if not data['username']:
            return Response({"error":"username is required"},status=status.HTTP_400_BAD_REQUEST)
        if not data['password']:
            return Response({"error":"password is required"},status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=data['username'],password=data['password'])
        
        if user is None:
            return Response({"error":"username or password is Incorrect"},status=status.HTTP_400_BAD_REQUEST)
        
        if not user.is_active:
            return Response({"error":"Account disactived"},status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken.for_user(user)

        return Response({
            "message":"Logging succssefully",
            "user" : UserProfileSerializer(user).data,
            "token":{
                "refresh":str(refresh),
                "access":str(refresh.access_token)
            }
        },status=status.HTTP_200_OK)
        
    except Exception as e:
        print(str(e))
        return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST)




#============== Subscription ================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_subscription(request):
    try:
        user = request.user
        plan = request.data.get("plan","")
        if not plan:
            return Response({'error':"Please choose a Plan"},status=status.HTTP_400_BAD_REQUEST)
        
        print("creating subscription")
        new_subscription = Subscription.objects.create(user=user,plan = plan)
        print("Creating Serializer")
        serializer = CreateSubscriptionSerializer(new_subscription)
        print("Serializer Created !")
        if serializer :
            print("Serializer :",serializer.data)
            return Response({'message':"Welcome to Fitness Flow","data":serializer.data},status=status.HTTP_201_CREATED)
        return Response({'error':'ERROR with Creating Subscription'},status=status.HTTP_400_BAD_REQUEST)
    
        
    except Exception as e:
        if new_subscription:
            new_subscription.delete()
        return Response({'error':f"ERROR : {str(e)}"},status=status.HTTP_400_BAD_REQUEST)




# ============== Session =================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_session(request):
    try:
        user = request.user
        data=request.data
        date = timezone.now().date()

        if not user.has_active_subscription:
            return Response({'error':'You need an active subscription to create a goal.'},status=status.HTTP_400_BAD_REQUEST)

        if Progress.objects.filter(user=user,date=date).exists():
            return Response({'error':"You Do Not Have More than One Session Per Day"},status=status.HTTP_400_BAD_REQUEST)
        
        session = Session.objects.filter(type = data['type']).first()
        
        if not session:
            return Response({
                'error':"Session Not Exist"
            },status=status.HTTP_400_BAD_REQUEST)
        print("Session Exist",session)
        print("Creating new Progress")
        
        new_progress = Progress.objects.create(user=user,session=session,note=data.get('note',''))

        print("New Session Created:", new_progress)

        serializer = CreateProgressSerializer(new_progress)
        print("Serializer created:")
        if serializer:
            return Response({'message': "Session added successfully.", 'session': serializer.data}, status=status.HTTP_201_CREATED)

        return Response({'error': 'Invalid data', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        

    except Exception as e:
        return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)    


# ============= Mesure ================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_mesure(request):
    try:
        user= request.user
        data=request.data
        weight = float(data.get('weight',0))
        height = float(data.get('height',0))

        today = timezone.now().date()
        start_week = today - timezone.timedelta(days=today.weekday())
        last_week = start_week + timezone.timedelta(days=6)

        if weight <=0 or height<=0:
            return Response({'error':"Weight and Height must be positive values"},status=status.HTTP_400_BAD_REQUEST)
        
        if not user.has_active_subscription:
            return Response({'error':'You need an active subscription to create a goal.'},status=status.HTTP_400_BAD_REQUEST)

        if Mesure.objects.filter(user=user , date__range=[start_week,last_week]).exists():
            return Response({'error':"You Can Not Add More Than One Mesure Per Week"},status=status.HTTP_400_BAD_REQUEST)
        
        print("Creating new Mesure...")
        new_mesure = Mesure.objects.create(
            user=user,
            weight = weight,
            height = height
        )
        print("New Mesure Created:", new_mesure)
        serializer = CreateMesureSerializer(new_mesure)
        print("Serializer created:")
        if serializer:
            return Response({'message': "Mesure added successfully.", 'mesure': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'error': 'Invalid data', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
        
    except Exception as e:
        return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)



#================ GOAL ====================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_goal(request):
    try:
        user=request.user
        data=request.data
        if not user.has_active_subscription:
            return Response({'error':'You need an active subscription to create a goal.'},status=status.HTTP_400_BAD_REQUEST)
        
        if float(data.get('current_value')) <0 or float(data.get('target_value')) <= 0:
            return Response({'error':"Current and Target values must be positive numbers."},status=status.HTTP_400_BAD_REQUEST)
        
        goals = Goal.objects.filter(user=user)
        if goals and any(not goal.is_completed and not goal.is_expired for goal in goals):
            return Response({'error':"You can not have more than one active goal at a time."},status=status.HTTP_400_BAD_REQUEST)
        print("Creating new Goal...")
        new_goal = Goal.objects.create(user=user,title=data.get('title',''),goal_type=data.get('goal_type',''),current_value=float(data.get('current_value')),target_value=float(data.get('target_value')))
        print("New Goal Created:", new_goal)
        print('Creating Serializer for Goal...')
        serializer = GoalCreateSerializer(new_goal)
        print("Serializer created:")
        return Response({'message': "Goal created successfully.", 'goal': serializer.data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)    


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_goal(request):
    try:
        user = request.user
        goal = Goal.objects.filter(user=user).first()
        if not goal:
            return Response({'error':"No goal found to delete."},status=status.HTTP_400_BAD_REQUEST)
        goal.delete()
        return Response({'message':"Goal deleted successfully."},status=status.HTTP_200_OK)
    except Exception as e:  
        return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    try:
        user = request.user
        return Response({"user":UserProfileSerializer(user).data},status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error":f"ERROR {str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_page(request):
    try:
        user = request.user
        workouts = len(Progress.objects.filter(user=user))
        recent_activity = Progress.objects.filter(user = user)[:3]
        last_mesure = Mesure.objects.filter(user = user).first()
        goal = Goal.objects.filter(user=user).first()
        #print("----------------")
        #print("Workouts : ",ProgressSerializer(recent_activity,many=True).data)
        return Response({
            "workouts":workouts,
            "weight":last_mesure.weight,
            "recent_activity":ProgressSerializer(recent_activity,many=True).data,
            "goal":GoalSerializer(goal).data
        },status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            "error": f"ERROR {str(e)}"
        },status=status.HTTP_400_BAD_REQUEST)


#===================== DASHBOARD USER DATA ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_user_data(request):
    start_week = timezone.now().date() - timedelta(days=timezone.now().date().weekday())
    end_week = start_week + timedelta(days=6)
    try:
        user = request.user
        stats = Mesure.objects.filter(user=user).order_by('date')
        last_mesure =MesureSerializer(stats.last())
        stats_data = MesureSerializer(stats,many=True)
        sessions = Session.objects.all()
        sessions_data = SessionSerializer(sessions, many=True)
        progress = Progress.objects.filter(user=user).order_by('-date')
        weakly_progress = progress.filter(date__range=[start_week,end_week])
        subscription = user.subscriptions.first()
        #print("subscription",SubscriptionSerializer(subscription).data) 
        try:
            goal = Goal.objects.filter(user=user).first()
            serializer = GoalSerializer(goal)
        except:
            goal = None
            print("No goal found for user.")

        return Response({
            "subscription":SubscriptionSerializer(subscription).data,
            "sessions": sessions_data.data,
            "stats":stats_data.data,
            "last_mesure":last_mesure.data,
            "user": UserProfileSerializer(user).data,
            "weakly_progress": len(weakly_progress),
            "goal": serializer.data if goal else None
        }, status=status.HTTP_200_OK) 
     
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)










# ==================== AI Assistant ====================
from django.shortcuts import render
#from .agents.chat_agents import agent
import json
from django.http import JsonResponse
import asyncio
#Create your views here.
agent=None
@api_view(['POST'])
def chat_view(request):
      
    try:    
        data = request.data
        message = data.get('message',"").strip()
        print(f"Receved {message} to View")
        if not message:
            return JsonResponse({"response":"Please write a message"}) 
        try:
            loop = asyncio.get_event_loop()
        except:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)  
        if loop.is_running():
            import nest_asyncio
            nest_asyncio.apply()
            response = loop.run_until_complete(agent.chat(message))
        else:
            response = loop.run_until_complete(agent.chat(message))
        return JsonResponse({
            'response':response,
            "status":"success"
        },status=200)              
    except Exception as e :
        print(str(e))
        return JsonResponse({
            'error':str(e),
            'status':"Failed to get response"
        },status=500)

    



######### Admin ##########

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    today = timezone.now().date()
    first_day_of_current_month = today.replace(day=1)
    last_month_end = first_day_of_current_month - timedelta(days=1)
    last_month_start = last_month_end.replace(day=1)

    
    try:
        user = request.user
        total = len(User.objects.all())
        total_active = User.objects.filter(is_active=True).count()
        last_month = timezone.now().date() - timedelta(days=30)
        last_month_total = User.objects.filter(date_joined__range = [last_month_start, last_month_end]).count()
        subscriptions = Subscription.objects.filter(start_date__range=[last_month_start, last_month_end])
        revenue = sum(400 if sub.plan == '3_months' else 700 if sub.plan == '6_months' else 1300 for sub in subscriptions)
        today_signup = User.objects.filter(date_joined = timezone.now().date()).count()
        monthly_counts = []
        month_labels = []
        all_subscriptions = Subscription.objects.all()
        sessions = Session.objects.all()
        coachs = Coach.objects.all()
        for i in range(11, -1, -1):  
            target_date = today - timedelta(days=30*i)
            year = target_date.year
            month = target_date.month
            count = Subscription.objects.filter(
                start_date__year=year,
                start_date__month=month
            ).count()
            
            monthly_counts.append(count)
            month_labels.append(f"{month:02d}/{year}")

        #print('subscriptions',SubscriptionSerializer(all_subscriptions , many=True).data)


        return Response({
            'total':total,
            'last_month_total':last_month_total,
            'user':UserProfileSerializer(user).data,
            'total_active':total_active,
            'revenue':revenue,
            'today_signup':today_signup,
            'total_months':month_labels,
            'monthly_counts':monthly_counts,
            'subscriptions':SubscriptionSerializer(all_subscriptions , many=True).data,
            'sessions':SessionSerializer(sessions,many=True).data,
            'coachs':CoachSerializer(coachs,many=True).data
        },status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error':f'ERROR {str(e)}'
        },status=status.HTTP_400_BAD_REQUEST)
    

######### ADMIN Session ############
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_add_session(request):
    data = request.data
    
    # Validate required fields
    required_fields = ['type', 'coach', 'day', 'time', 'duration']
    for field in required_fields:
        if field not in data:
            return Response(
                {'error': f'{field} is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    try:
        hour, minute = map(int, str(data['time']).split(":"))
        duration_minutes = int(data['duration'])
        
        # Convert to time object
        session_time = datetime.time(hour=hour, minute=minute)
        
        # Calculate end time - FIX: Use datetime for arithmetic
        temp_datetime = datetime.datetime.combine(datetime.date.today(), session_time)
        end_datetime = temp_datetime + datetime.timedelta(minutes=duration_minutes)
        end_time = end_datetime.time()
        
        # Check for exact time conflict
        existing_same_time = Session.objects.filter(
            day=data['day'],
            time=session_time
        ).exists()
        
        if existing_same_time:
            return Response(
                {'error': f'A session already exists at {data["time"]} on {data["day"]}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check for overlapping sessions
        sessions_same_day = Session.objects.filter(day=data['day'])
        
        for existing_session in sessions_same_day:
            existing_start = existing_session.time
            # FIX: Same issue here
            existing_temp = datetime.datetime.combine(datetime.date.today(), existing_start)
            existing_end_datetime = existing_temp + datetime.timedelta(minutes=existing_session.duration)
            existing_end_time = existing_end_datetime.time()
            
            # Check if new session starts during existing session
            if session_time >= existing_start and session_time < existing_end_time:
                return Response(
                    {'error': 'New session starts during an existing session'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if new session ends during existing session
            if end_time > existing_start and end_time <= existing_end_time:
                return Response(
                    {'error': 'New session ends during an existing session'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if new session completely overlaps existing session
            if session_time <= existing_start and end_time >= existing_end_time:
                return Response(
                    {'error': 'New session completely overlaps an existing session'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        coach = Coach.objects.get(id=data['coach'])
        session = Session.objects.create(
            type=data['type'],
            coach=coach, 
            day=data['day'],
            time=session_time,
            duration=duration_minutes
        )
        
        return Response(
            {
                'message': 'Session created successfully',
                'session_id': str(session.id),
                'day': session.day,
                'time': session.time.strftime('%H:%M'),
                'duration': session.duration,
                'type': session.type
            },
            status=status.HTTP_201_CREATED
        )
        
    except Coach.DoesNotExist:
        return Response(
            {'error': 'Coach not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except ValueError as e:
        return Response(
            {'error': f'Invalid time format. Use HH:MM format. Error: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to create session: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def admin_delete_session(request):
    id = request.data.get('id','')
    print("ID :",id)
    try:
        session = Session.objects.filter(id=str(id)).exists()
        if session:
            session = Session.objects.filter(id=str(id))
            session.delete()
            return Response({'message':"Session Deleted"})    
        print("session Not exist ")
    except Exception as e:
        print("ERROR",str(e))
        return Response({'error':"ERROR with deleting session"})         


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_update_session(request):
    try:
        data = request.data
        #print(f"Data received: ", data)
    
        hour, minute = map(int, str(data['time']).split(":"))
        duration_minutes = int(data['duration'])
        
        session_time = datetime.time(hour=hour, minute=minute)
        
        temp_datetime = datetime.datetime.combine(datetime.date.today(), session_time)
        end_datetime = temp_datetime + datetime.timedelta(minutes=duration_minutes)
        end_time = end_datetime.time()
       
        # Fixed: id__not -> id (exclude current session from check)
        existing_same_time = Session.objects.filter(
            day=data['day'],
            time=session_time,
        ).exclude(id=data['id']).exists()
        
        if existing_same_time:
            return Response(
                {'error': f'A session already exists at {data["time"]} on {data["day"]}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Fixed: removed id_=data['day'], should be exclude(id=data['id'])
        sessions_same_day = Session.objects.filter(
            day=data['day']
        ).exclude(id=data['id'])
        
        for existing_session in sessions_same_day:
            existing_start = existing_session.time
            
            existing_temp = datetime.datetime.combine(datetime.date.today(), existing_start)
            existing_end_datetime = existing_temp + datetime.timedelta(minutes=existing_session.duration)
            existing_end_time = existing_end_datetime.time()
            
            # Check if new session starts during existing session
            if session_time >= existing_start and session_time < existing_end_time:
                return Response(
                    {'error': 'New session starts during an existing session'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Check if new session ends during existing session
            if end_time > existing_start and end_time <= existing_end_time:
                return Response(
                    {'error': 'New session ends during an existing session'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Check if new session completely overlaps existing session
            if session_time <= existing_start and end_time >= existing_end_time:
                return Response(
                    {'error': 'New session completely overlaps an existing session'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        coach = Coach.objects.get(id=data['coach'])
        Session.objects.filter(id=data['id']).update(
            type=data['type'],
            coach=coach,
            day=data['day'],
            time=session_time,
            duration=duration_minutes
        )
        
        return Response({'message': "Session Updated Successfully!"}, status=status.HTTP_200_OK)
        
    except Session.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
    except Coach.DoesNotExist:
        return Response({'error': 'Coach not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return Response({'error': f"ERROR : Updating"}, status=status.HTTP_400_BAD_REQUEST)

############## Admin Coach ###########

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_add_coach(request):
    try:
        data = request.data
        for field in ['username','first_name','last_name','phone','birthday','speciality']:
            if not data[field] or data[field].strip() == '':
                return Response({"error" : f"{field} if required "},status=status.HTTP_400_BAD_REQUEST)
        #check username
        if Coach.objects.filter(username = data['username']).exists():
            return Response({"error":"ERROR Duplicate username"},status=status.HTTP_400_BAD_REQUEST)
        #check phone
        if Coach.objects.filter(phone = data['phone']).exists():
            return Response({"error":"ERROR Duplicate Phone Number"},status=status.HTTP_400_BAD_REQUEST)    
        new_coach = Coach.objects.create(
            phone = data['phone'],
            username = data['username'],
            first_name = data['first_name'],
            last_name = data['last_name'],
            speciality = data['speciality'],
            birthday = data['birthday']
        )
        if new_coach:
            return Response({"message":"New Coach Successfully Added"},status = status.HTTP_201_CREATED)
        else:
            return Response({"error":"ERROR with Adding new Coach"},status = status.HTTP_400_BAD_REQUEST)        
    except Exception as e:
        return Response({"error":f"ERROR : {str(e)}"},status = status.HTTP_400_BAD_REQUEST)

        ##############
@api_view(['DELETE'])    
@permission_classes([IsAuthenticated])
def admin_delete_coach(request):
    #print("Request Recieved !")
    try:
        id = request.data.get('id',"")
        if not id : 
            return Response({"error":f"ERROR with request"},status = status.HTTP_400_BAD_REQUEST)
        coach = Coach.objects.filter(id = id)
        if not coach :
            return Response({"error":"Coach not FOUND"},status=status.HTTP_400_BAD_REQUEST)
        coach.delete() 
        return Response({"message":"coach deleted Succesfflly"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error":f"ERROR : {str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    
    #################

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_update_coach(request):
    try:
        data = request.data
        for field in ['username','first_name','last_name','phone','birthday','speciality']:
            if not data[field] or data[field].strip() == '':
                return Response({"error" : f"{field} if required "},status=status.HTTP_400_BAD_REQUEST)

        id = data.get('id',"")  
        print("ID : ",id)  

        if Coach.objects.filter(username = data['username']).exclude(id=id).exists():
            return Response({"error":"ERROR Duplicate username"},status=status.HTTP_400_BAD_REQUEST)
        
        if Coach.objects.filter(phone = data['phone']).exclude(id=id).exists():
            return Response({"error":"ERROR Duplicate Phone Number"},status=status.HTTP_400_BAD_REQUEST)
        
        updated_coach = Coach.objects.filter(id = id)
        if not updated_coach :
            return Response({"error":"ERROR Coach Not Found"},status=status.HTTP_400_BAD_REQUEST)
        
        updated_coach.update(
            username = data['username'],
            first_name = data['first_name'],
            last_name = data['last_name'],
            phone = data['phone'],
            birthday = data['birthday'],
            speciality = data['speciality'],  
        )
        return Response({'message':"Coach updated successfully"},status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error':f"ERROR updating coach - {str(e)}"})