TEST_DATA_2 = {
  "inputs": [
    ["red 1 yellow 2 black 3 white 4"],
    ["1 red 2 white 3 violet 4 green"],
    ["1 1 2 2 3 3 4 4"],
    ["#@&fhds 123F3f 2vn2# 2%y6D @%fd3 @!#4fs W@R^g WE56h%"],
    [""]
  ],
  "outputs": [
    ["[{name : 'red', id : '1'}, {name : 'yellow', id : '2'}, {name : 'black', id : '3'}, {name : 'white', id : '4'}]"],
    ["[{name : '1', id : 'red'}, {name : '2', id : 'white'}, {name : '3', id : 'violet'}, {name : '4', id : 'green'}]"],
    ["[{name : '1', id : '1'}, {name : '2', id : '2'}, {name : '3', id : '3'}, {name : '4', id : '4'}]"],
    ["[{name : '#@&fhds', id : '123F3f'}, {name : '2vn2#', id : '2%y6D'}, {name : '@%fd3', id : '@!#4fs'}, {name : 'W@R^g', id : 'WE56h%'}]"],
    ["[]"]
  ]
}

SOLUTION_CODE_2 = (
  "import sys, json\n\ndef process_string(s):\n    # Split the input string by whitespace\n    tokens = s.split()\n    # Group tokens into pairs (name, id)\n    pairs = [(tokens[i], tokens[i+1]) for i in range(0, len(tokens) - 1, 2)]\n    # Build an array of object strings\n    objs = []\n    for name, id_val in pairs:\n        objs.append(\"{name : '\" + name + \"', id : '\" + id_val + \"'}\")\n    return \"[\" + \", \".join(objs) + \"]\"\n\ndef main():\n    # Read the full input from stdin\n    data = sys.stdin.read()\n    # Try to parse the input as JSON, else just strip it\n    try:\n        s = json.loads(data)\n        if not isinstance(s, str):\n            s = str(s)\n    except Exception:\n        s = data.strip()\n    result = process_string(s)\n    # Print the result as a JSON string so that quotes and escapes are preserved\n    print(json.dumps(result))\n\nif __name__ == '__main__':\n    main()\n"
)
