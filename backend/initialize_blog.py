#!/usr/bin/env python
"""Initialize Sugesto Blog - Create admin user and blog index page"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from wagtail.models import Page
from sugesto_blog.models import BlogIndexPage

def create_admin_user():
    """Create default admin user"""
    username = 'admin'
    email = 'admin@sugesto.xyz'
    password = 'sugesto_admin_2024'

    if User.objects.filter(username=username).exists():
        print(f"[OK] Admin user '{username}' already exists")
        return False

    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"[OK] Created superuser:")
    print(f"   Username: {username}")
    print(f"   Password: {password}")
    print(f"   Email: {email}")
    return True

def create_blog_index():
    """Create blog index page"""
    if BlogIndexPage.objects.exists():
        print("[OK] Blog index page already exists")
        return False

    try:
        root = Page.get_root_nodes()[0]
        blog_index = BlogIndexPage(title="Blog", slug="blog")
        root.add_child(instance=blog_index)
        # Save and publish the page
        revision = blog_index.save_revision()
        blog_index.publish(revision=revision)
        print("[OK] Created blog index page")
        return True
    except Exception as e:
        print(f"[ERROR] Error creating blog index: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("\n" + "="*60)
    print("Initializing Sugesto Blog")
    print("="*60 + "\n")

    create_admin_user()
    create_blog_index()

    print("\n" + "="*60)
    print("[OK] Initialization complete!")
    print("="*60)
    print("\nAccess Wagtail Admin at: http://localhost:8000/wagtail-admin/")
    print("API Blog endpoint: http://localhost:8000/api/blog/articles/\n")

if __name__ == '__main__':
    main()
