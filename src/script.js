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
            <button data-el="decodePatriciaNode">Patricia Node</button>
            <button data-el="decodeAccountNode">Account Leaf Node</button>
        </div>
        <pre data-el="decodedValue" style="white-space:pre-wrap;word-break:break-all"></pre>
    `;

    constructor () {
        this.element = document.createElement('div');
        this.element.classList.add('cell');
        this.element.innerHTML = NotebookCell.template;
        this.mapElements();
        this.setupEvents();
    }

    onInitialResult (fn) {
        this._resultCb = fn;
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
            if (this._resultCbInvoked !== true) {
                this._resultCbInvoked = true;
                this._resultCb();
            }
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

        const fromRlpToObject = (keys) => {
            const values = rlp();
            const data = {};

            for (let [i, k] of keys.entries()) {
                data[k] = values[i];
            }

            this.elements.decodedValue.textContent = JSON.stringify(data, null, 4);
        }

        this.elements.decodeBlockHeader.addEventListener('click', async () => {
            fromRlpToObject([
                'parentHash', 'ommersHash', 'beneficiary', 'stateRoot', 'transactionRoot',
                'receiptsRoot', 'logsBloom', 'difficulty', 'number', 'gasLimit', 'gasUsed',
                'timestamp', 'extraData', 'mixHash', 'nonce'
            ]);
        });

        this.elements.decodePatriciaNode.addEventListener('click', async () => {
            const result = rlp();
            if (result.length === 17) {
                fromRlpToObject([
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c',
                    'd', 'e', 'f', 'value'
                ]);
            }
            else if (result.length === 2) {
                if (['0', '1'].includes(result[0].charAt(0))) {
                    fromRlpToObject(['path', 'nextKey']);
                }
                else if (['2', '3'].includes(result[0].charAt(0))) {
                    fromRlpToObject(['path', 'value']);
                }
            }
        });

        this.elements.decodeAccountNode.addEventListener('click', async () => {
            const result = rlp();
            const value = result[1];
            const buf = bufferFromHex(value);
            const decoded = RLP.decode(buf);
            const account = arrToJSON(decoded);
            const data = {
                key: result[0],
                rawValue: value,
                rlpDecodedValue: account,
                accountDetails: {
                    nonce: account[0],
                    balance: account[1],
                    storageRoot: account[2],
                    codeHash: account[3]
                }
            };
            this.elements.decodedValue.textContent = JSON.stringify(data, null, 4);
        });
    }
}

createCell(document.getElementById('notebook'));

function createCell (notebook) {
    const notebookCell = new NotebookCell();

    notebookCell.onInitialResult(() => {
        createCell(notebook);
        window.scrollTo(0, document.body.scrollHeight);
    });

    notebook.appendChild(notebookCell.element);
}
