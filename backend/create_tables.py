import boto3

# Initialize a session using Amazon DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Define the tables
def create_tables():
    # Create Attendance table
    try:
        table = dynamodb.create_table(
            TableName='Attendance',
            KeySchema=[
                {
                    'AttributeName': 'attendanceId',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'attendanceId',
                    'AttributeType': 'S'  # String type
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        print("Creating Attendance table...")
        table.meta.client.get_waiter('table_exists').wait(TableName='Attendance')
        print("Attendance table created successfully!")
    except Exception as e:
        print(f"Error creating Attendance table: {e}")

    # Create Assignments table
    try:
        table = dynamodb.create_table(
            TableName='Assignments',
            KeySchema=[
                {
                    'AttributeName': 'assignmentId',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'assignmentId',
                    'AttributeType': 'S'  # String type
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        print("Creating Assignments table...")
        table.meta.client.get_waiter('table_exists').wait(TableName='Assignments')
        print("Assignments table created successfully!")
    except Exception as e:
        print(f"Error creating Assignments table: {e}")

if __name__ == "__main__":
    create_tables()
