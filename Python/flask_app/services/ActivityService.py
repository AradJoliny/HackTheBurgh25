def parse_categories(data):
    if not isinstance(data, dict):
        return None

    categories = data.get('categories')
    if not categories or not isinstance(categories, list):
        return None

    if all(isinstance(category,str) for category in categories):
        return categories
    return None