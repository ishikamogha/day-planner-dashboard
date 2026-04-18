import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store.js';
import Panel from './panel.jsx';

//main app
function App(){
  return(
    <Provider store={store}>
        <BrowserRouter>
          <Panel/>
        </BrowserRouter>
    </Provider>
  );
}

export default App;
