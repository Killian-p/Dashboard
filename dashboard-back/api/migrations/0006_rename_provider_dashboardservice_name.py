# Generated by Django 3.2.9 on 2021-12-04 13:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_dashboardservice_dashboardwidget'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dashboardservice',
            old_name='provider',
            new_name='name',
        ),
    ]
