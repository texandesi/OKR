from django.contrib import admin

from .models import Organization

# Register your models here.


class OrganizationAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['id', 'name', 'description']}),
    ]
    list_display = ('id', 'name', 'description')
    list_filter = ['name']
    search_fields = ['name']

admin.site.register(Organization, OrganizationAdmin)
