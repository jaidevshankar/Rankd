from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.auth_simplified import router as auth_router
from utils.ranking import app as ranking_app

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

# Include routes from ranking.py (mount the entire app)
# All routes from ranking.py will be available at the root path
for route in ranking_app.routes:
    app.routes.append(route)

@app.get("/")
async def root():
    return {"message": "Welcome to the backend server"} 