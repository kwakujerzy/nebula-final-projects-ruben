from flask import Flask, request, jsonify
import uuid  # You can use this to generate a unique ID
from flask_cors import CORS
import boto3
from boto3.dynamodb.conditions import Attr

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app)

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # Specify your AWS region

# Connect to the tables
student_table = dynamodb.Table('students')      # Table for students
cohort_table = dynamodb.Table('CohortTable')    # Table for cohorts
attendance_table = dynamodb.Table('Attendance') # Table for attendance
assignment_table = dynamodb.Table('Assignments')# Table for assignments

### Student Routes
# [Existing Student Routes Here...]
# (Omitted for brevity, include your existing student routes)

### Cohort Routes

# Create a new cohort
@app.route('/cohorts', methods=['POST'])
def create_cohort():
    try:
        data = request.json
        required_fields = ['CohortID', 'Name', 'Description']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        cohort_table.put_item(Item={
            'CohortID': data['CohortID'],
            'Name': data['Name'],
            'Description': data['Description']
        })
        return jsonify(data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Update an existing cohort
@app.route('/cohort/<cohort_id>', methods=['PUT'])
def update_cohort(cohort_id):
    try:
        data = request.json

        # Validate if CohortID matches the route parameter
        if data.get('CohortID') != cohort_id:
            return jsonify({'error': 'CohortID mismatch'}), 400

        update_expression = []
        expression_attribute_names = {}
        expression_attribute_values = {}

        if 'Name' in data:
            update_expression.append('#n = :n')
            expression_attribute_names['#n'] = 'Name'
            expression_attribute_values[':n'] = data['Name']
        if 'Description' in data:
            update_expression.append('#d = :d')
            expression_attribute_names['#d'] = 'Description'
            expression_attribute_values[':d'] = data['Description']
        if 'StudentID' in data:
            update_expression.append('#s = :s')
            expression_attribute_names['#s'] = 'StudentID'
            expression_attribute_values[':s'] = data['StudentID']

        if not update_expression:
            return jsonify({'error': 'No fields to update'}), 400

        update_expr = 'SET ' + ', '.join(update_expression)

        response = cohort_table.update_item(
            Key={'CohortID': cohort_id},
            UpdateExpression=update_expr,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues='UPDATED_NEW'
        )

        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            return jsonify(data)
        else:
            return jsonify({'error': 'Cohort not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete a cohort by CohortID
@app.route('/cohort/<cohort_id>', methods=['DELETE'])
def delete_cohort(cohort_id):
    try:
        cohort_table.delete_item(Key={'CohortID': cohort_id})
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get a single cohort by CohortID
@app.route('/cohort/<cohort_id>', methods=['GET'])
def get_cohort(cohort_id):
    try:
        response = cohort_table.get_item(Key={'CohortID': cohort_id})
        cohort = response.get('Item')
        if cohort:
            return jsonify(cohort)
        else:
            return jsonify({'error': 'Cohort not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get all cohorts
@app.route('/cohorts', methods=['GET'])
def get_all_cohorts():
    try:
        response = cohort_table.scan()
        cohorts = response.get('Items', [])
        return jsonify(cohorts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

### Attendance Routes
# Create a new attendance record
@app.route('/attendance/<attendance_id>', methods=['GET'])
def get_attendance(attendance_id):
    """
    Fetch an attendance record by its ID.

    Args:
        attendance_id (str): The ID of the attendance record to fetch.

    Returns:
        JSON response: Contains the attendance record or an error message.
    """
    try:
        # Attempt to retrieve the attendance record from the database
        attendance_record = attendance_table.get_item(Key={'attendanceId': attendance_id})
        
        # Check if the record exists in the response
        if 'Item' in attendance_record:
            # Return the attendance record with a 200 OK status
            return jsonify(attendance_record['Item']), 200
        else:
            # Return a 404 Not Found status if the record does not exist
            return jsonify({'error': 'Attendance record not found'}), 404
    except Exception as e:
        # Return a 500 Internal Server Error status with the error message
        return jsonify({'error': str(e)}), 500


# Create a new attendance record
@app.route('/attendance', methods=['POST'])
def create_attendance():
    try:
        data = request.json
        required_fields = ['studentId', 'date', 'status']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Verify that the student exists
        response = student_table.get_item(Key={'StudentID': data['studentId']})
        if 'Item' not in response:
            return jsonify({'error': 'Student not found'}), 404

        # Generate a new attendance ID
        attendance_id = str(uuid.uuid4())

        # Insert attendance record
        attendance_table.put_item(Item={
            'attendanceId': attendance_id,
            'studentId': data['studentId'],
            'date': data['date'],
            'status': data['status']
        })
        return jsonify({'attendanceId': attendance_id, 'studentId': data['studentId'], 'date': data['date'], 'status': data['status']}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Get all attendance records for a specific student
@app.route('/attendance', methods=['GET'])
def get_all_attendance():
    try:
        student_name = request.args.get('studentName')  # Get studentName from query parameters
        last_evaluated_key = None
        all_records = []

        while True:
            scan_kwargs = {}
            if last_evaluated_key:
                scan_kwargs['ExclusiveStartKey'] = last_evaluated_key

            # Scan with filter expression if student_name is provided
            if student_name:
                scan_kwargs['FilterExpression'] = 'studentName = :name'
                scan_kwargs['ExpressionAttributeValues'] = {':name': student_name}

            response = attendance_table.scan(**scan_kwargs)
            items = response.get('Items', [])
            all_records.extend(items)

            # Check if there's more data to fetch
            last_evaluated_key = response.get('LastEvaluatedKey')
            if not last_evaluated_key:
                break

        return jsonify(all_records)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Update an existing attendance record
@app.route('/attendance/<attendance_id>', methods=['PUT'])
def update_attendance(attendance_id):
    """
    Update an existing attendance record by its ID.

    Args:
        attendance_id (str): The ID of the attendance record to update.

    Returns:
        JSON response: Confirmation of the update or an error message.
    """
    try:
        # Log incoming request data
        data = request.json
        print("Incoming data:", data)

        update_expression = []
        expression_attribute_values = {}
        expression_attribute_names = {}

        # Build the update expression and values
        if 'studentId' in data:
            update_expression.append('studentId = :s')
            expression_attribute_values[':s'] = data['studentId']
        if 'date' in data:
            update_expression.append('#d = :d')
            expression_attribute_values[':d'] = data['date']
            expression_attribute_names['#d'] = 'date'  # Map to reserved keyword
        if 'status' in data:
            update_expression.append('#st = :st')  # Use placeholder for status
            expression_attribute_values[':st'] = data['status']
            expression_attribute_names['#st'] = 'status'  # Map to reserved keyword

        if not update_expression:
            return jsonify({'error': 'No fields to update'}), 400

        update_expr = 'SET ' + ', '.join(update_expression)

        # Log the update expression and values
        print("Update expression:", update_expr)
        print("Expression attribute values:", expression_attribute_values)

        # Attempt to update the item in the database
        attendance_table.update_item(
            Key={'attendanceId': attendance_id},
            UpdateExpression=update_expr,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names,  # Add this line
            ReturnValues='UPDATED_NEW'
        )
        
        return jsonify({'message': 'Attendance record updated successfully'})
    
    except Exception as e:
        print("Error occurred:", str(e))  # Log the error message
        return jsonify({'error': str(e)}), 500


### Assignments Routes

# Create a new assignmen
@app.route('/assignments', methods=['POST'])
def create_assignment():
    try:
        data = request.json
        print("Received data:", data)  # Log the received data

        required_fields = ['assignmentId', 'studentId', 'assignmentName', 'completionStatus', 'dueDate']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Verify that the student exists
        response = student_table.get_item(Key={'StudentID': data['studentId']})
        print("Student lookup response:", response)  # Log the response from DynamoDB

        if 'Item' not in response:
            return jsonify({'error': 'Student not found'}), 404

        # Convert assignmentId to string to match DynamoDB's expected type
        assignment_id_str = str(data['assignmentId'])

        # Insert assignment record into DynamoDB
        assignment_table.put_item(Item={
            'assignmentId': assignment_id_str,  # Convert to string
            'studentId': data['studentId'],
            'assignmentName': data['assignmentName'],
            'completionStatus': data['completionStatus'],
            'dueDate': data['dueDate']
        })
        print("Assignment created successfully")  # Log success message
        return jsonify(data), 201

    except Exception as e:
        print("Error creating assignment:", str(e))  # Log the error
        return jsonify({'error': str(e)}), 500


# Get all assignment records for a specific student
@app.route('/assignments/<student_id>', methods=['GET'])
def get_assignments(student_id):
    try:
        response = assignment_table.scan(
            FilterExpression=Attr('studentId').eq(student_id)
        )
        assignment_records = response.get('Items', [])
        return jsonify(assignment_records)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
# Update an existing assignment record
@app.route('/assignments/<assignment_id>', methods=['PUT'])
def update_assignment(assignment_id):
    try:
        data = request.json
        update_expression = []
        expression_attribute_values = {}

        if 'studentId' in data:
            update_expression.append('studentId = :s')
            expression_attribute_values[':s'] = data['studentId']
        if 'assignmentName' in data:
            update_expression.append('assignmentName = :an')
            expression_attribute_values[':an'] = data['assignmentName']
        if 'completionStatus' in data:
            update_expression.append('completionStatus = :cs')
            expression_attribute_values[':cs'] = data['completionStatus']
        if 'dueDate' in data:
            update_expression.append('dueDate = :d')
            expression_attribute_values[':d'] = data['dueDate']

        if not update_expression:
            return jsonify({'error': 'No fields to update'}), 400

        update_expr = 'SET ' + ', '.join(update_expression)

        assignment_table.update_item(
            Key={'assignmentId': assignment_id},
            UpdateExpression=update_expr,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues='UPDATED_NEW'
        )
        return jsonify({'message': 'Assignment record updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete an assignment record
@app.route('/assignments/<assignment_id>', methods=['DELETE'])
def delete_assignment(assignment_id):
    try:
        assignment_table.delete_item(Key={'assignmentId': assignment_id})
        return jsonify({'message': 'Assignment record deleted successfully'}), 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
    ### Student Routes

# Create a new student
@app.route('/students', methods=['POST'])
def create_student():
    try:
        data = request.json
        required_fields = ['Name', 'Email', 'CohortID']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Generate a unique StudentID
        student_id = str(uuid.uuid4())

        student_table.put_item(Item={
            'StudentID': student_id,
            'Name': data['Name'],
            'Email': data['Email'],
            'CohortID': data['CohortID']
        })
        # Return the response with the generated StudentID
        response_data = {
            'StudentID': student_id,
            'Name': data['Name'],
            'Email': data['Email'],
            'CohortID': data['CohortID']
        }
        return jsonify(response_data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Update an existing student

@app.route('/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    try:
        data = request.json

        update_expression = []
        expression_attribute_names = {}
        expression_attribute_values = {}

        if 'Name' in data:
            update_expression.append('#n = :n')
            expression_attribute_names['#n'] = 'Name'
            expression_attribute_values[':n'] = data['Name']
        if 'Email' in data:
            update_expression.append('#e = :e')
            expression_attribute_names['#e'] = 'Email'
            expression_attribute_values[':e'] = data['Email']
        if 'CohortID' in data:
            update_expression.append('#c = :c')
            expression_attribute_names['#c'] = 'CohortID'
            expression_attribute_values[':c'] = data['CohortID']

        if not update_expression:
            return jsonify({'error': 'No fields to update'}), 400

        update_expr = 'SET ' + ', '.join(update_expression)

        response = student_table.update_item(
            Key={'StudentID': student_id},
            UpdateExpression=update_expr,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues='UPDATED_NEW'
        )

        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            return jsonify(data)
        else:
            return jsonify({'error': 'Student not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Delete a student by StudentID
@app.route('/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        student_table.delete_item(Key={'StudentID': student_id})
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get a single student by StudentID
@app.route('/students/<student_id>', methods=['GET'])
def get_student(student_id):
    try:
        response = student_table.get_item(Key={'StudentID': student_id})
        student = response.get('Item')
        if student:
            return jsonify(student)
        else:
            return jsonify({'error': 'Student not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get all students
@app.route('/students', methods=['GET'])
def get_all_students():
    try:
        response = student_table.scan()
        students = response.get('Items', [])
        return jsonify(students)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
