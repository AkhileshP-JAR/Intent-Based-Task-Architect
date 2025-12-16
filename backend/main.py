import asyncio
import uuid
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import asyncio
import random

app = FastAPI(title="AI Task Architect", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    completed: bool = False
    is_ai_generated: bool = False
    created_at: datetime = Field(default_factory=datetime.now)
    parent_prompt: Optional[str] = None


class TaskCreate(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    completed: Optional[bool] = None
    title: Optional[str] = None


class GenerateRequest(BaseModel):
    prompt: str


class TaskService:
    def __init__(self):
        self.tasks: dict[str, Task] = {}

    def get_all_tasks(self) -> list[Task]:
        return sorted(self.tasks.values(), key=lambda t: t.created_at, reverse=True)

    def create_task(self, title: str, is_ai_generated: bool = False, parent_prompt: Optional[str] = None) -> Task:
        task = Task(
            title=title,
            is_ai_generated=is_ai_generated,
            parent_prompt=parent_prompt
        )
        self.tasks[task.id] = task
        return task

    def get_task(self, task_id: str) -> Optional[Task]:
        return self.tasks.get(task_id)

    def update_task(self, task_id: str, update: TaskUpdate) -> Optional[Task]:
        task = self.tasks.get(task_id)
        if not task:
            return None
        if update.completed is not None:
            task.completed = update.completed
        if update.title is not None:
            task.title = update.title
        return task

    def delete_task(self, task_id: str) -> bool:
        if task_id in self.tasks:
            del self.tasks[task_id]
            return True
        return False

    # async def simulate_llm_breakdown(self, prompt: str) -> list[str]:
    #     await asyncio.sleep(1.5)
        
    #     prompt_lower = prompt.lower()
        
    #     keyword_mappings = {
    #         "party": ["Buy food and drinks", "Send invitations to guests", "Create playlist and set up music"],
    #         "birthday": ["Order birthday cake", "Decorate the venue", "Prepare party games and activities"],
    #         "wedding": ["Book venue and caterer", "Send wedding invitations", "Arrange flowers and decorations"],
    #         "website": ["Design wireframes and mockups", "Develop frontend and backend", "Deploy and configure hosting"],
    #         "launch": ["Prepare marketing materials", "Set up analytics tracking", "Create social media announcements"],
    #         "app": ["Define core features and MVP scope", "Build user authentication system", "Implement main functionality"],
    #         "meeting": ["Prepare agenda and materials", "Send calendar invites", "Book meeting room or set up video call"],
    #         "presentation": ["Research and gather data", "Create slides and visuals", "Practice and rehearse delivery"],
    #         "project": ["Define scope and requirements", "Create timeline and milestones", "Assign team responsibilities"],
    #         "trip": ["Book flights and accommodation", "Create itinerary and schedule", "Pack essentials and documents"],
    #         "vacation": ["Research destinations and activities", "Make reservations and bookings", "Prepare travel documents"],
    #         "move": ["Pack and label all boxes", "Hire movers or rent truck", "Update address with services"],
    #         "house": ["Get pre-approved for mortgage", "Schedule home inspections", "Negotiate and close the deal"],
    #         "event": ["Create event timeline", "Coordinate with vendors", "Prepare registration system"],
    #         "report": ["Gather data and sources", "Analyze and summarize findings", "Format and proofread document"],
    #         "study": ["Create study schedule", "Review notes and materials", "Practice with sample questions"],
    #         "exam": ["Organize study materials", "Create flashcards for key concepts", "Take practice tests"],
    #         "workout": ["Plan exercise routine", "Prepare gym bag and equipment", "Track progress and metrics"],
    #         "diet": ["Plan weekly meal prep", "Create grocery shopping list", "Track calories and macros"],
    #         "clean": ["Declutter and organize spaces", "Deep clean all surfaces", "Dispose of unwanted items"],
    #         "garden": ["Plan layout and plant selection", "Prepare soil and beds", "Set up watering schedule"],
    #         "learn": ["Find courses and resources", "Create learning schedule", "Practice with exercises"],
    #         "code": ["Set up development environment", "Write and test code", "Review and refactor"],
    #         "blog": ["Research topic and keywords", "Write draft and add images", "Edit, SEO optimize, and publish"],
    #         "video": ["Write script and storyboard", "Record and capture footage", "Edit and add effects"],
    #         "podcast": ["Plan episode topics", "Record and edit audio", "Publish and promote episode"],
    #         "interview": ["Research the company", "Prepare answers to common questions", "Plan outfit and logistics"],
    #         "hire": ["Write job description", "Screen and interview candidates", "Make offer and onboard"],
    #         "budget": ["Track current expenses", "Set spending categories and limits", "Review and adjust monthly"],
    #         "invest": ["Research investment options", "Diversify portfolio allocation", "Monitor and rebalance regularly"],
    #         "save": ["Set savings goals", "Automate transfers to savings", "Track progress monthly"],
    #         "email": ["Draft and proofread message", "Add attachments if needed", "Send and follow up"],
    #         "newsletter": ["Curate content and updates", "Design email template", "Schedule and send campaign"],
    #         "product": ["Define product requirements", "Create prototype or MVP", "Gather user feedback"],
    #         "startup": ["Validate business idea", "Build minimum viable product", "Acquire first customers"],
    #         "business": ["Create business plan", "Register and set up legally", "Develop go-to-market strategy"],
    #         "marketing": ["Define target audience", "Create content strategy", "Launch and measure campaigns"],
    #         "social": ["Plan content calendar", "Create engaging posts", "Engage with audience"],
    #     }
        
    #     for keyword, subtasks in keyword_mappings.items():
    #         if keyword in prompt_lower:
    #             return subtasks
        
    #     words = prompt_lower.split()
    #     main_action = words[0] if words else "complete"
    #     subject = " ".join(words[1:3]) if len(words) > 1 else "task"
        
    #     return [
    #         f"Research and plan: {subject}",
    #         f"Execute main steps for: {subject}",
    #         f"Review and finalize: {subject}"
    #     ]


    # This mimics an LLM API call (Latency + Deterministic Chaos)
    async def simulate_llm_breakdown(self, prompt: str):
        # Simulate "Thinking" time (Network latency)
        await asyncio.sleep(1.5) 
        
        prompt = prompt.lower()
        
        # "Few-Shot" Simulated Logic
        if "party" in prompt or "birthday" in prompt:
            return ["Order the cake 🎂", "Send invitations 📩", "Select a playlist 🎵"]
        elif "code" in prompt or "app" in prompt or "project" in prompt:
            return ["Setup Git Repo 🐙", "Design Database Schema 🗄️", "Initialize API 🚀"]
        elif "food" in prompt or "dinner" in prompt:
            return ["Buy Groceries 🥦", "Pre-heat Oven 🔥", "Chop Vegetables 🔪"]
        elif "travel" in prompt or "trip" in prompt:
            return ["Book Flights ✈️", "Reserve Hotel 🏨", "Pack Suitcase 🧳"]
        
        # Fallback "Hallucination"
        return [f"Research: {prompt}", f"Draft outline for {prompt}", "Review final draft"]

task_service = TaskService()


def get_task_service() -> TaskService:
    return task_service


@app.get("/tasks", response_model=list[Task])
async def get_tasks(service: TaskService = Depends(get_task_service)):
    return service.get_all_tasks()


@app.post("/tasks", response_model=Task)
async def create_task(task_data: TaskCreate, service: TaskService = Depends(get_task_service)):
    return service.create_task(title=task_data.title)


@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, update: TaskUpdate, service: TaskService = Depends(get_task_service)):
    task = service.update_task(task_id, update)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str, service: TaskService = Depends(get_task_service)):
    if not service.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}


@app.post("/tasks/generate", response_model=list[Task])
async def generate_tasks(request: GenerateRequest, service: TaskService = Depends(get_task_service)):
    subtasks = await service.simulate_llm_breakdown(request.prompt)
    created_tasks = []
    for title in subtasks:
        task = service.create_task(
            title=title,
            is_ai_generated=True,
            parent_prompt=request.prompt
        )
        created_tasks.append(task)
    return created_tasks


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
