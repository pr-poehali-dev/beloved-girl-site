import json
import os
import boto3
import base64
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления фотографиями в галерее
    Поддерживает: GET (список фото), POST (загрузка), DELETE (удаление)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute("SELECT id, title, date, description, image_url, created_at FROM t_p9288329_beloved_girl_site.memories ORDER BY created_at DESC")
            rows = cur.fetchall()
            
            memories = []
            for row in rows:
                memories.append({
                    'id': row[0],
                    'title': row[1],
                    'date': row[2],
                    'description': row[3],
                    'image_url': row[4],
                    'created_at': row[5].isoformat() if row[5] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'memories': memories}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            title = body_data.get('title', '')
            date = body_data.get('date', '')
            description = body_data.get('description', '')
            image_base64 = body_data.get('image', '')
            
            if not all([title, date, image_base64]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            image_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
            
            s3 = boto3.client('s3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
            )
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            file_key = f'memories/{timestamp}.jpg'
            
            s3.put_object(
                Bucket='files',
                Key=file_key,
                Body=image_data,
                ContentType='image/jpeg'
            )
            
            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
            
            cur.execute(
                "INSERT INTO t_p9288329_beloved_girl_site.memories (title, date, description, image_url) VALUES (%s, %s, %s, %s) RETURNING id",
                (title, date, description, cdn_url)
            )
            memory_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': memory_id,
                    'image_url': cdn_url,
                    'message': 'Photo uploaded successfully'
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            memory_id = params.get('id')
            
            if not memory_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing memory id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("DELETE FROM t_p9288329_beloved_girl_site.memories WHERE id = %s", (memory_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Memory deleted successfully'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
