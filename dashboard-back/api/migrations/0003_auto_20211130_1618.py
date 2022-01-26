# Generated by Django 3.2.9 on 2021-11-30 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20211130_1223'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dashboarduser',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='dashboarduser',
            name='username',
            field=models.CharField(max_length=30, unique=True),
        ),
    ]