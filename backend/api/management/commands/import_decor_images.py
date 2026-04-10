import os
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files import File
from api.models import Decor

class Command(BaseCommand):
    help = "Import program images from static_assets/decors/ and attach to Decor objects by filename"

    def add_arguments(self, parser):
        parser.add_argument(
            "--src",
            default=os.path.join(settings.BASE_DIR, "static_assets", "decors"),
            help="Source folder with images"
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Don't actually copy files or modify DB, just show what would happen"
        )

    def handle(self, *args, **options):
        src = options["src"]
        dry_run = options["dry_run"]

        if not os.path.isdir(src):
            self.stdout.write(self.style.ERROR(f"Source folder not found: {src}"))
            return

        files = [f for f in os.listdir(src) if os.path.isfile(os.path.join(src, f))]
        if not files:
            self.stdout.write(self.style.WARNING("No files found in source folder."))
            return

        for fname in files:
            name_no_ext = os.path.splitext(fname)[0]
            lookup_name = name_no_ext.replace("_", " ").strip()
            decor = Decor.objects.filter(name__iexact=lookup_name).first()
            if not decor:
                decor = Decor.objects.filter(name__iexact=name_no_ext).first()
            if not decor:
                self.stdout.write(self.style.WARNING(f"No Decor found for file '{fname}' (tried '{lookup_name}')"))
                continue

            src_path = os.path.join(src, fname)
            self.stdout.write(f"Attaching {fname} -> Decor(id={decor.id}, name='{decor.name}')")

            if dry_run:
                continue

            dest_dir = os.path.join(settings.MEDIA_ROOT, "decors")
            os.makedirs(dest_dir, exist_ok=True)

            with open(src_path, "rb") as f:
                django_file = File(f)
                decor.image.save(fname, django_file, save=True)

        self.stdout.write(self.style.SUCCESS("Import finished."))
