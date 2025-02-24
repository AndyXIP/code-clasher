# ------------------------------
# Test Data (as provided)
# ------------------------------
TEST_DATA_1 = {
    "inputs": [
        [[1, 2, 3], [1, 2, 3]],
        [[1, 2, 3], [4, 5, 6]],
        [[1, 2, 4, 6, 7], [2, 3, 4, 7]],
        [[1, 2, 6, 8, 9], [0, 1, 4, 5, 6, 8, 9]],
        [[0, 1, 3, 4, 5, 6, 9, 14, 15, 16, 17, 18, 19], [1, 4, 10, 12, 13, 14, 15, 16]]
    ],
    "outputs": [
        [1],
        [0],
        [0.5],
        [0.5],
        [0.3125]
    ]
}

# ------------------------------
# Sample solution code (as provided)
# ------------------------------
SOLUTION_CODE_1 = (
    "import sys, json\n"
    "\n"
    "def jaccard_similarity(a, b):\n"
    "    set_a = set(a)\n"
    "    set_b = set(b)\n"
    "    intersection = set_a.intersection(set_b)\n"
    "    union = set_a.union(set_b)\n"
    "    return len(intersection) / len(union)\n"
    "\n"
    "def main():\n"
    "    # Read test input from stdin, expected as JSON: a list of two arrays\n"
    "    data = sys.stdin.read()\n"
    "    try:\n"
    "        test_input = json.loads(data)\n"
    "    except Exception:\n"
    "        test_input = eval(data)  # fallback if JSON fails\n"
    "    a, b = test_input\n"
    "    result = jaccard_similarity(a, b)\n"
    "    print(json.dumps(result))\n"
    "\n"
    "if __name__ == '__main__':\n"
    "    main()\n"
)