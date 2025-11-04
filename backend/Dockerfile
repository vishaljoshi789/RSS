# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Collect static files and apply migrations
RUN python manage.py collectstatic --noinput
RUN python manage.py migrate

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
