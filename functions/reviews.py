from cloudant.client import Cloudant
from cloudant.query import Query
from flask import Flask, jsonify, request
import atexit

#Add your Cloudant service credentials here
cloudant_username = '677aeeab-6b5a-496f-af72-ea60db8951e9-bluemix'
cloudant_api_key = 'MYOYP9pRR3RaIXRbITWlNo1oGLFE_JOvIt_HiMGNz88i'
cloudant_url = 'https://677aeeab-6b5a-496f-af72-ea60db8951e9-bluemix.cloudantnosqldb.appdomain.cloud'
client = Cloudant.iam(cloudant_username, cloudant_api_key, connect=True, url=cloudant_url)

session = client.session()
print('Databases:', client.all_dbs())

db = client['reviews']

app = Flask(__name__)

@app.route('/api/get_reviews', methods=['GET'])
def get_reviews():
    dealership_id = request.args.get('id')

    # Check if "id" parameter is missing
    if dealership_id is None:
        return jsonify({"error": "Missing 'id' parameter in the URL"}), 400

    # Convert the "id" parameter to an integer (assuming "id" should be an integer)
    try:
        dealership_id = int(dealership_id)
    except ValueError:
        return jsonify({"error": "'id' parameter must be an integer"}), 400

    # Define the query based on the 'dealership' ID
    selector = {
        'dealership': dealership_id
    }

    # Execute the query using the query method
    result = db.get_query_result(selector)

    # Create a list to store the documents
    data_list = []

    # Iterate through the results and add documents to the list
    for doc in result:
        data_list.append(doc)

    # Return the data as JSON
    return jsonify(data_list)


@app.route('/api/post_review', methods=['POST'])
def post_review():
    if not request.json:
        abort(400, description='Invalid JSON data')
    
    # Extract review data from the request JSON
    review_data = request.json

    # Validate that the required fields are present in the review data
    required_fields = ['id', 'name', 'dealership', 'review', 'purchase', 'purchase_date', 'car_make', 'car_model', 'car_year']
    for field in required_fields:
        if field not in review_data:
            abort(400, description=f'Missing required field: {field}')

    # Save the review data as a new document in the Cloudant database
    db.create_document(review_data)

    return jsonify({"message": "Review posted successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)








# This is the code for the IBM Cloud Function "get_dreviews". 
# The function is part of a cloud-hosted API, so this code is not really part of
# the codebase for the Django website. I am mainly leaving it here for my own reference 
# and documentation's sake, as well as for any fellow learners who are curious about the 
# API and IBM Cloud Functions. 
'''
# IBM Cloud-specific imports
from cloudant.client import Cloudant
from cloudant.error import CloudantException


# main() will be run automatically when this action is invoked in IBM Cloud
def main(dict):

    """
    Gets the car reviews for a specified dealership
    :param dict: Cloud Functions actions accept a single parameter, which must be a JSON object.
                In this case, the param must be an a JSON object with the key "dealerId" with the dealership id as value (string or int)
                I.e: {"dealerId": "15"}
    :return: The action returns a JSON object consisting of the HTTP response with all reviews for the given dealership.
    """

    secret = {
        "URL": "https://677aeeab-6b5a-496f-af72-ea60db8951e9-bluemix.cloudantnosqldb.appdomain.cloud",
        "IAM_API_KEY": "MYOYP9pRR3RaIXRbITWlNo1oGLFE_JOvIt_HiMGNz88i",
        "ACCOUNT_NAME": "677aeeab-6b5a-496f-af72-ea60db8951e9-bluemix",
    }

    client = Cloudant.iam(
        account_name=secret["ACCOUNT_NAME"],
        api_key=secret["IAM_API_KEY"],
        url=secret["URL"],
        connect=True,
    )

    my_database = client["reviews"]
    print(my_database)

    try:
        selector = {'dealership': {'$eq': int(dict["dealerId"])}}
        result_by_filter = my_database.get_query_result(
            selector, raw_result=True)

        result = {
            'headers': {'Content-Type': 'application/json'},
            'body': {'data': result_by_filter}

        }
        return result
    except:

        return {
            'statusCode': 404,
            'message': "Something went wrong"
        }
        '''