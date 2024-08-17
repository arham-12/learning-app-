from fastapi import FastAPI
from fastapi.middleware import cors
from .routers import users, search_content,chat
app = FastAPI()


app.add_middleware(
    cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(search_content.router)
app.include_router(users.router)
app.include_router(chat.router)
