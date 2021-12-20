import { defineComponent } from 'vue';
import Logo from '@/assets/icons/logo.svg';

export default defineComponent({
    name: 'App',
    setup() {
        return () => (
            <>
                <h1>About</h1>
                <img src={Logo} width="100" />
            </>
        );
    }
});
