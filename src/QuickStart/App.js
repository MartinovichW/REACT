import logo from './logo.svg';
import './styles.css';
import {useState} from 'react';

export default function AppQuickStart() {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    function handleClick2() {
        setCount(count + 3);
    }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
              </a>
              <MyButton />
              <MyButton2 count={count} onClick={handleClick} />
              <MyButton2 count={count} onClick={handleClick2} />
              <h1>{user.name}</h1>
              <img
                  className="avatar"
                  src={user.imageUrl}
                  alt={'Photo of ' + user.name}
                  style={{
                      width: user.imageSize,
                      height: user.imageSize
                  }}
              />
              <ShoppingList/>
      </header>
    </div>
  );
}

const products = [
    { title: 'Cabbage', isFruit: false, id: 1 },
    { title: 'Garlic', isFruit: false, id: 2 },
    { title: 'Apple', isFruit: true, id: 3 },
];

const user = {
    name: 'Hedy Lamarr',
    imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
    imageSize: 90,
};

function ShoppingList() {
    const listItems = products.map(product =>
        <li
            key={product.id}
            style={{
                color: product.isFruit ? 'magenta' : 'darkgreen'
            }}
        >
            {product.title}
        </li>
    );

    return (
        <ul>{listItems}</ul>
    );
}

function MyButton2({ count, onClick }) {

    return (
        <button onClick={onClick}>
            Clicked {count} times
        </button>
    );
}


function MyButton() {
    return (
        <button>
            I'm a button
        </button>
    );
}