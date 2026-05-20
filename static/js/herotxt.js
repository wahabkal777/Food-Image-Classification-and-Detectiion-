const words = [ "Recognition","Preprocessing"];
let index = 0;

function changeText(){
    const textElement = document.getElementById("changing-text");
    textElement.innerHTML = words[index];
    index = (index + 1) % words.length;
}

setInterval(changeText, 1000);
