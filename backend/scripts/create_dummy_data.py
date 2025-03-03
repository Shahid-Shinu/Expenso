import os
import psycopg2
import bcrypt
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv
from pathlib import Path
import argparse
import uuid


parser = argparse.ArgumentParser(description="Load environment variables from a .env file")
parser.add_argument('--env_file', type=str, help=".env file", required=True)

args = parser.parse_args()
dotenv_file = '.env'

dotenv_path = Path(__file__).parent.parent / dotenv_file
load_dotenv(dotenv_path=dotenv_path)
print(dotenv_path)


DATABASE_URL = os.getenv("DATABASE_URL")
DUMMY_USERNAME = os.getenv("DUMMY_USERNAME")
DUMMY_PASSWORD = os.getenv("DUMMY_PASSWORD")

category_names = {
    'Food': ['Lunch', 'Dinner', 'Snacks', 'Coffee', 'Groceries'],
    'Transport': ['Cab Ride', 'Bus Ticket', 'Fuel', 'Train Ticket', 'Flight Ticket'],
    'Entertainment': ['Movie Night', 'Concert Ticket', 'Video Game Purchase', 'Netflix Subscription', 'Sports Event'],
    'Bills': ['Monthly Rent Payment', 'Electricity Bill', 'Maintenance Fee', 'Wifi', 'Utility', 'House Helper'],
    'Shopping': ['Clothing Purchase', 'Online Purchase', 'Electronics', 'Books', 'Home Decor'],
    'Other': ['Birthday Celebration', 'Gift', 'Gym', 'Miscellaneous']
}

def hash_password(password):
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode(), salt).decode()

def create_dummy_user():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        hashed_password = hash_password(DUMMY_PASSWORD)

        # Check if dummy user exists
        cur.execute('SELECT id FROM "User" WHERE username = %s', (DUMMY_USERNAME,))
        user = cur.fetchone()

        if not user:
            print("Creating Dummy User...")
            user_id = str(uuid.uuid4())
            cur.execute(
                'INSERT INTO "User" (id, username, password) VALUES (%s, %s, %s) RETURNING id',
                (user_id, DUMMY_USERNAME, hashed_password)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
        else:
            print("Dummy User already exists")
            user_id = user[0]

        # Delete old expenses if any
        print("Deleting Old Expenses")
        cur.execute('DELETE FROM "Expense" WHERE "userId" = %s', (user_id,))
        conn.commit()

        # Generate dummy expenses for last one year
        print("Generating Dummy Expenses...")
        categories = ['Food', 'Transport', 'Entertainment', 'Rent', 'Shopping']

        for _ in range(3650):
            amount = round(random.uniform(50, 5000), 2)
            category = random.choice(list(category_names.keys()))
            name = random.choice(category_names[category])
            date = datetime.now() - timedelta(days=random.randint(0, 365))

            cur.execute(
                'INSERT INTO "Expense" (id, "userId", amount, category, "createdAt", name) VALUES (%s, %s, %s, %s, %s, %s)',
                (str(uuid.uuid4()), user_id, amount, category, date, name)
            )

        conn.commit()
        print("Dummy User and Expenses created successfully")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    create_dummy_user()
