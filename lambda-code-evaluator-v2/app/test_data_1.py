# ------------------------------
# Test Data (as provided)
# ------------------------------
TEST_DATA_1 = {
    "inputs": [
        [[1, 2, 3], [1, 2, 3]],
        [[1, 2, 3], [4, 5, 6]],
        [[1, 2, 4, 6, 7], [2, 3, 4, 7]],
        [[1, 2, 6, 8, 9], [0, 1, 4, 5, 6, 8, 9]],
        [
            [0, 1, 3, 4, 5, 6, 9, 14, 15, 16, 17, 18, 19],
            [1, 4, 10, 12, 13, 14, 15, 16],
        ],
    ],
    "outputs": [1, 0, 0.5, 0.5, 0.3125],
}

# ------------------------------
# Sample solution code (as provided)
# ------------------------------
SOLUTION_CODE_1 = (
    "class Solution:\n"
    "    def evaluate(self, a, b):\n"
    "        print('HELLO', a)\n"
    "        set_a = set(a)\n"
    "        set_b = set(b)\n"
    "        intersection = set_a.intersection(set_b)\n"
    "        union = set_a.union(set_b)\n"
    "        return len(intersection) / len(union)\n"
)
