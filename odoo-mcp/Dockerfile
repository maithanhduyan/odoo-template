FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

# stdio transport (default for VS Code / Claude Desktop)
CMD ["python", "server.py"]
