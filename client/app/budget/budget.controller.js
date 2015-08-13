(function () {
    'use strict';

    angular.module('nkfApp').controller('BudgetController', BudgetController);

    BudgetController.$inject = ['$scope', '$state', '$http', 'nkfApi', 'productTypes', 'frameworkShortcuts'];

    function BudgetController($scope, $state, $http, nkfApi, productTypes, frameworkShortcuts) {
        /* jshint validthis: true */
        var vm = this;

        vm.personId = 'de.05315000';

        vm.yearDimensionData = {};
        //vm.prod1Dimension = {};
        //vm.prod2Dimension = {};
        //vm.prod3Dimension = {};
        //vm.prod1SumGroup = {};
        //vm.prod2SumGroup = {};
        //vm.prod3SumGroup = {};
        //vm.paymentDimension = {};
        //vm.paymentGroup = {};
        //vm.paymentRangeChartOptions = {};
        //vm.paymentsOutSumGroup = {};
        //vm.paymentsSumGroup = {};
        //vm.setupRangeChart = {};
        //vm.piePostSetupChart;

        vm.productTypes = {};
        vm.frameworkShortcuts = {};

        vm.rowChartOptions = {
            width: 300,
            height: 200,
            gap: 2,
            cap: 7,
            othersLabel: 'Sonstige',
            elasticX: true,
            elasticY: true,
            sortBy: function (d) {return d.amount;},
            x: d3.scale.linear()
        };

        vm.de_DE = {
            decimal: ",",
            thousands: ".",
            grouping: [3],
            currency: ["", "\xa0€"]
        };

        var currenFormat = d3.format(',.0f');

        vm.rowChartPostSetup = function (c) {
            c.label(function (d) {
                return d.key + ' ' + (vm.productTypes[d.key] ? vm.productTypes[d.key] : '');
            })
                .title(function (d) {
                    return d.key + ': ' + currenFormat(d.value / 1000) + ' Mio.€';
                })
                //.xAxis().tickFormat(formatCurrency)
                .xAxis().tickFormat(
                function (v) {
                    return v / 1000;
                })
            ;
            c.xAxis().ticks(5);

        };

        var formatNumber = d3.format(".1f");

        function formatCurrency(d) {
            var s = formatNumber(d / 1000);
            //var t = $scope.d3.scale.linear().domain();
            //var t = vm.rowChartOptions.x.domain();
            //var u = d === t[1] ? s + " Mio.€" : s;
            return s;
            //return d === $scope.x.domain()[1] ? s + " Mio.€" : s;
        }


        for (var i = 0, len = productTypes.length; i < len; i++) {

            vm.productTypes[productTypes[i].id] = productTypes[i].label;
        }

        for (var i = 0, len = frameworkShortcuts.length; i < len; i++) {

            vm.frameworkShortcuts[frameworkShortcuts[i].id] = frameworkShortcuts[i].shortcut;
        }
        //console.log(vm.frameworkShortcuts);

        // ui-grid
        //vm.gridOptions = {
        //    data: 'vm.yearDimensionData',
        //    enableFiltering: true,
        //    enableSorting: true,
        //    enableGridMenu: true,
        //    columnDefs: [
        //        {field: 'bookingYear', displayName: 'Jahr',  width: '*'},
        //        {field: 'productId', displayName: 'Produkt', type: 'string', width: '*'},
        //        {field: 'account', displayName: 'Konto', type: 'string', width: '*'},
        //        {field: 'amount', displayName: 'Betrag', cellTemplate: '<div class=\'ui-grid-cell-contents\' style=\'text-align: right\'>{{COL_FIELD  | currency:\'€\':0}}</div>' }
        //    ],
        //    importerDataAddCallback: function (grid, newObjects) {
        //        vm.yearDimensionData = vm.yearDimensionData.concat(newObjects);
        //    },
        //    onRegisterApi: function (gridApi) {
        //        vm.gridApi = gridApi;
        //    }
        //
        //};

        vm.bookingsData = function (values) {
            vm.loading = true;
            var numberFormat = d3.format('04d');
            var currenFormat = d3.format(',.0f');
            //var DE = d3.locale(vm.de_DE);

            //console.log(vm.bookingsData[0].personId);
            nkfApi.getBookingsByPid(values)
                .then(function (results) {

                    results.forEach(function (d) {
                        //d.bookingYear = numberFormat(d.bookingYear);
                        if (d.account.substring(0, 7) === 'NKF05F1') {
                            d.paymentsIn = d.amount;
                            d.paymentsOut = null;
                        } else {
                            d.paymentsIn = null;
                            d.paymentsOut = d.amount;
                        }
                    });
                    //console.log('Imported bookings data', results);

                    vm.ndx = crossfilter(results);
                    //console.log(vm.ndx);

                    vm.yearDimension = vm.ndx.dimension(function (d) {
                        return d.bookingYear;
                    });
                    //console.log(vm.yearDimension.top(4));
                    vm.paymentsSumGroup = vm.yearDimension.group().reduceSum(function (d) {
                        return Math.round(d.paymentsIn / 1000000);
                    });

                    vm.paymentsOutSumGroup = vm.yearDimension.group().reduceSum(function (d) {
                        return Math.round(d.paymentsOut / 1000000);
                    });

                    //console.log(vm.paymentsSumGroup.top(3));
                    //console.log(vm.paymentsOutSumGroup.top(2));

                    vm.prod1Dimension = vm.ndx.dimension(function (d) {
                        return d.productId.substring(0, 1);
                    });

                    vm.prod1SumGroup = vm.prod1Dimension.group().reduceSum(function (d) {
                        return Math.round(d.paymentsOut / 1000);
                    });

                    vm.prod2Dimension = vm.ndx.dimension(function (d) {
                        return d.productId.substring(0, 2);
                    });

                    vm.prod2SumGroup = vm.prod2Dimension.group().reduceSum(function (d) {
                        return Math.round(d.paymentsOut / 1000);
                    });

                    vm.prod3Dimension = vm.ndx.dimension(function (d) {
                        return d.productId.substring(0, 3);
                    });

                    vm.prod3SumGroup = vm.prod3Dimension.group().reduceSum(function (d) {
                        return Math.round(d.paymentsOut / 1000);
                    });

                    //Payment group dimension
                    vm.paymentDimension = vm.ndx.dimension(function (d) {
                        return Math.round(d.amount / 1000);
                    });
                    vm.paymentMax = Math.round(vm.paymentDimension.top(1)[0].amount / 1000);

                    //console.log(vm.paymentDimension);
                    //vm.paymentGroup = vm.paymentDimension.group(function (d) {
                    //    return d.aumount;
                    //});
                    vm.paymentGroup = vm.paymentDimension.group().reduceSum(function (d) {
                        return Math.round(d.amount / 1000);
                    });
                    //console.log(vm.paymentGroup);

                    vm.paymentRangeChartOptions = {
                        // title can be called by any stack layer.
                        title: function (d) {
                            return d.value;
                        }
                    };

                    vm.rsc = dc.barChart("#paymentRangeSelectChart" );
                    vm.rsc.alwaysUseRounding(true)
                        .width(1100)
                        .height(85)
                        .margins({top: 0, right: 0, bottom: 45, left: 60})
                        .brushOn(true)
                        .elasticX(true)
                        .elasticY(true)
                        .centerBar(true)
                        .gap(1)
                        .dimension(vm.paymentDimension)
                        .group(vm.paymentGroup)
                        .outerPadding(0.05)
                        //.renderHorizontalGridLines(true)
                        .xAxisLabel('Zahlungen gruppiert nach Jahr, Produkt, Konto und Betrag in T€')
                        .yAxisLabel(' ')
                        .x(d3.scale.linear().domain([0, vm.paymentMax]))
                        .yAxis().ticks(0)
                    ;

                    vm.setupRangeChart = function (myRangeChart) {
                        myRangeChart.rangeChart(vm.rsc);
                        vm.rsc.render();
                    };

                    //vm.rowChartProductField = dc.rowChart("#rowChartProductField");
                    //vm.rowChartProductField
                    //    .dimension(vm.prod1Dimension)
                    //    .group(vm.prod1SumGroup)
                    //    .chartGroup("1")
                    //    .width(300)
                    //    .height(200)
                    //    .gap(2)
                    //    .cap(7)
                    //    .othersLabel('Sonstige')
                    //    .elasticX(true)
                    //    .elasticY(true)
                    //    .sortBy(function (d) {return d.amount;})
                    //    .x(d3.scale.linear().domain([0, 2000000]))
                    //;
                    //
                    //vm.rowChartProductField.render();

                    // data table does not use crossfilter group but rather a closure
                    // as a grouping function
                    vm.tableGroup = function (d) {

                        return d.bookingYear;
                    };

                    vm.piePostSetupChart = function (c) {
                        c.label(function (d) {
                            return d.key + ' ' + vm.productTypes[d.key];
                            //return d.key;
                        });
                    };

                    vm.tablePostSetupChart = function (c) {
                        // dynamic columns creation using an array of closures
                        c.columns([
                            function (d) {
                                return d.bookingYear;
                            },
                            function (d) {
                                return d.productId + ' ' + (vm.productTypes[d.productId] ? vm.productTypes[d.productId] : '');
                            },
                            function (d) {
                                return d.account + ' ' + (vm.frameworkShortcuts[d.account] ? vm.frameworkShortcuts[d.account] : '');
                            },
                            function (d) {
                                return '<span style="float:right; padding-right:5px">' + currenFormat(d.amount) + '</span>';
                            }
                        ])
                            // (optional) sort using the given field, :default = function(d){return d;}
                            .sortBy(function (d) {
                                return d.amount;
                            })
                            // (optional) sort order, :default ascending
                            .order(d3.descending)
                            // (optional) custom renderlet to post-process chart using D3
                            .on('renderlet', (function (table) {
                                table.selectAll(".dc-table-group").classed("info", true);
                            }));

                        //vm.yearDimensionData = vm.yearDimension.top(Infinity);
                    };


                })
                .catch(function (err) {
                    console.log('Error Imported bookings data', err);
                })
                .finally(function () {
                    vm.loading = false;
                });
        };

        //vm.chart = dc.barChart("#test");
        //
        //vm.counts = [
        //    {name: "apple", cnt: 10},
        //    {name: "orange", cnt: 15},
        //    {name: "banana", cnt: 12},
        //    {name: "grapefruit", cnt: 2},
        //    {name: "grapefruit", cnt: 4}
        //];
        //
        //vm.ndx2            = crossfilter(vm.counts);
        //vm.fruitDimension = vm.ndx2.dimension(function(d) {return d.name;});
        //vm.sumGroup       = vm.fruitDimension.group().reduceSum(function(d) {return d.cnt;});
        //
        //vm.chart
        //    .width(768)
        //    .height(380)
        //    .x(d3.scale.ordinal())
        //    .xUnits(dc.units.ordinal)
        //    .brushOn(false)
        //    .xAxisLabel("Fruit")
        //    .yAxisLabel("Quantity Sold")
        //    .dimension(vm.fruitDimension)
        //    .barPadding(0.1)
        //    .outerPadding(0.05)
        //    .group(vm.sumGroup);
        //
        //vm.chart.render();

    }
})();