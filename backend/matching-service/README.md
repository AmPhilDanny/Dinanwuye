# Dinanwuye Matching Service

Python/FastAPI matching service for Dinanwuye.

## Run

```bash
uvicorn main:app --reload --port 8000
```

## Tests

```bash
pytest
```

## Phase 1 (current)

- Heuristic compatibility scoring (`app/services/ranking.py`)
- Discovery deck with exclusions + swipe dedupe + cursor pagination (`app/services/deck.py`)
- Swipe recording with mutual-like match creation and daily/superlike limits
- Match list / detail / unmatch
- JWT auth validated against the shared JWT secret
- Falls back to deterministic mock candidates when the profile service is unreachable

## Phase 2 (planned)

- LightGBM ranker + pgvector embeddings (replace `app/services/ranking.py`)
- Redis-backed deck caching
- Batch embedding generation for retraining
