# Django REST Backend

This backend provides a simple API endpoint for the portfolio site.

## Development

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The root endpoint (`/`) returns a JSON message confirming the server is running.
