from django.contrib import admin
from .models import DashboardUser, DashboardService, DashboardWidget

admin.site.register(DashboardUser)
admin.site.register(DashboardService)
admin.site.register(DashboardWidget)
