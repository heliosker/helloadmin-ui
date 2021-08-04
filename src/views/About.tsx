import { defineComponent } from 'vue';
import HelloWord from '../components/HelloWord';
import Logo from '@/assets/logo.svg';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <>
        <h1>About</h1>
        <img src={Logo}/>
        <HelloWord/>
      </>
    );
  }
});
