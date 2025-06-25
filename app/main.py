from enum import Enum
from pydantic import BaseModel
from utils.ai_client import ask_ai
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi import FastAPI, Request, Form, Query, Cookie

app = FastAPI()

# Define Template
templates = Jinja2Templates(directory="app/templates") # Jinja - Templating Engine to render dynamic HTML
### This tells FastAPI where to find your .html files.
### You’ll use this templates object to render HTML with dynamic content (e.g., user's name, errors, etc.)

# Define Styles
app.mount("/static", StaticFiles(directory="app/static"), name="static")
### This mounts the app/static folder to serve CSS, JS, images, etc.
### So a file at app/static/style.css becomes available at: http://localhost:8000/static/style.css

@app.get("/")
async def root():
    return RedirectResponse(url="/login") # Visiting / automatically sends users to /login
### You're not rendering a Jinja2 template here, so we don't need to have `request: Request`
### You only need to pass `request: Request` when:
### * You're rendering an HTML template (TemplateResponse)
### * You want access to query parameters, headers, cookies, etc., in your route

@app.get("/login")
async def login(request: Request, theme: str=Cookie(default="light")):
    return templates.TemplateResponse("login.html", {
        "request": request,
        "theme": theme
    })
    
## FastAPI’s template system (Jinja2) needs the request object to do certain things inside the HTML.
## 🧠 What is Request?
### Request is an object that represents everything about the HTTP request a user made.
### This lets you use features like request.query_params, request.url_for(...), or request.cookies inside the HTML template.
### It includes:
### * The browser’s headers
### * Cookies
### * URL info
### * Method (GET, POST)
### * Query parameters
### * Form data (in POST)
### * …and more
### So when someone goes to http://localhost:8000/login, FastAPI creates a Request object describing that exact browser visit.

class Language(str, Enum):
    ru = "Russian"
    en = "English"
    tk = "Turkmen"

@app.post("/login")
async def login(
    first_name: str = Form(...),
    last_name: str = Form(...),
    language: str = Form(...),
):
    print(f"First Name: {first_name}")
    print(f"Last Name: {last_name}")
    print(f"Preferred Language: {Language[language].value}")
    return RedirectResponse(url=f"/chat?first_name={first_name}&last_name={last_name}&language={Language[language].value}", status_code=303)

### status_code=303 means "See Other" - it tells the browser to go to a different URL after the POST request.
### This is useful for redirecting users to a new page after they submit a form.
### Think of Form(...) like input() for HTML forms.


@app.get("/chat")
async def chat(
    request: Request,
    theme: str = Cookie(default="light"),
    first_name: str = Query("Anonymous", title="First Name"),
    last_name: str = Query("User", title="Last Name"),
    language: str = Query("English", title="Preferred Language"),
):
    return templates.TemplateResponse("chat.html", {
        "request": request,
        "user_name": (first_name + " " + last_name).strip(),
        "language": language,
        "theme": theme
    })

class Message(BaseModel):
    message: str
    user_name: str
    language: str

@app.post("/chat/message")
async def chat_message(message: Message):
    response = await ask_ai(
        message=message.message,
        user_name=message.user_name,
        language=message.language
    )
    return {
        "response": response,
    }