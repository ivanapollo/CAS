from fastapi import HTTPException

import uvicorn
from fastapi import FastAPI
from sqlalchemy import text
from src.api import main_router
from fastapi.middleware.cors import CORSMiddleware

from src.api.dependencies import SessionDep
from src.database import engin, Base

app = FastAPI()

#



#

@app.post("/setup_database")
async def setup_database():
    async with engin.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    return {"ок": True}

@app.post(
    "/recreate-table/{table_name}",
    summary="Пересоздание таблицы в базе данных",
    description="Пересоздает указанную таблицу в базе данных. Удаляет существующую таблицу и создает новую с текущей структурой."
)
async def recreate_table(
        table_name: str,
        session: SessionDep
):
    """API endpoint для пересоздания конкретной таблицы"""
    try:
        # Удаляем существующую таблицу
        await session.execute(text(f"DROP TABLE IF EXISTS {table_name}"))
        await session.commit()
        return {"status": "success", "message": "Таблица успешно пересоздана"}

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при пересоздании таблицы: {str(e)}"
        )
app.include_router(main_router)


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
