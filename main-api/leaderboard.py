def format_leaderboard_entry(entry: dict, rank: int) -> dict:
    """
    Formats a single leaderboard entry for presentation.

    Args:
        entry (dict): A dictionary representing a leaderboard
        row. Expected keys include 'name' and 'score'.

        rank (int): The rank (position) of this entry.

    Returns:
        dict: A formatted dictionary with added 'rank'
        and cleaned up 'name' and 'score' values.
    """
    # You can add more formatting logic if necessary.
    return {
        "rank": rank,
        "name": entry.get("name", "Unknown"),
        "score": entry.get("score", 0),
    }


def format_leaderboard_data(raw_data: dict) -> dict:
    """
    Formats raw leaderboard data into a presentable structure with rankings.

    Args:
        raw_data (dict): The raw leaderboard data expected to
        have keys "easy" and "hard", each being a list of entries
        (dictionaries with at least 'name' and 'score').

    Returns:
        dict: A formatted leaderboard with rankings for each difficulty level.
              For example:
              {
                "easy": [ { "rank": 1, "name": "Alice", "score": 100 }, ... ],
                "hard": [ { "rank": 1, "name": "Bob", "score": 95 }, ... ]
              }
    """
    formatted_data = {}

    for category in ["easy", "hard"]:
        # Get the list for the category; default to empty list if not present
        entries = raw_data.get(category, [])
        # Optionally, sort the entries (if not already sorted).
        sorted_entries = sorted(
            entries, key=lambda x: x.get("score", 0), reverse=True
        )
        # Format each entry by adding its rank (starting at 1)
        formatted_entries = [
            format_leaderboard_entry(entry, rank=index + 1)
            for index, entry in enumerate(sorted_entries)
        ]
        formatted_data[category] = formatted_entries

    return formatted_data
