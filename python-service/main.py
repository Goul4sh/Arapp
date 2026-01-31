from typing import List

from camel_tools.tokenizers.word import simple_word_tokenize
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from camel_tools.disambig.mle import MLEDisambiguator
from contextlib import asynccontextmanager

models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Ładowanie modeli CAMeL Tools...")
    try:
        models["mle"] = MLEDisambiguator.pretrained('calima-msa-r13')
        print("Modele załadowane pomyślnie")
    except Exception as e:
        print(f"Błąd ładowania modelu: {e}")
    yield
    print("Zamykanie serwera")
    models.clear()

app = FastAPI(lifespan=lifespan)

PRONOUNS = {
    "أنا", "أنت", "أنتِ", "هو", "هي",
    "نحن", "أنتم", "أنتن", "هم", "هن"
}


class TextRequest(BaseModel):
    text: str


class LemmaResponse(BaseModel):
    original: str
    lemma: str
    root: str
    pos: str
    diacritized: str
    startIndex: int
    endIndex: int


@app.post("/analyze-text", response_model=List[LemmaResponse])
async def analyze_text(req: TextRequest):
    if "mle" not in models:
        raise HTTPException(status_code=503, detail="Service initializing")

    text = req.text.strip()
    if not text:
        return []

    print("Uwaga na tym bede pracowac: " + text)
    words = simple_word_tokenize(text)

    mle = models["mle"]

    # Analiza słów w tekście
    disambiguated_result = mle.disambiguate(words)

    if not disambiguated_result:
        raise HTTPException(status_code=404, detail="Analysis failed")

    results = []

    word_index_cursor = 0

    # Przetwarzanie wyników analizy
    for i, word in enumerate(disambiguated_result):
        original = words[i]

        # Szukanie pozycji słowa w tekście
        start_idx = text.find(original, word_index_cursor)
        end_id = start_idx + len(original)
        word_index_cursor = end_id

        lemma = original
        root = ""
        pos = "unknown"
        diacritized = original

        if original in PRONOUNS:
            results.append(LemmaResponse(
                original=original,
                lemma=original,
                root="",
                pos="pron",
                diacritized=original,
                startIndex=start_idx,
                endIndex=end_id
            ))
            continue

        if word and hasattr(word, 'analyses') and len(word.analyses) > 0:

            best_match = next(
                (a for a in word.analyses if a.analysis.get('root')),
                word.analyses[0]
            )
            data = best_match.analysis

            raw_lemma = data.get('lex', original)
            lemma = raw_lemma.split('_')[0]

            root = data.get('root', 'unknown')
            if '#' in root:
                root = ""

            pos = data.get('pos', 'unknown')
            diacritized = data.get('diac', original)

        print("Indeksy słowa:", start_idx, end_id)

        results.append(LemmaResponse(
            original=original,
            lemma=lemma,
            root=root,
            pos=pos,
            diacritized=diacritized,
            startIndex=start_idx,
            endIndex=end_id
        ))

    return results
