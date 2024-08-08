import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
import redis

from app.models.user import User

redis_client = None


def get_redis_client():
    global redis_client
    if redis_client is None:
        redis_client = redis.Redis.from_url(current_app.config['REDIS_URL'])
    return redis_client


def generate_token(user_id):
    payload = {
        'exp': datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

    # Store token in Redis
    redis_client = get_redis_client()
    redis_client.setex(f"token:{user_id}", int(current_app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds()), token)

    return token


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing'}), 401

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['sub'])

            # Check if token is in Redis
            redis_client = get_redis_client()
            stored_token = redis_client.get(f"token:{data['sub']}")
            if not stored_token or stored_token.decode() != token:
                return jsonify({'message': 'Token is invalid'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)

    return decorated