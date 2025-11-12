import pandas as pd
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Import RSS India members from Excel and set DOB as password'

    def add_arguments(self, parser):
        parser.add_argument('excel_path', type=str, help='Path to the Excel file')

    def handle(self, *args, **kwargs):
        excel_path = kwargs['excel_path']
        df = pd.read_excel(excel_path)

        # Clean up column names
        df.columns = [str(c).strip().upper() for c in df.columns]

        def safe_date(val):
            """Safely parse date formats"""
            if pd.isna(val):
                return None
            if isinstance(val, datetime):
                return val.date()
            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
                try:
                    return datetime.strptime(str(val), fmt).date()
                except Exception:
                    continue
            return None

        for _, row in df.iterrows():
            reg_id = str(row.get('REG ID', '')).strip()
            if not reg_id or reg_id.lower() == 'nan':
                continue
            user_id = reg_id
            name = str(row.get('NAME', '')).strip()
            gender = str(row.get('GENDER', '')).strip()
            mobile = str(row.get('MOBILE NO', '')).strip()
            dob = safe_date(row.get('DOB'))
            profession = str(row.get('PROFESSION', '')).strip()
            city = str(row.get('VILLAGE / CITY', '')).strip()
            tehsil = str(row.get('TEHSIL', '')).strip()
            district = str(row.get('DISTRICT', '')).strip()
            state = str(row.get('STATE', '')).strip()
            pin = str(row.get('PIN CODE', '')).strip()
            status = str(row.get('STATUS', '')).strip()

            email = f"{reg_id.lower()}@rssindia.org"

            user, created = User.objects.get_or_create(
                user_id=reg_id,
                defaults={
                    'user_id': user_id,
                    'username': email,
                    'email': email,
                    'name': name,
                    'gender': gender,
                    'phone': mobile,
                    'dob': dob,
                    'profession': profession,
                    'city': city,
                    'sub_district': tehsil,
                    'district': district,
                    'state': state,
                    'postal_code': pin,
                    'is_verified': status.lower() in ['approved', 'active', 'verified'],
                }
            )

            if created:
                # Set password from DOB if available
                if dob:
                    user.set_password(dob.strftime("%d%m%Y"))
                else:
                    user.set_password("rss@12345")  # fallback if DOB missing
                user.save()
                self.stdout.write(self.style.SUCCESS(f"✅ Created user: {name} ({reg_id})"))
            else:
                self.stdout.write(f"ℹ️ User already exists: {reg_id}")
