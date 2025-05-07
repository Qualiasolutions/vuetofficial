"""Code-related utils"""
import math
import os
from random import random


def generate_code():
    """Generate a 6-digit code"""
    if os.getenv("ENV") == "LOCAL":
        return "123456"

    code = str(math.floor(random() * 1e6))
    return ("000000" + code)[-6:]
