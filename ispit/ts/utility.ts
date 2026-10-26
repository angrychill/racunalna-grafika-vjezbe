// @ts-ignore
class Utility{
    constructor() {

    }

    static degToRad(deg : number){
       return deg * (Math.PI/180);
   }
   
    static radToDeg(rad: number){
       return rad * (180 / Math.PI);
   
   }

   static dodajSlider(target: any, controls: any[], containerId?: string) {
        const container = containerId ? document.getElementById(containerId)! : document.body;
        const panel = document.createElement("div");

        controls.forEach(c => {
            const val = c.value ?? target[c.key] ?? (c.min + c.max)/2;
            target[c.key] = val;

            const row = document.createElement("div");
            const label = document.createElement("label");
            label.textContent = c.label ?? c.key + ":";

            const input = document.createElement("input");
            input.type = "range";
            input.min = c.min.toString();
            input.max = c.max.toString();
            input.step = (c.step ?? 0.001).toString();
            input.value = val.toString();

            const span = document.createElement("span");
            span.textContent = val.toFixed(3);

            input.oninput = () => {
                const v = parseFloat(input.value);
                target[c.key] = v;
                span.textContent = v.toFixed(3);
            };

            row.append(label, input, span);
            panel.appendChild(row);
        });

        container.appendChild(panel);
    }

    static dodajCheckbox(target: any, key: string, label: string, initial = false, containerId?: string) {
        const container = containerId ? document.getElementById(containerId)! : document.body;
        const row = document.createElement("div");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = target[key] ?? initial;
        target[key] = input.checked;

        const lbl = document.createElement("label");
        lbl.textContent = label;

        input.onchange = () => target[key] = input.checked;

        lbl.onclick = () => input.click();

        row.append(input, lbl);
        container.appendChild(row);
    }

    static dodajRadio(target: any, key: string, labelText: string, options: {value: any, text: string}[], containerId?: string) {
        const container = containerId ? document.getElementById(containerId)! : document.body;
        const wrapper = document.createElement("div");

        const title = document.createElement("div");
        title.textContent = labelText;
        wrapper.appendChild(title);

        options.forEach(opt => {
            const row = document.createElement("label");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = key + "_" + (containerId || "global");
            radio.value = opt.value;
            radio.checked = target[key] === opt.value;

            radio.onchange = () => { if (radio.checked) target[key] = opt.value; };

            row.append(radio, document.createTextNode(" " + opt.text));
            wrapper.appendChild(row);
        });

        if (target[key] === undefined) {
            target[key] = options[0].value;
            wrapper.querySelector("input")!.checked = true;
        }

        container.appendChild(wrapper);
    }
}