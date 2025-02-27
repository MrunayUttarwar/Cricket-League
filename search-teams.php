<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Search</title>
</head>
<body>
    <h1>Search for a Team</h1>
    
    <form method="post" action="">
        <label for="teamName">Enter Team Name:</label>
        <input type="text" id="teamName" name="teamName" required>
        <button type="submit">Search</button>
    </form>

    <?php
        // Indexed array of 20 team names
        $teams = ["Warriors", "Titans", "Knights", "Strikers", "Royals", "Falcons", "Hurricanes",
                   "Gladiators", "Dragons", "Spartans", "Vikings", "Panthers", "Eagles", "Wolves",
                   "Rangers", "Lions", "Cobras", "Sharks", "Blazers", "Tigers"];

        // Check if form is submitted
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $searchTeam = trim($_POST["teamName"]);
            if (in_array($searchTeam, $teams)) {
                echo "<p>Team <strong>$searchTeam</strong> found!</p>";
            } else {
                echo "<p>Team <strong>$searchTeam</strong> not found.</p>";
            }
        }
    ?>
</body>
</html>

//php -S localhost:8000
//http://localhost:8000/search-teams.php