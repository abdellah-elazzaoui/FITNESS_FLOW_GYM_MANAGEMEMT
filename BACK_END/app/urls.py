from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("register_user/",views.register_user,name="register_user"),
    path("login_user/",views.login_user,name="login_user"),
    path("dashboard_user_data/",views.dashboard_user_data,name="dashboard_user_data"),
    path("add_session/",views.add_session,name="add_session"),
    path("add_mesure/",views.add_mesure,name="add_mesure"),
    path("chat_view/",views.chat_view,name="chat_view"),
    path("create_goal/",views.create_goal,name="create_goal"),
    path("delete_goal/",views.delete_goal,name="delete_goal"),
    path("add_subscription/",views.add_subscription,name="add_subscription"),
    path("get_user_info/",views.get_user_info,name="get_user_info"),
    path("user_profile_page/",views.user_profile_page,name="user_profile_page"),
    ############# ADMIN ###########
    path("admin_dashboard/",views.admin_dashboard,name="admin_dashboard"),
    path("admin_add_session/",views.admin_add_session,name="admin_add_session"),
    path("admin_delete_session/",views.admin_delete_session,name="admin_delete_session"),
    path("admin_update_session/",views.admin_update_session,name="admin_update_session"),
    path("admin_add_coach/",views.admin_add_coach,name="admin_add_coach"),
    path("admin_delete_coach/",views.admin_delete_coach,name="admin_delete_coach"),
    path("admin_update_coach/",views.admin_update_coach,name="admin_update_coach"),
]

