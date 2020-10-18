import os

from backend import app as application

if __name__ == "__main__":
    application.launch_cleanup()
    application.run(port=int(os.environ.get('PORT')))
