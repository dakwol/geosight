export const API_TOKEN_MODEL = {
    entity: 'token',
    url: 'users/',
    methods: {
        login:{
            url: 'login/'
        }
    },
}
export const API_USER_MODEL = {
    entity: 'users',
    url: 'users/',
    methods: {
        login:{
            url: 'login/'
        },
        editUser:{
            url: 'edit/'
        },
        getUsersCompanies:{
            url: 'companies/'
        },
        getCompanyUsers:{
            url: 'company_users/'
        },
        sendCode:{
            url: 'send-activation-code/'
        },
        checkActivationCode:{
            url: 'check-activation-code/'
        },
        resetPassword:{
            url: 'reset-password/'
        },
        cards:{
            url: 'cards/'
        },
    },
}
export const API_PASSWORD_MODEL = {
    entity: 'reset-password',
    url: 'reset-password/',
    methods: {
        
    },
}