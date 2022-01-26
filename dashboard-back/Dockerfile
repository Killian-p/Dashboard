FROM python:3.9-bullseye

WORKDIR /app

# -> Environment variables
ENV PYTHONUNBUFFERED=1

# -> Update base image
RUN apt-get update --yes -qq --option Acquire::Retries=5 > /dev/null && \
    apt-get install --yes -qq --option Acquire::Retries=5 > /dev/null && \
    apt-get autoclean --yes -qq > /dev/null && \
    apt-get autoremove --yes -qq > /dev/null

# -> Install prerequisites
RUN python -m pip install --upgrade pip setuptools wheel

# -> Install requirements
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt  

# -> Copy sources
COPY . .

EXPOSE 8080
CMD ["python", "manage.py", "runserver", "0:8080"]
