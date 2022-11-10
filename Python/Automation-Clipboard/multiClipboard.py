# # The idea behind this application is to store multiple things within the clipboard and easily load all those things.
import sys
import clipboard
import json

# This means im going to override this file if it already exists where im going to replace with a new.
def save_items(filepath, data):
    with open(filepath, "w")


if len(sys.argv) == 2:
    command = sys.argv[1]
# The way this if statement is working is im checking if the command is equal to these different strings.
    if command == "save":
        print("save")
    elif command == "load":
        print("load")
    elif command == "list":
        print("list")
    else:
        print("unknown command")
else:
    print("Please type in a single command.")