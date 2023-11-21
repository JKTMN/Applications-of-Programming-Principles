from flask import Flask, jsonify, render_template, request
import json
import uuid


app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'
)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')



@app.route('/submit-form', methods=['PUT']) #sets the route using the PUT method
def submit_form():

    task_data = request.get_json() #sets a dictionary based on the request from the js containing the task details

    task_name = task_data.get('taskName') #sets a dictionary based on the data from the task_data variable
    task_description = task_data.get('taskDescription') #which contains the corrsesponding value
    due_date = task_data.get('dueDate') #it uses the .get method
    priority_level = task_data.get('priorityLevel')

    task_id = str(uuid.uuid4()) #generates a unique ID using UUID

    try:
        with open('tasks.json', 'r') as f: #opens the json file 
            task_data = json.load(f)
    except FileNotFoundError: #has a file not found exception
        task_data = {}


    task_data.append({ #appends the task_data dictionary to include the data and a key to locate it
        'task_id': task_id,
        'task_name': task_name, 
        'task_description': task_description, 
        'due_date': due_date, 
        'priority_level': priority_level
        })
    
    with open('tasks.json', 'w') as f: #dumps the task_data dictionary to the file
        json.dump(task_data, f, indent=5) #formats the data inside of the json file

    return 'successful' #returns successful if successful


@app.route('/get_data', methods=['GET']) #sets the route using the GET method
def get_data(): #recieves a request from the java script

    with open('tasks.json', 'r') as f: #opens the json file
        tasks = json.load(f) #sets a dictionary containing all of the task data
    
    return jsonify(tasks) #returns the tasks variable and send it to the javascript 



@app.route('/display_task', methods=['PUT']) #sets the route using the PUT method
def display_task():
    task_id = request.json['task_id'] #sets a variable to the task ID which it recieved from the javascript
    task_name = "" #sets empty variables ready for the data 
    task_description = ""
    due_date = ""
    priority_level = ""

    with open('tasks.json', 'r') as f: #opens the json file
        task_info = json.load(f) #sets the json data as a dictionary

    for task in task_info: #filters through the tasks in the dictionary and finds the taskID
        if task['task_id'] == task_id:
            task_name = task['task_name'] #once found it sets the empty variables to the corresponding task data
            task_description = task['task_description']
            due_date = task['due_date']
            priority_level = task['priority_level']
            break

    task_data = { #creates a dictionary with keys and the variables containing the data
        'task_id': task_id,
        'task_name': task_name,
        'task_description': task_description,
        'due_date': due_date,
        'priority_level': priority_level
    }
    return jsonify(task_data) #returns the dictionary to the javascript 



@app.route('/delete_task', methods=['PUT']) #sets the route using the PUT method
def delete_task(): #recieves a task ID from the javcscript
    task_id = request.json['task_id'] #sets a variable as the recieved taskID

    with open('tasks.json', 'r') as f: #opens the json file
        tasks = json.load(f) #sets the json data as a dictionary

    for i, task in enumerate(tasks): #searches for the correct task id in the dictionary
        if task['task_id'] == task_id:
            del tasks[i] #deleted the corresponding task data from the found id
            break
    with open('tasks.json', 'w') as f:
        json.dump(tasks, f) #puts the updated task data back into the json file
    return 'Task deleted successfully!', 200 #returns a success message




if __name__ == '__main__':
    app.run(debug=True)