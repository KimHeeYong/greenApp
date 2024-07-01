from rest_framework.response import Response
from rest_framework.decorators import api_view
import math

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def generate_default_pattern(R, r, O):
    points = []
    for t in range(0, 360 * r // gcd(r, R)):
        theta = math.radians(t)
        x = (R - r) * math.cos(theta) + O * math.cos((R - r) * theta / r)
        y = (R - r) * math.sin(theta) - O * math.sin((R - r) * theta / r)
        points.append((x, y))
    return points

def generate_square_pattern(R, r, O):
    points = []
    for t in range(0, 360 * r // gcd(r, R)):
        theta = math.radians(t)
        x = (R - r) * math.cos(theta) + O * math.cos((R - r) * theta / r)
        y = (R - r) * math.sin(theta) - O * math.sin((R - r) * theta / r)
        if t % 90 < 45:
            points.append((x, y))
        else:
            points.append((y, x))
    return points

def generate_triangle_pattern(R, r, O):
    points = []
    for t in range(0, 360 * r // gcd(r, R)):
        theta = math.radians(t)
        x = (R - r) * math.cos(theta) + O * math.cos((R - r) * theta / r)
        y = (R - r) * math.sin(theta) - O * math.sin((R - r) * theta / r)
        if t % 120 < 60:
            points.append((x, y))
        else:
            points.append((y, x))
    return points

def generate_star_pattern(R, r, O):
    points = []
    for t in range(0, 360 * r // gcd(r, R)):
        theta = math.radians(t)
        x = (R - r) * math.cos(theta) + O * math.cos((R - r) * theta / r)
        y = (R - r) * math.sin(theta) - O * math.sin((R - r) * theta / r)
        if t % 144 < 72:
            points.append((x, y))
        else:
            points.append((y, x))
    return points

@api_view(['GET'])
def spirograph_patterns(request):
    R = int(request.GET.get('R', 80))
    r = int(request.GET.get('r', 36))
    O = int(request.GET.get('O', 45))
    gear_type = request.GET.get('gearType', 'default')

    if gear_type == 'square':
        points = generate_square_pattern(R, r, O)
    elif gear_type == 'triangle':
        points = generate_triangle_pattern(R, r, O)
    elif gear_type == 'star':
        points = generate_star_pattern(R, r, O)
    else:
        points = generate_default_pattern(R, r, O)

    return Response({"points": points})
