function loadComponent(id, file) {
    fetch(file)
        .then(res => {
            if (!res.ok) throw new Error("Nie znaleziono komponentu: " + file);
            return res.text();
        })
        .then(data => document.getElementById(id).innerHTML = data)
        .catch(err => console.error(err));
}
