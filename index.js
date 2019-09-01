const object = {
    name: 'John',
    isAdmin: false,
    age: 28,
    note: 'Working a driver',
};

const wrapper = document.getElementById("app");
const controls = new Controls(wrapper, object);

controls.add('name');
controls.add('note');
controls.add('age');
controls.add('isAdmin');

function Controls(parentElem, object) {
    this.htmlElements = {};
    this.wrapper = createElement({ htmlTag: 'div', attributes: { class: 'wrapper' }});
    this.htmlInfo = {
        string: { htmlTag: 'input', attributes: { type: 'text', class: 'element', tabindex: 1 }},
        number: { htmlTag: 'input', attributes: { type: 'number', class: 'element', tabindex: 1 }},
        boolean: { htmlTag: 'input', attributes: { type: 'checkbox', class: 'element', tabindex: 1 }},
        array: { htmlTag: 'select', attributes: { class: 'element', tabindex: 1 }},
    };
    this.cssClasses = {
        string: 'textInput',
        number: 'textInput',
        boolean: 'checkboxInput',
        array: 'checkboxInput',
    };
    this.parentElem = parentElem;
    this.data = object;

    this.add = (name) => {
        const elementAttributes = this.compileAttributes(name);
        const typeElement = this.getType(name);
        let element = null;

        if (typeElement === 'array') {
            element = createSelect(elementAttributes, name, this.data[name])
        } else {
            element = createElement(elementAttributes);
        }

        this.htmlElements[name] = { element, htmlInfoType: typeElement };

        element.addEventListener('input', this.onChange(name));

        const ui = wrapElement(element, name, this.cssClasses[typeElement], typeElement);
        this.wrapper.appendChild(ui);
        this.parentElem.appendChild(this.wrapper);
    };

    this.getType = (name) => {
        let resultType = '';

        if (typeof this.data[name] === 'object') {
            Array.isArray(this.data[name])
                ?  resultType = 'array'
                : resultType = 'object'
        } else {
            resultType = typeof this.data[name]
        }
        return resultType;
    };

    this.compileAttributes = function(name) {
        const myType = this.getType(name);
        const htmlInfo = this.htmlInfo[myType];

        const value = this.data[name];
        const newAttributes = { ...htmlInfo };

        newAttributes.attributes.value = value;
        newAttributes.attributes.id = name;

        if (htmlInfo.attributes.type === 'checkbox' && this.data[name]) {
            newAttributes.attributes.checked = true;
        }
        return  newAttributes;
    };

    this.onChange = function(name) {
        const that =  this;
        return function(e) {
            const type = that.getType(name);
            const tagTypeAttribute = that.htmlInfo[type].attributes.type;

            if (tagTypeAttribute === 'checkbox') {
                that.data[name] = e.target.checked
            } else if (tagTypeAttribute === 'number') {
                that.data[name] = Number(e.target.value)
            } else {
                that.data[name] = e.target.value;
            }

            const preview = document.querySelector(".preview");
            showPreview(preview, that.data)
        }
    };

    function showPreview(preview, data) {
        let textContent = '<b>Your data has changed! <br><br></b>';
        for (let key in data) {
            textContent += `<i>${key}: ${data[key]} <br></i>`
        }
        preview.innerHTML = textContent;
    }

    function wrapElement(element, name, cssCLass, typeElement) {
        const div = document.createElement('div');
        const label = document.createElement('label');
        if (typeElement === 'boolean') {
            label.textContent = name;
        }
        div.setAttribute('class', cssCLass);
        label.setAttribute('id', name);
        label.setAttribute('for', name);
        div.appendChild(element);
        div.appendChild(label);

        return div;
    };

    function createElement(elementAttributes) {
        const { htmlTag, attributes } = elementAttributes;

        const element = document.createElement(htmlTag);

        for (let key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
            }
        }

        return element;
    };

    function createSelect(elementAttributes, name, data) {
        const element = createElement(elementAttributes);
        for (let key in data) {
            const textValue = data[key];
            const option = createElement({ htmlTag: 'option', attributes: { value: textValue, class: ''}});
            option.textContent = textValue;
            element.appendChild(option);
        }
        return element;
    };
}



