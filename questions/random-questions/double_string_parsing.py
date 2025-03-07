import json


def remove_extra_string_layers(row: dict) -> dict:
    """
    Given a dictionary with 'inputs' and 'outputs' keys, both stored as text,
    parse them as JSON, strip any extra quotes from strings, then re-serialize
    back into JSON text.
    """

    # Helper function: if a string looks like a JSON-escaped string, parse it once more.
    def strip_extra_quotes(value):
        """
        If 'value' is something like '\"abc\"', parse it as JSON to see if it
        resolves to a simpler string 'abc'. If parsing fails or doesn't yield
        a string, just return 'value' unchanged.
        """
        if not isinstance(value, str):
            return value

        try:
            parsed = json.loads(value)
            # Only replace if the parsed result is actually a string.
            if isinstance(parsed, str):
                return parsed
        except (json.JSONDecodeError, TypeError):
            pass

        return value

    def recursively_strip(obj):
        """
        Recursively walk lists/dicts/strings to apply `strip_extra_quotes`
        to every string found.
        """
        if isinstance(obj, list):
            return [recursively_strip(x) for x in obj]
        elif isinstance(obj, dict):
            return {k: recursively_strip(v) for k, v in obj.items()}
        elif isinstance(obj, str):
            return strip_extra_quotes(obj)
        else:
            return obj

    # 1. Parse the "inputs" and "outputs" from JSON text to Python objects.
    parsed_inputs = json.loads(row["inputs"])
    parsed_outputs = json.loads(row["outputs"])

    # 2. Recursively strip extra quotes from the parsed objects.
    fixed_inputs = recursively_strip(parsed_inputs)
    fixed_outputs = recursively_strip(parsed_outputs)

    # 3. Re-serialize the cleaned objects back to JSON text.
    row["inputs"] = json.dumps(fixed_inputs)
    row["outputs"] = json.dumps(fixed_outputs)

    return row
