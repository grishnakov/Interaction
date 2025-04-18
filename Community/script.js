function getScore() {
    const form = document.forms["form"];
    const quest = form.elements["quiz"];

    let score = 0;

    for (let item of quest) {
        if (item.checked) score += 1;
    }

    return score;
}

function getTotal() {
    const totalScore = getScore();
    document.getElementById("result").innerHTML = getComment(totalScore);
}
