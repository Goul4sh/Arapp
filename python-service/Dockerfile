FROM python:3.12-slim
LABEL authors="goul4sh"

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN groupadd -r appuser && useradd -r -g appuser -d /app appuser -s /usr/sbin/nologin

RUN chown -R appuser:appuser /app

COPY --chown=appuser:appuser main.py .

USER appuser

RUN camel_data -i disambig-mle-calima-msa-r13

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]