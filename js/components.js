function loadComponent(id, file, callback) {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            if (id) {
                document.getElementById(id).innerHTML = data;
            }
            if (callback) callback(data);
        })
        .catch(err => console.error(`Nie udało się załadować: ${file}`, err));
}
