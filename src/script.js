import RLP from 'rlp';
import { bufferFromHex, arrToJSON } from './util.js';

class NotebookCell {
    static template = `
        <div style="display:flex">
            <input data-el="key" type=text style="flex:1 1 auto" />
            <button data-el="button" style="flex:0 0 auto" >Query</button>
        </div>
        <pre data-el="value" style="white-space:pre-wrap;word-break:break-all"></pre>
        <div style="display:flex">
            <span>Decode:</span>
            <button data-el="decodeRLP">RLP</button>
            <button data-el="decodeBlockHeader">Block Header JSON from RLP</button>
        </div>
        <pre data-el="decodedValue" style="white-space:pre-wrap;word-break:break-all"></pre>
    `;

    constructor () {
        this.element = document.createElement('div');
        this.element.innerHTML = NotebookCell.template;
        this.mapElements();
        this.setupEvents();
    }

    mapElements () {
        const els = this.element.querySelectorAll('[data-el]');
        this.elements = {};
        for (let el of Array.from(els)) {
            this.elements[el.dataset.el] = el;
        }
    }

    setupEvents () {
        this.elements.button.addEventListener('click', async () => {
            const key = this.elements.key.value;
            const fetchResponse = await fetch(`http://leveldb.logisol.io/query/${key}`);
            const response = await fetchResponse.json();
            const value = response.blobValue ?? response.value;
            this.elements.value.textContent = value;
            this.elements.decodedValue.textContent = '';
        });

        const rlp = () => {
            const value = this.elements.value.textContent;
            const buf = bufferFromHex(value);
            const decoded = RLP.decode(buf);
            const arr = arrToJSON(decoded);
            return arr;
        };

        this.elements.decodeRLP.addEventListener('click', async () => {
            this.elements.decodedValue.textContent = JSON.stringify(rlp());
        });

        this.elements.decodeBlockHeader.addEventListener('click', async () => {
            const keys = [
                'parentHash', 'ommersHash', 'beneficiary', 'stateRoot', 'transactionRoot',
                'receiptsRoot', 'logsBloom', 'difficulty', 'number', 'gasLimit', 'gasUsed',
                'timestamp', 'extraData', 'mixHash', 'nonce'
            ];
            const values = rlp();
            const data = {};

            for (let [i, k] of keys.entries()) {
                data[k] = values[i];
            }

            this.elements.decodedValue.textContent = JSON.stringify(data, null, 4);
        });
    }
}

const notebook = document.getElementById('notebook');
const notebookCell = new NotebookCell();

notebook.appendChild(notebookCell.element);
