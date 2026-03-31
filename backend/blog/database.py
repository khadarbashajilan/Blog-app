# Import SQLAlchemy components for database operations and ORM functionality
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL for SQLite, creating a file named 'blog.db' in the current directory
SQLALCHEMY_DATABASE_URL = 'sqlite:///./blog.db'

# Create a database engine with connection arguments for SQLite and enable SQL statement logging
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True
)

# Create a base class for declarative class definitions, serving as the foundation for all database models
Base = declarative_base()

# Configure a session factory with transaction control settings and bind it to the database engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a database session generator function that handles session lifecycle
def get_db():
# Create a new database session instance
    db = SessionLocal()
    try:
        # Yield the session to be used in the route handler
        yield db
    finally:
        # Ensure the session is properly closed after use
        db.close()
