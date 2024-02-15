import requests
import json

def main(args):
    
    input = args.get('text', '')

    url = args.get('SLACK_URL')
    headers = {'Content-type': 'application/json'}
    payload = {'text': input}

    response = requests.post(url, headers=headers, data=json.dumps(payload))
    if response.status_code == 200:
        return {
            'body': {
            'output': 'ok'            }
        }
    else:
        print('slack url is ', args.get('SLACK_URL'))
        print(response)
        return {
            'body': {
            'output': 'ko'            
            }
        }
