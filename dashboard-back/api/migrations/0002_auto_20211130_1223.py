# Generated by Django 3.2.9 on 2021-11-30 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DashboardUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=30)),
                ('password', models.CharField(max_length=256)),
                ('email', models.EmailField(max_length=256)),
            ],
        ),
        migrations.DeleteModel(
            name='User',
        ),
    ]
