# base layer
FROM python:3.9 AS base
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# dev layer, ./app is binded to /code/app
FROM base AS dev
CMD ["fastapi", "dev", "app/main.py", "--host", "0.0.0.0", "--port", "80"]
EXPOSE 80

# production layer - tbd