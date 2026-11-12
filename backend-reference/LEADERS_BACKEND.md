# Leaders: admin-entered, never hard-coded

The frontend contains NO leader names. It only knows the section order and position titles
(`src/data/leadershipStructure.js`, taken from the 2026/2027 TNC list). Names, phones and photos
are typed by the admin in the Django admin panel.

## Setup
1. Add the model + admin below to a `leaders` app, run `makemigrations && migrate`.
2. `python manage.py loaddata backend-reference/leaders_seed.json` creates the 29 empty seats
   (position, section, level, order already filled; name/phone blank, unpublished).
3. In Django admin > Leaders, type each person's name (and phone/photo), tick **Is published**.
4. Set `VITE_API_URL` in the frontend; `GET /leaders/` then returns only published leaders.

## models.py
```python
from django.db import models

class Leader(models.Model):
    LEVELS = [("head", "Head"), ("deputy", "Deputy"), ("member", "Member")]
    section = models.CharField(max_length=40)            # e.g. executive, music, deacons
    position = models.CharField(max_length=120)          # e.g. Chairperson
    level = models.CharField(max_length=10, choices=LEVELS, default="member")
    order = models.PositiveIntegerField(default=0)       # display order inside the page
    name = models.CharField(max_length=120, blank=True)  # filled by admin
    phone = models.CharField(max_length=30, blank=True)  # shown publicly only if filled
    email = models.EmailField(blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="leaders/", blank=True, null=True)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.position}: {self.name or '(empty)'}"
```

## admin.py
```python
from django.contrib import admin
from .models import Leader

@admin.register(Leader)
class LeaderAdmin(admin.ModelAdmin):
    list_display = ("position", "name", "phone", "section", "order", "is_published")
    list_editable = ("name", "phone", "is_published", "order")
    list_filter = ("section", "level", "is_published")
    search_fields = ("name", "position")
```

## views / serializer (DRF)
```python
class LeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leader
        fields = ["id", "name", "position", "section", "level", "order", "phone", "email", "bio", "photo"]

class LeaderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeaderSerializer
    queryset = Leader.objects.filter(is_published=True).exclude(name="").order_by("order")
```
Only admins/staff may edit; the public endpoint is read-only.

## Ministries (the Ministries page + each ministry page)
A ministry's `slug` equals the leader `section` key (communication, youth, spiritual-evangelism,
education, medical-missionary, religious-liberty, projects, possibility-ministry, music, deacons).
Add a small admin-editable `Ministry` model and serve it at `GET /departments/`:
```python
class Ministry(models.Model):
    slug = models.SlugField(unique=True)          # = Leader.section
    name = models.CharField(max_length=120)
    icon = models.CharField(max_length=8, blank=True)
    short = models.CharField(max_length=80, blank=True)
    description = models.TextField()
    mission = models.CharField(max_length=240, blank=True)
    order = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ["order"]
```
The frontend shows the ministry text and, automatically, the leader(s) whose `section` matches
and whose `level` is `head` as "the leader guiding it".

## Privacy note
Phone numbers appear on the public site only when the admin fills the `phone` field. Leave it blank
for anyone who does not want their number shown.
