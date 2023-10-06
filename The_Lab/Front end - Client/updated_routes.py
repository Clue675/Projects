from flask import Flask, jsonify, request
import utils  # import our utility functions

app = Flask(__name__)

@app.route('/addNewTraining', methods=['POST'])
def add_training():
    data = request.json
    title = data.get('title')
    date = data.get('date')
    names = data.get('names')
    
    utils.add_training_data_to_excel(title, date, names)
    
    return jsonify({"message": "Training data added successfully"})

@app.route('/search', methods=['GET'])
def search_training():
    query = request.args.get('query')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 50))
    start_index = (page - 1) * limit
    end_index = page * limit

    all_results = utils.search_training_data(query)  
    total = len(all_results)

    results = all_results[start_index:end_index]  # Slice the results for this page

    return jsonify({
        "message": f"Search results for query: {query}",
        "data": results,
        "total": total,  # Total number of results
        "page": page,  # Current page
        "limit": limit  # Number of results per page
    })

@app.route('/search', methods=['GET'])
def search_training():
    query = request.args.get('query')
    results = utils.read_from_excel(query)
    return jsonify({"message": f"Search results for query: {query}", "data": results})
