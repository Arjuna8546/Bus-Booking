from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, phone, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        if not phone:
            raise ValueError("The Phone field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, phone=phone, **extra_fields)
        if password:  # Ensure password is set
            user.set_password(password)  # Hash the password properly
        else:
            raise ValueError("The Password field must be set")
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, phone, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    def __str__(self):
        return self.email

class Bus(models.Model):
    bus_name = models.CharField(max_length=255)
    start_stop = models.CharField(max_length=255)
    destination_stop = models.CharField(max_length=255)
    start_time = models.TimeField()
    reach_time = models.TimeField()
    owner_name = models.CharField(max_length=255)
    owner_phone = models.CharField(max_length=15)
    owner_upi = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.bus_name} ({self.start_stop} ➝ {self.destination_stop})"