function togglePassword(id, iconId){
    let input = document.getElementById(id);
    let icon = document.getElementById(iconId);

    if(input.type === "password"){
        input.type = "text";
        icon.style.color = "#36ff7c";
    } else {
        input.type = "password";
        icon.style.color = "#00eaff";
    }
}

