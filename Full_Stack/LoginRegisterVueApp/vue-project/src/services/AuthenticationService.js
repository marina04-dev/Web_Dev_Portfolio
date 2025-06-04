import Api from '@/services/Api';

export default {
    register (credentials) {
        return Api().post('register', credentials);
    },
    login (credentials) {
        return Api().post('login', credentials);
    }
}

/* How Does This File Work
AuthenticationService.register({
    email: 'testing@gmail.com',
    password: '12345'
})
*/