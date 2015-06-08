module = angular.module 'sportily.fixture.config', [ 'restangular' ]


module.config [ 'RestangularProvider', (RestangularProvider) ->
    RestangularProvider.setBaseUrl 'http://oauth.sporti.ly'
    RestangularProvider.setDefaultHeaders Authorization: 'Bearer ' + window.localStorage.getItem 'access_token'

    RestangularProvider.setErrorInterceptor (response) ->
        console.error response

    RestangularProvider.addResponseInterceptor (data, operation) ->
        result = null

        if operation == 'getList'
            result = data.data
            result.lookup = generateLookup data.data
        else
            result = data

        result


    generateLookup = (items) ->
        result = {}
        result[item.id] = item for item in items
        result

]
