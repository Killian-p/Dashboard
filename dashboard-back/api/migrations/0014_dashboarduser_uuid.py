# Generated by Django 3.2.9 on 2021-12-16 00:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_dashboardservice_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='dashboarduser',
            name='uuid',
            field=models.UUIDField(default=None, null=True),
        ),
    ]