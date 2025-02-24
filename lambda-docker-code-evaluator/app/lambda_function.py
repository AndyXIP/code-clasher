import json

def lambda_handler(event, context):
    try:
        if 'body' in event:
            event = json.loads(event['body'])

        input_string = event.get("input")
        expected_output = event.get("expected_output")
        problem_type = event.get("problem_type")

        if not input_string or not problem_type:
            return {"statusCode": 400, "body": json.dumps("Missing input or problem type.")}

        # Call the corresponding solution based on the problem type
        if problem_type == "polycarp":
            result = execute_polycarp(input_string)
        elif problem_type == "mikhail":
            result = execute_mikhail(input_string)
        else:
            return {"statusCode": 400, "body": json.dumps("Invalid problem type.")}

        # Compare outputs
        is_correct = result.strip() == expected_output.strip()

        return {
            "statusCode": 200,
            "body": json.dumps({
                "actual_output": result,
                "expected_output": expected_output,
                "passed": is_correct
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

# ✅ Polycarp's Binary Words Problem Logic
def execute_polycarp(input_str):
    input_lines = input_str.strip().split('\n')
    index = 0
    t = int(input_lines[index])
    index += 1
    results = []

    for _ in range(t):
        n = int(input_lines[index])
        index += 1
        words = []
        for _ in range(n):
            words.append(input_lines[index])
            index += 1

        count_0_1 = 0
        count_1_0 = 0
        count_0_0 = 0
        count_1_1 = 0
        word_set = set(words)
        to_reverse = []

        for i, word in enumerate(words):
            if word[0] == '0' and word[-1] == '1':
                count_0_1 += 1
            elif word[0] == '1' and word[-1] == '0':
                count_1_0 += 1
            elif word[0] == '0' and word[-1] == '0':
                count_0_0 += 1
            else:
                count_1_1 += 1

        if count_0_1 == 0 and count_1_0 == 0:
            if count_0_0 > 0 and count_1_1 > 0:
                results.append("-1\n")
                continue
            else:
                results.append("0\n\n")
                continue

        diff = abs(count_0_1 - count_1_0) // 2

        for i, word in enumerate(words):
            if len(to_reverse) >= diff:
                break
            reversed_word = word[::-1]
            if count_0_1 > count_1_0 and word[0] == '0' and word[-1] == '1' and reversed_word not in word_set:
                to_reverse.append(str(i + 1))
            elif count_1_0 > count_0_1 and word[0] == '1' and word[-1] == '0' and reversed_word not in word_set:
                to_reverse.append(str(i + 1))

        if len(to_reverse) < diff:
            results.append("-1\n")
        else:
            result_line = f"{len(to_reverse)}\n"
            if len(to_reverse) > 0:
                result_line += " ".join(to_reverse) + " \n"
            results.append(result_line)

    return "".join(results)

# ✅ Mikhail's Movement Problem Logic
def execute_mikhail(input_str):
    input_lines = input_str.strip().split('\n')
    index = 0
    q = int(input_lines[index])  # Number of queries
    index += 1
    results = []

    for _ in range(q):
        # Properly parse n, m, k from the input line
        n, m, k = map(int, input_lines[index].strip().split())
        index += 1

        min_moves = max(n, m)  # Minimum required moves

        if min_moves > k or (k - min_moves) % 2 != 0:
            results.append("-1")
        else:
            diagonal_moves = min(n, m)
            extra_moves = k - min_moves
            results.append(str(diagonal_moves + extra_moves))

    return "\n".join(results) + "\n"
