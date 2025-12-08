function loadComponent(id, file) {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            initMenuToggle();
        })
        .catch(err => console.error(err));
}
