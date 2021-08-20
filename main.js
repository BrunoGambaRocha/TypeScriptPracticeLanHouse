"use strict";
class DashbordFront {
    constructor($, dashbord = new LanHouse()) {
        this.$ = $;
        this.dashbord = dashbord;
    }
    add(client, save = false) {
        this.dashbord.add(client);
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${client.phone}</td>
                    <td>${client.name}</td>
                    <td>${client.computer}</td>
                    <td data-time="${client.started}">
                        ${client.started.toLocaleString("pt-BR", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        })}
                    </td>
                    <td>
                        <button class="delete">x</button>
                    </td>
                `;
        if (save) {
            this.dashbord.save();
        }
        this.$("#dashbord").appendChild(row);
    }
    stop(cells) {
        if (cells[3] instanceof HTMLElement) {
            const client = {
                phone: cells[0].textContent || "",
                name: cells[1].textContent || "",
                computer: cells[2].textContent || "",
                time: new Date().valueOf() -
                    new Date(cells[3].dataset.time).valueOf(),
            };
            this.dashbord.stop(client);
        }
    }
    render() {
        this.$("#dashbord").innerHTML = "";
        this.dashbord.store.forEach((c) => this.add(c));
    }
}
class LanHouse {
    constructor() {
        this.store = localStorage.store ? JSON.parse(localStorage.store) : [];
    }
    add(client) {
        this.store.push(client);
    }
    stop(bill) {
        const finished = this.calcTime(bill.time);
        const msg = `O Cliente ${bill.name} de celular ${bill.phone} permaneceu logado por ${finished}.\n\n Deseja parar?`;
        if (!confirm(msg))
            return;
        this.store = this.store.filter((client) => client.phone !== bill.phone);
        this.save();
    }
    calcTime(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    save() {
        console.log("Saving...");
        localStorage.store = JSON.stringify(this.store);
    }
}
(function () {
    var _a;
    const $ = (q) => {
        const elem = document.querySelector(q);
        if (!elem)
            throw new Error("Ocorreu um erro ao buscar o elemento.");
        return elem;
    };
    const dashbord = new DashbordFront($);
    dashbord.render();
    (_a = $("#send")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b, _c;
        const phone = (_a = $("#phone")) === null || _a === void 0 ? void 0 : _a.value;
        const name = (_b = $("#name")) === null || _b === void 0 ? void 0 : _b.value;
        const computer = (_c = $("#computer")) === null || _c === void 0 ? void 0 : _c.value;
        if (!phone || !name || !computer) {
            alert("Os campos são obrigatórios.");
            return;
        }
        const client = { phone, name, computer, started: new Date().toISOString() };
        dashbord.add(client, true);
        $("#phone").value = "";
        $("#name").value = "";
        $("#computer").value = "";
    });
    $("#dashbord").addEventListener("click", ({ target }) => {
        if (target.className === "delete") {
            dashbord.stop(target.parentElement.parentElement.cells);
            dashbord.render();
        }
    });
})();
