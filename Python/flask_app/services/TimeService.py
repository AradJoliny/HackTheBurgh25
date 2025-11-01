from datetime import datetime
def parse_time(data):
    if not isinstance(data, dict):
        return None

    time = data.get('time')
    if not time or not isinstance(time, str):
        return None
    try:
        valid_time = datetime.strptime(time, '%H:%M')
        return valid_time.strftime('%H:%M')
    except ValueError:
        return None