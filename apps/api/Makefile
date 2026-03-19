install:
	python -m venv env && env/Scripts/pip install -r requirements.txt

dev:
	env/Scripts/uvicorn main:app --reload --port 8000

lint:
	env/bin/ruff check .

format:
	env/bin/black .