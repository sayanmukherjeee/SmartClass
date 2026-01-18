django-admin startproject config .
mkdir settings
cd config
ni settings/production.py
ni settings/development.py
ni settings/database.py
ni settings/__init__.py
cd ..
pip install -r requirements.txt
python manage.py startapp core
python manage.py startapp users


# Trainify - Modern Learning Management System

A complete, production-ready LMS built with Django (Backend) and React/TypeScript (Frontend).

## Features

### Core Features
- **User Authentication**: JWT-based auth with role-based access (User/Admin)
- **Course Management**: Create, manage, and publish courses with modules and lessons
- **Learning Progress**: Track course progress, lesson completion, and quiz attempts
- **Certificate Generation**: Auto-generate certificates upon course completion
- **Payment Integration**: Stripe integration for course purchases
- **Organization Management**: Multi-tenant support for organizations
- **Analytics Dashboard**: Comprehensive analytics for users, courses, and system
- **Responsive Design**: Modern UI that works on all devices

### Technical Stack
- **Backend**: Django 4.2 + Django REST Framework
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: PostgreSQL
- **Cache**: Redis
- **File Storage**: AWS S3 (or local)
- **Authentication**: JWT with refresh tokens
- **Containerization**: Docker + Docker Compose

## Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd trainify