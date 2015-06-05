module = angular.module 'timeline.config', [ 'restangular', 'toaster', 'config' ]


module.config (RestangularProvider, config) ->

    RestangularProvider.setBaseUrl config.api_url
    RestangularProvider.setDefaultHeaders Authorization: 'Bearer ' + window.localStorage.getItem 'access_token'

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


module.run (Restangular, toaster, $rootScope) ->
    Restangular.setErrorInterceptor (response) ->
        toaster.error response.data.error_description

    $rootScope.$on '$stateChangeSuccess', ->
        toaster.clear()
