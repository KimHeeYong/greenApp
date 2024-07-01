from rest_framework.response import Response
from rest_framework.decorators import api_view
import math

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

@api_view(['GET'])
def spirograph_patterns(request):
    R = int(request.GET.get('R', 80))
    r = int(request.GET.get('r', 36))
    O = int(request.GET.get('O', 45))

    points = []
    for t in range(0, 360 * r // gcd(r, R)):
        theta = math.radians(t)
        x = (R - r) * math.cos(theta) + O * math.cos((R - r) * theta / r)
        y = (R - r) * math.sin(theta) - O * math.sin((R - r) * theta / r)
        points.append((x, y))

    return Response({"points": points})
