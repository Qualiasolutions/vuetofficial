# Generated by Django 4.0.4 on 2023-10-13 16:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0020_professionalcategory'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfessionalEntity',
            fields=[
                ('entity_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.entity')),
                ('professional_category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.professionalcategory')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('core.entity',),
        ),
    ]
