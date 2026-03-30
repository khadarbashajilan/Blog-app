from sqlalchemy import inspect
from blog.database import engine

inspector = inspect(engine)
print(inspector.get_table_names())