var data = { query: "SELECT * FROM testy" };

async function fetchData() {
    var response = await fetch("http://58.109.204.207:8080", {
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Random-Value-No-Actual-Use": "haha-funny-number"
        },
        body: JSON.stringify(data)
    });

    var responseData = await response.json();
    console.log(responseData);
}

fetchData();