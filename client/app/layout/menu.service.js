(function (module) {
    'use strict';

    module.factory('menu', ['$location', function ($location) {

        var sections = [{
            name: 'Startseite',
            state: 'home',
            type: 'link'
        }];

        sections.push({
            name: 'Gemeinden',
            type: 'toggle',
            pages: [{
                name: 'Gemeindekennzahlen',
                type: 'link',
                state: 'persons',
                icon: 'fa fa-group'
            }, {
                name: 'Gemeindearten',
                state: 'persontypes',
                type: 'link',
                icon: 'fa fa-map-marker'
            }]
        });

        sections.push({
            name: 'Haushalt',
            type: 'toggle',
            pages: [{
                name: 'Kontenplan',
                type: 'link',
                state: 'framework',
                icon: 'fa fa-group'
            }, {
                name: 'Haushalt',
                state: 'budget',
                type: 'link',
                icon: 'fa fa-map-marker'
            }]
        });

        sections.push({
            name: 'Daten',
            type: 'toggle',
            pages: [{
                name: 'Import',
                type: 'link',
                state: 'import',
                icon: 'fa fa-group'
            }]
        });

        var services;

        services = {
            sections: sections,

            toggleSelectSection: function (section) {
                services.openedSection = (services.openedSection === section ? null : section);
            },
            isSectionSelected: function (section) {
                return services.openedSection === section;
            },

            selectPage: function (section, page) {
                // page && page.url && $location.path(page.url); //??
                if (page && page.url && $location.path(page.url)) {
                    services.currentSection = section;
                    services.currentPage = page;
                }
            }
        };
        return services;
    }]);

}(angular.module('app.services')));