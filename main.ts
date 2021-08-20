interface Client {
    phone: string;    
    name: string;
    computer: string;
    started: Date | string;
}
  
interface Invoice {
    phone: string;
    name: string;
    computer: string;
    time: number;
}
  
class DashbordFront {
    constructor(
        private $: (q: string) => HTMLInputElement,
        private dashbord = new LanHouse()
    ) {}

    add(client: Client, save = false) {
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

    stop(cells: HTMLCollection) {
        if (cells[3] instanceof HTMLElement) {
            const client = {
                phone: cells[0].textContent || "",
                name: cells[1].textContent || "",
                computer: cells[2].textContent || "",
                time:
                    new Date().valueOf() -
                    new Date(cells[3].dataset.time as string).valueOf(),
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
    public store: Client[];
    constructor() {
        this.store = localStorage.store ? JSON.parse(localStorage.store) : [];
    }

    add(client: Client) {
        this.store.push(client);
    }

    stop(bill: Invoice) {
        const finished = this.calcTime(bill.time);

        const msg = `O Cliente ${bill.name} de celular ${bill.phone} permaneceu logado por ${finished}.\n\n Deseja parar?`;

        if (!confirm(msg)) return;

        this.store = this.store.filter((client) => client.phone !== bill.phone);

        this.save();
    }

    private calcTime(mil: number) {
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
    const $ = (q: string) => {
        const elem = document.querySelector<HTMLInputElement>(q);

        if (!elem) throw new Error("Ocorreu um erro ao buscar o elemento.");

        return elem;
    };

    const dashbord = new DashbordFront($);
    dashbord.render();

    $("#send")?.addEventListener("click", () => {
        const phone = $("#phone")?.value;
        const name = $("#name")?.value;
        const computer = $("#computer")?.value;

        if (!phone || !name || !computer) {
            alert("Os campos são obrigatórios.");
            return;
        }

        const client: Client = { phone, name, computer, started: new Date().toISOString() };

        dashbord.add(client, true);

        $("#phone").value = "";
        $("#name").value = "";
        $("#computer").value = "";
    });

    $("#dashbord").addEventListener("click", ({ target }: MouseEvent | any) => {
        if (target.className === "delete") {
            dashbord.stop(target.parentElement.parentElement.cells);
            dashbord.render();
        }
    });
})();
