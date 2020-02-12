# ui-controls

## **Usage**

```
import Controls from 'ui-controls'

const wrapper = document.getElementById("app");

const info = {
    name: 'John',
    isAdmin: false,
    age: 28,
    note: 'Working a driver',
}

const controls = new Controls(wrapper, info)

controls.add('name')
controls.add('age')
controls.add('isAdmin')
```

### [See this demo](https://maksimkunaev.github.io/ui-controls/).
